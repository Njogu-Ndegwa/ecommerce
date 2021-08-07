var { PostGressConnection } = require('./database');
const {groupByColumn} = require('./grou_by_column')
const RealPostgress = new PostGressConnection();


      function firstEver(data_set, appends, primary_activity, res) {
        if(appends[0].append_type === 'first-ever' ||
        appends[0].append_type === 'first-before' ) {
         
          RealPostgress.ReadQuery(`CREATE VIEW first_ever_view as SELECT az1.activity_id, az1.ts, az1.source, az1.source_id, az1.customer, az1.activity, az1.feature_1,az1.feature_2, az1.feature_3, az1.revenue_impact, az1.link, CASE WHEN az1.ts = (SELECT MIN(ts) FROM generate_data_view as az where az.customer = az1.customer and az.activity = '${appends[0].activity_type}') THEN 0 ELSE 1 end as first_ever_secondary, CASE WHEN az1.activity = '${appends[0].activity_type}' THEN 1 ELSE 0 end as secondary_activity, CASE WHEN az1.activity = '${primary_activity}' THEN 1 ELSE 0 end as primary_activity from generate_data_view as az1`, function (data_set1) { 
            console.log("View Created")
          })
    RealPostgress.ReadQuery('select * from first_ever_view', function (data_set) { 
        res.setHeader('Content-Type', 'application/json')
        res.send(data_set.rows)
      });
    }
      }
      

function lastEver(data_set, appends, primary_activity, res) {
    let sql1 = `SELECT az1.customer, az1.activity,
    case
    when activity = '${primary_activity}'
    then
      (select MAX(ts) as ts from activity_stream as az
      where activity = '${appends[0].activity_type}' and az1.customer = az.customer order by ts)
    end as last_ever
    FROM public.activity_stream as az1 group by last_ever, az1.customer, az1.activity
    `;
    if(appends[0].append_type === 'last-ever' || appends[0].append_type === 'last-before') {
    RealPostgress.ReadQuery(sql1, function (data_set1) {
        res.setHeader('Content-Type', 'application/json')
        for(let i = 0; i<data_set1.rows.length; i++){
          for(let j = 0; j<data_set.rows.length; j++) {
            let date1 = new Date(data_set.rows[j].ts).getTime()
            let date2 = new Date(data_set1.rows[i].first_ever).getTime()
            if(date1 === date2){
              data_set.rows[j].last_ever = 1
            }
            else if(date1 !== date2)  {
              data_set.rows[j].last_ever = 0
            }
        }
      }
      for(let i = 0; i<data_set.rows.length; i++) {
        if(data_set.rows[i].activity === `${appends[0].activity_type}`){
          data_set.rows[i].did_secondary_activity = 1
        }
        else if(data_set.rows[i].activity !== `${appends[0].activity_type}`){
          data_set.rows[i].did_secondary_activity = 0
        }
      }
    
        res.send(data_set.rows);
      });
    }
}

function firstBetween(data_set, appends, primary_activity, res) {
    let sql1 = `select a.activity_id, a.ts, a.customer, a.activity,
    case when a.activity = '${primary_activity}' then
      (select b.activity_id from activity_stream b where a.customer = b.customer and b.activity = '${appends[0].activity_type}' and b.ts between a.ts and (select c.ts from activity_stream c where a.customer = c.customer and c.activity = '${primary_activity}' and a.ts < c.ts limit 1) order by b.ts limit 1)
    end as first_in_between
    from activity_stream as a
    order by ts
    `;
    if(appends[0].append_type === 'first-between') {
    RealPostgress.ReadQuery(sql1, function (data_set1) {
        res.setHeader('Content-Type', 'application/json')
        for(let i = 0; i<data_set1.rows.length; i++){
          for(let j = 0; j<data_set.rows.length; j++) {
           if(data_set1.rows[i].activity_id === data_set.rows[j].activity_id) {
               if(data_set1.rows[i].first_in_between) {
                   data_set.rows[j].first_between = 1
               }
               else if(!data_set1.rows[i].first_in_between) {
                data_set.rows[j].first_between = 0
               }
           }
        }
      }
      for(let i = 0; i<data_set.rows.length; i++) {
        if(data_set.rows[i].activity === `${appends[0].activity_type}`){
          data_set.rows[i].did_secondary_activity = 1
        }
        else if(data_set.rows[i].activity !== `${appends[0].activity_type}`){
          data_set.rows[i].did_secondary_activity = 0
        }
      }
    
        res.send(data_set.rows);
      });
    }
}

function lastBetween(data_set, appends, primary_activity, res) {
    let sql1 = `select a.activity_id, a.ts, a.customer, a.activity,
    case when a.activity = '${primary_activity}' then
      (select b.activity_id from activity_stream b where a.customer = b.customer and b.activity = '${appends[0].activity_type}' and b.ts between a.ts and (select c.ts from activity_stream c where a.customer = c.customer and c.activity = '${primary_activity}' and a.ts < c.ts limit 1) order by b.ts desc limit 1)
    end as last_in_between
    from activity_stream as a
    order by ts
    `;
    if(appends[0].append_type === 'last-between') {
    RealPostgress.ReadQuery(sql1, function (data_set1) {
        res.setHeader('Content-Type', 'application/json')
        for(let i = 0; i<data_set1.rows.length; i++){
          for(let j = 0; j<data_set.rows.length; j++) {
           if(data_set1.rows[i].activity_id === data_set.rows[j].activity_id) {
               if(data_set1.rows[i].last_in_between) {
                   data_set.rows[j].last_between = 1
               }
               else if(!data_set1.rows[i].last_in_between) {
                data_set.rows[j].last_between = 0
               }
           }
        }
      }
      for(let i = 0; i<data_set.rows.length; i++) {
        if(data_set.rows[i].activity === `${appends[0].activity_type}`){
          data_set.rows[i].did_secondary_activity = 1
        }
        else if(data_set.rows[i].activity !== `${appends[0].activity_type}`){
          data_set.rows[i].did_secondary_activity = 0
        }
      }
    
        res.send(data_set.rows);
      });
    }
}

function aggregationAll(data_set, appends, primary_activity, res) {
    let sql1 = `SELECT  *,
    case
    when activity = '${primary_activity}'
    then
    (select
    count(*) over (partition by customer order by ts)
    from activity_stream as az where activity = '${appends[0].activity_type}' and az1.customer = az.customer order by ts DESC limit 1)
end as aggregate_all_ever
FROM public.activity_stream as az1
    `;
    if(appends[0].append_type === 'aggregation-all') {
    RealPostgress.ReadQuery(sql1, function (data_set1) {
        res.setHeader('Content-Type', 'application/json')
        for(let i = 0; i<data_set1.rows.length; i++){
            for(let j = 0; j<data_set.rows.length; j++){
                console.log(Boolean(data_set.rows[j].activity_id === data_set1.rows[i].activity_id))
                if(data_set.rows[j].activity_id === data_set1.rows[i].activity_id) {
                    data_set.rows[j].aggregate_all_ever = parseInt(data_set1.rows[i].aggregate_all_ever)
                }
            }
        }
        res.send(data_set.rows);
      });
    }
}

module.exports = {
    firstEver,
    lastEver,
    firstBetween,
    lastBetween,
    aggregationAll
}

