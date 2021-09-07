var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cors = require('cors')
var { PostgressFuntion } = require('./modules/postgress');
var KnexStaticDatabases = require('./modules/knex.class');
var { PostGressConnection } = require('./modules/database');
const PostgressObj = new PostgressFuntion();
const RealPostgress = new PostGressConnection();
const KendObj = new KnexStaticDatabases();

var indexRouter = require('./routes/index');
var chartsRouter = require('./routes/charts');
const { data } = require('./charts');
const {groupByColumn, groupByColumn2, groupByDay, groupByMonth, groupByYear, groupByWeek} = require('./modules/grou_by_column')
const {firstEver, lastEver, firstBetween, lastBetween, lastBefore, firstBefore, aggregationAll, customParseInt} = require('./modules/secondary_activities')

// app instance
var app = express();
// app.use(bodyParser.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// midllewares
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/charts', chartsRouter);

app.get('/', function (req, res) {
  res.send(`
    <h2>Links </h2>
    <ul>
        <li>To Create and Insert Data to Database<a href="/create-insert-activity-stream"> Link</a></li>
        <li>To Create and Insert Data to View Demo<a href="/create-insert-viewdemo-stream"> Link</a></li>
        <li>To Create and Insert Data to Activity Reference Table<a href="/create-insert-activity-reference-table"> Link</a></li>
        <li>To Create and Insert Data to /first-ever <a href="/first-ever"> Link</a></li>
        <li>To Create and Insert Data to /last-ever <a href="/last-ever"> Link</a></li>
        <li>To Create and Insert Data to /first-before <a href="/first-before"> Link</a></li>
        <li>To Create and Insert Data to /last-before <a href="/last-before"> Link</a></li>
        <li>To Create and Insert Data to /first-between <a href="/first-between"> Link</a></li>
        <li>To Create and Insert Data to /last-between <a href="/last-between"> Link</a></li>
        <li>To Create and Insert Data to /aggregation-all <a href="/aggregation-all"> Link</a></li>

    </ul>
   `);
});

app.get('/getall', function (req, res) {
  PostgressObj.SelectAll((dataset) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(dataset);
  });
});

app.get('/activity_types', function (req, res) { 
  let sql1 = `SELECT DISTINCT a.activity, r.feature_1, r.feature_2, r.feature_3 from activity_stream as a CROSS JOIN activity_reference as r where a.activity = r.activity;`
  let sql = `SELECT DISTINCT acts.activity FROM public.activity_stream as acts;`;
  RealPostgress.ReadQuery(sql1, function (data_set) {
    res.setHeader('Content-Type', 'application/json');
    console.log(data_set.rows)
    res.send(data_set.rows);
    
  });
});

// app.get('/create-insert-activity-stream', function (err, res) {
//   KendObj.CreateActivityStream(() => {
//     PostgressObj.InsertActivityData((state) => {
//       res.setHeader('Content-Type', 'application/json');
//       res.send({ state: state, message: 'Table Created success' });
//     });
//   });
// });

app.get('/create-insert-activity-stream', function (err, res) {
  KendObj.CreateActivityStream(() => {
    PostgressObj.InsertActivityData((state) => {
      res.setHeader('Content-Type', 'application/json');
      res.send({ state: state, message: 'Table Created success' });
    });
  });
});


// KendObj.CreateActivityStream(() => {
//   PostgressObj.InsertActivityData((state) => {
//     // res.setHeader('Content-Type', 'application/json');
//     // res.send({ state: state, message: 'Table Created success' });
//   });
// });


// KendObj.CreateViewDemoStream(() => {
//   PostgressObj.InsertViewDemoData((state) => {
//     console.log(state)
//     console.log("View demo table created succesfully")
//   })
// })


app.get('/create-insert-viewdemo-stream', function (err, res) {
  KendObj.CreateViewDemoStream(() => {
    PostgressObj.InsertViewDemoData((state) => {
      res.setHeader('Content-Type', 'application/json');
      res.send({ state: state, message: 'Table Created success' });
    });
  });
});

app.get('/create-insert-activity-reference-table', function (err, res) {
  KendObj.CreateActivityReferenceTable(() => {
    PostgressObj.InsertActivityReference((state) => {
      res.setHeader('Content-Type', 'application/json');
      res.send({ state: state, message: 'Table Created success' });
    });
  });
});



const isBlank = (value) => {
  return typeof value === 'undefined' || value === '' || value === null;
};


app.post('/generate-dataset', function (req, res) {
  const { appends, filters, primary_activity, measure, occurrence } = req.body;
  let filterQuery = '';
  (filters || []).forEach((item, index) => {
    if (isBlank(item.filter_type) || isBlank(item.name) || isBlank(item.attribute)) return;

    if (index === 0) filterQuery += 'AND (';
    else {
      filterQuery += ` ${filters[index - 1].join} `;
    }

    if (item.filter_type === 'excludes') {
      if (item.attribute === 'customer') {
        filterQuery += `LOWER(${item.attribute}) NOT LIKE '%${item.name.toLowerCase()}%'`;
      } else {
        filterQuery += `${item.attribute} != '${item.name}'`;
      }
    } else if (item.filter_type === 'includes') {
      if (item.attribute === 'customer') {
        filterQuery += `LOWER(${item.attribute}) LIKE '%${item.name.toLowerCase()}%'`;
      } else {
        filterQuery += `${item.attribute} = '${item.name}'`;
      }
    }
  });
``
  if (filterQuery) filterQuery += ')';

  let occurrenceQuery = '';
  let selectQuery = '*';
  switch (measure) {
    case 'first':
      occurrenceQuery += `ORDER BY ts ASC LIMIT 1`;
      break;

    case 'last':
      occurrenceQuery += `ORDER BY ts DESC LIMIT 1`;
      break;

    case 'nth':
      if (occurrence > 0) occurrenceQuery += `ORDER BY az1.customer ASC, ts DESC LIMIT 1 OFFSET ${occurrence - 1}`;
      break;

    default:
      occurrenceQuery += 'ORDER BY az1.customer ASC, ts DESC';
      break;
  }

  RealPostgress.ReadQuery(`CREATE OR REPLACE VIEW generate_data_view as SELECT DISTINCT az1.activity_id, az1.customer, az1.revenue_impact, v.occurence, az1.feature_1, az1.ts, az1.feature_2, az1.feature_3, az1.activity, az1.source, az1.source_id, az1.link FROM public.activity_stream AS az1 cross join viewdemo_stream as v where az1.activity_id = v.activity_id and az1.activity = '${primary_activity}' ${occurrenceQuery}
  `, function (data_set) {
    console.log('Generate Data View Created', data_set)
  })

  RealPostgress.ReadQuery(`select * from generate_data_view`, function (data_set) { 
    res.setHeader('Content-Type', 'application/json');
    if(appends.length >= 1) {

    if(appends[0].append_type === 'first-ever') {
      firstEver(data_set, appends, primary_activity, res)
    }
    else if(appends[0].append_type === 'last-ever') {
      lastEver(data_set, appends, primary_activity, res)
    }
    else if(appends[0].append_type === 'first-between') {
      firstBetween(data_set, appends, primary_activity, res)
    }

    else if(appends[0].append_type === 'last-between') {
      lastBetween(data_set, appends, primary_activity, res)
    }

    else if(appends[0].append_type === 'aggregation-all') {
      lastEver(data_set, appends, primary_activity, res)
    }
    else if(appends[0].append_type === 'first-before') {
      firstBefore(data_set, appends, primary_activity, res)
    }
    else if(appends[0].append_type === 'last-before') {
      lastBefore(data_set, appends, primary_activity, res)
    }
  }
  else {
    res.send(data_set.rows)
  }
}) 
});

app.get('/first-before', function (req, res) {
  const { primary_activity, append_activity } = req.query;
  let sql = `SELECT  *,
    case
    when activity = '${primary_activity}'
    then
    min(ts) filter (where activity = '${append_activity}') over (partition by customer order by ts)

end as first_before
FROM public.activity_stream as az1 order by ts
`;
  RealPostgress.ReadQuery(sql, function (data_set) {
    res.setHeader('Content-Type', 'application/json');
    res.send(data_set.rows);
  });
});

app.get('/last-before', function (req, res) {
  const { primary_activity, append_activity } = req.query;
  let sql = `SELECT  *,
    case
    when activity = '${primary_activity}'
    then
    max(ts) filter (where activity = '${append_activity}') over (partition by customer order by ts)

end as last_before
FROM public.activity_stream as az1 order by ts

`;
  RealPostgress.ReadQuery(sql, function (data_set) {
    res.setHeader('Content-Type', 'application/json');
    res.send(data_set.rows);
  });
});



app.get('/aggregation-all', function (req, res) {
  const { primary_activity, append_activity } = req.query;
  let sql = `SELECT  *,
    case
    when activity = '${primary_activity}'
    then
    (select
    count(*) over (partition by customer order by ts)
    from activity_stream as az where activity = '${append_activity}' and az1.customer = az.customer order by ts DESC limit 1)
end as aggregate_all_ever
FROM public.activity_stream as az1 order by ts `;
  RealPostgress.ReadQuery(sql, function (data_set) {
    res.setHeader('Content-Type', 'application/json');
    res.send(data_set.rows);
  });
});

var server = app.listen(5000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

// GROUP BY COLUMNS

// Group by Activity Id.
app.post('/group_by_activityid', (req, res) => {
  const {time, view} = req.body
  console.log(time, 'fdfdd')
  if(view) {
    if(time){
      RealPostgress.ReadQuery(`SELECT c.activity_id, DATE_TRUNC('${time}', c.ts) as monthly, SUM(revenue_impact) as total_revenue_impact, SUM(secondary_activity) as total_secondary, SUM(primary_activity) as total_primary, CASE WHEN SUM(secondary_activity) != 0 and SUM(primary_activity) != 0 THEN SUM(secondary_activity)/SUM(primary_activity) ELSE 0 end as conversion_rate from ${view} as c group by c.activity_id, DATE_TRUNC('${time}', c.ts) ORDER BY DATE_TRUNC('${time}', c.ts) ASC`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
        const data = customParseInt(data_set)
        res.send(data.rows);
      })
    } else {
      RealPostgress.ReadQuery(`
      SELECT c.activity_id, SUM(revenue_impact) as total_revenue_impact, SUM(secondary_activity) as total_secondary, SUM(primary_activity) as total_primary, CASE WHEN SUM(secondary_activity) != 0 and SUM(primary_activity) != 0 THEN SUM(secondary_activity)/SUM(primary_activity) ELSE 0 end as conversion_rate from ${view} as c group by c.activity_id`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
        
        let data = customParseInt(data_set)
        res.send(data.rows);
      })
    }
  } else {
    if(!time){
      RealPostgress.ReadQuery(`SELECT c.activity_id, SUM(c.revenue_impact) as total_revenue_impact from ${view} as c group by c.activity_id`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
        const data = customParseInt(data_set)
        res.send(data.rows);
      })
    } else if(time) {

      RealPostgress.ReadQuery(`
      SELECT c.activity_id, DATE_TRUNC('${time}', c.ts) as monthly from ${view} as c group by c.activity_id, DATE_TRUNC('${time}', c.ts) ORDER BY DATE_TRUNC('${time}', c.ts) ASC`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
        const data = customParseInt(data_set)
        res.send(data.rows);
      })
    }
  }
})
// Group by customers.
app.post('/group_by_customer', (req, res) => {
  const {time, view} = req.body
  console.log(time, 'fdfdd')
  if(view) {
    if(time){
      RealPostgress.ReadQuery(`SELECT c.customer, DATE_TRUNC('${time}', c.ts) as ${time}, SUM(revenue_impact) as total_revenue_impact, SUM(secondary_activity) as total_secondary, SUM(primary_activity) as total_primary, CASE WHEN SUM(secondary_activity) != 0 and SUM(primary_activity) != 0 THEN SUM(secondary_activity)/SUM(primary_activity) ELSE 0 end as conversion_rate from ${view} as c group by c.customer, DATE_TRUNC('${time}', c.ts) ORDER BY  DATE_TRUNC('${time}', c.ts) ASC`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
        const data = customParseInt(data_set)
        res.send(data.rows);
      })
    } else {
      RealPostgress.ReadQuery(`
      SELECT c.customer, SUM(revenue_impact) as total_revenue_impact, SUM(secondary_activity) as total_secondary, SUM(primary_activity) as total_primary, CASE WHEN SUM(secondary_activity) != 0 and SUM(primary_activity) != 0 THEN SUM(secondary_activity)/SUM(primary_activity) ELSE 0 end as conversion_rate from ${view} as c group by customer`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
        const data = customParseInt(data_set)
        res.send(data.rows);
      })
    }
  } else {
    if(!time){
      RealPostgress.ReadQuery(`SELECT c.customer, SUM(c.revenue_impact) as total_revenue_impact from generate_data_view as c group by c.customer`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
        const data = customParseInt(data_set)
        res.send(data.rows);
      })
    } else if(time) {
      RealPostgress.ReadQuery(`
      SELECT c.customer, DATE_TRUNC('${time}', c.ts) as monthly from generate_data_view as c group by c.customer, DATE_TRUNC('${time}', c.ts) ORDER BY DATE_TRUNC('${time}', c.ts) ASC`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
        const data = customParseInt(data_set)
        res.send(data.rows);
      })
    }
  }
  
})
// Group by timestamp.
app.post('/group_by_timestamp', (req, res) => {
  const {time, view} = req.body
  if(view) {
    if(time){
      RealPostgress.ReadQuery(`SELECT c.ts, DATE_TRUNC('${time}', c.ts) as monthly, SUM(revenue_impact) as total_revenue_impact, SUM(secondary_activity) as total_secondary, SUM(primary_activity) as total_primary, CASE WHEN SUM(secondary_activity) != 0 and SUM(primary_activity) != 0 THEN SUM(secondary_activity)/SUM(primary_activity) ELSE 0 end as conversion_rate from ${view} as c group by c.ts, DATE_TRUNC('${time}', c.ts) ORDER BY DATE_TRUNC('${time}', c.ts) ASC`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
        const data = customParseInt(data_set)
        res.send(data.rows);
      })
    } else if(!time) {
      RealPostgress.ReadQuery(`
      SELECT c.ts, SUM(revenue_impact) as total_revenue_impact, SUM(secondary_activity) as total_secondary, SUM(primary_activity) as total_primary, CASE WHEN SUM(secondary_activity) != 0 and SUM(primary_activity) != 0 THEN SUM(secondary_activity)/SUM(primary_activity) ELSE 0 end as conversion_rate from ${view} as c group by c.ts`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
        const data = customParseInt(data_set)
        res.send(data.rows);
      })
    }
  } else {
    if(!time){
      RealPostgress.ReadQuery(`SELECT c.ts, SUM(c.revenue_impact) as total_revenue_impact from ${view} as c group by c.ts`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
        const data = customParseInt(data_set)
        res.send(data.rows);
      })
    } else if(time) {
      RealPostgress.ReadQuery(`
      SELECT c.ts, DATE_TRUNC('${time}', c.ts) as monthly from ${view} as c group by c.ts, DATE_TRUNC('${time}', c.ts) ORDER BY DATE_TRUNC('${time}', c.ts) ASC`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
        const data = customParseInt(data_set)
        res.send(data.rows);
      })
    }
  }
})
// Group by source.
app.post('/group_by_source', (req, res) => {
  const {time, view} = req.body
  if(view) {
    if(time){
      RealPostgress.ReadQuery(`SELECT c.source, DATE_TRUNC('${time}', c.ts) as monthly, SUM(revenue_impact) as total_revenue_impact, SUM(secondary_activity) as total_secondary, SUM(primary_activity) as total_primary, CASE WHEN SUM(secondary_activity) != 0 and SUM(primary_activity) != 0 THEN SUM(secondary_activity)/SUM(primary_activity) ELSE 0 end as conversion_rate from ${view} as c group by c.source, DATE_TRUNC('${time}', c.ts) ORDER BY DATE_TRUNC('${time}', c.ts) ASC`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
        const data = customParseInt(data_set)
        res.send(data.rows);
      })
    } else if(!time) {
      RealPostgress.ReadQuery(`
      SELECT c.source, SUM(revenue_impact) as total_revenue_impact, SUM(secondary_activity) as total_secondary, SUM(primary_activity) as total_primary, CASE WHEN SUM(secondary_activity) != 0 and SUM(primary_activity) != 0 THEN SUM(secondary_activity)/SUM(primary_activity) ELSE 0 end as conversion_rate from ${view} as c group by c.source`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
        const data = customParseInt(data_set)
        res.send(data.rows);
      })
    }
  } else {
    if(!time){
      RealPostgress.ReadQuery(`SELECT c.source, SUM(c.revenue_impact) as total_revenue_impact from ${view} as c group by c.source`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
        const data = customParseInt(data_set)
        res.send(data.rows);
      })
    } else if(time) {
      RealPostgress.ReadQuery(`
      SELECT c.source, DATE_TRUNC('${time}', c.ts) as monthly from ${view} as c group by c.source, DATE_TRUNC('${time}', c.ts) ORDER BY DATE_TRUNC('${time}', c.ts) ASC`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
        const data = customParseInt(data_set)
        res.send(data.rows);
      })
    }
  }
})

// Group by Source Id.
app.post('/group_by_sourceid', (req, res) => {
  const {time, view} = req.body
  if(view) {
    if(time){
      RealPostgress.ReadQuery(`SELECT c.source_id, DATE_TRUNC('${time}', c.ts) as monthly, SUM(revenue_impact) as total_revenue_impact, SUM(secondary_activity) as total_secondary, SUM(primary_activity) as total_primary, CASE WHEN SUM(secondary_activity) != 0 and SUM(primary_activity) != 0 THEN SUM(secondary_activity)/SUM(primary_activity) ELSE 0 end as conversion_rate from ${view} as c group by c.source_id, DATE_TRUNC('${time}', c.ts) ORDER BY DATE_TRUNC('${time}', c.ts) ASC`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
          const data = customParseInt(data_set)
        res.send(data.rows);
      })
    } else if(!time) {
      RealPostgress.ReadQuery(`
      SELECT c.source_id, SUM(revenue_impact) as total_revenue_impact, SUM(secondary_activity) as total_secondary, SUM(primary_activity) as total_primary, CASE WHEN SUM(secondary_activity) != 0 and SUM(primary_activity) != 0 THEN SUM(secondary_activity)/SUM(primary_activity) ELSE 0 end as conversion_rate from ${view} as c group by c.source_id`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
          const data = customParseInt(data_set)
        res.send(data.rows);
      })
    }
  } else {
    if(!time){
      RealPostgress.ReadQuery(`SELECT c.source_id, SUM(c.revenue_impact) as total_revenue_impact from ${view} as c group by c.source_id`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
          const data = customParseInt(data_set)
        res.send(data.rows);
      })
    } else if(time) {
      RealPostgress.ReadQuery(`
      SELECT c.source_id, DATE_TRUNC('${time}', c.ts) as monthly from ${view} as c group by c.source_id, DATE_TRUNC('${time}', c.ts) ORDER BY DATE_TRUNC('${time}', c.ts) ASC`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
          const data = customParseInt(data_set)
        res.send(data.rows);
      })
    }
  }
})

// Group by Activity.
app.post('/group_by_activity', (req, res) => {
  const {time, view} = req.body
  if(view) {
    if(time){
      RealPostgress.ReadQuery(`SELECT c.activity, DATE_TRUNC('${time}', c.ts) as monthly, SUM(revenue_impact) as total_revenue_impact, SUM(secondary_activity) as total_secondary, SUM(primary_activity) as total_primary, CASE WHEN SUM(secondary_activity) != 0 and SUM(primary_activity) != 0 THEN SUM(secondary_activity)/SUM(primary_activity) ELSE 0 end as conversion_rate from ${view} as c group by c.activity, DATE_TRUNC('${time}', c.ts) ORDER BY DATE_TRUNC('${time}', c.ts) ASC`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
          const data = customParseInt(data_set)
        res.send(data.rows);
      })
    } else if(!time) {
      RealPostgress.ReadQuery(`
      SELECT c.activity, SUM(revenue_impact) as total_revenue_impact, SUM(secondary_activity) as total_secondary, SUM(primary_activity) as total_primary, CASE WHEN SUM(secondary_activity) != 0 and SUM(primary_activity) != 0 THEN SUM(secondary_activity)/SUM(primary_activity) ELSE 0 end as conversion_rate from ${view} as c group by c.activity`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
          const data = customParseInt(data_set)
        res.send(data.rows);
      })
    }
  } else {
    if(!time){
      RealPostgress.ReadQuery(`SELECT c.activity, SUM(c.revenue_impact) as total_revenue_impact from ${view} as c group by c.activity`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
          const data = customParseInt(data_set)
        res.send(data.rows);
      })
    } else if(time) {
      RealPostgress.ReadQuery(`
      SELECT c.activity, DATE_TRUNC('${time}', c.ts) as monthly from ${view} as c group by c.activity, DATE_TRUNC('${time}', c.ts) ORDER BY DATE_TRUNC('${time}', c.ts) ASC`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
          const data = customParseInt(data_set)
        res.send(data.rows);
      })
    }
  }
})

// Group by feature_1.
app.post('/group_by_feature1', (req, res) => {
  const {time, view} = req.body
  if(view) {
    if(time){
      RealPostgress.ReadQuery(`SELECT c.feature_1, DATE_TRUNC('${time}', c.ts) as monthly, SUM(revenue_impact) as total_revenue_impact, SUM(secondary_activity) as total_secondary, SUM(primary_activity) as total_primary, CASE WHEN SUM(secondary_activity) != 0 and SUM(primary_activity) != 0 THEN SUM(secondary_activity)/SUM(primary_activity) ELSE 0 end as conversion_rate from ${view} as c group by c.feature_1, DATE_TRUNC('${time}', c.ts) ORDER BY DATE_TRUNC('${time}', c.ts) ASC`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
          const data = customParseInt(data_set)
        res.send(data.rows);
      })
    } else if(!time) {
      RealPostgress.ReadQuery(`
      SELECT c.feature_1, SUM(revenue_impact) as total_revenue_impact, SUM(secondary_activity) as total_secondary, SUM(primary_activity) as total_primary, CASE WHEN SUM(secondary_activity) != 0 and SUM(primary_activity) != 0 THEN SUM(secondary_activity)/SUM(primary_activity) ELSE 0 end as conversion_rate from ${view} as c group by c.feature_1`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
          const data = customParseInt(data_set)
        res.send(data.rows);
      })
    }
  } else {
    if(!time){
      RealPostgress.ReadQuery(`SELECT c.feature_1, SUM(c.revenue_impact) as total_revenue_impact from ${view} as c group by c.feature_1`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
          const data = customParseInt(data_set)
        res.send(data.rows);
      })
    } else if(time) {
      RealPostgress.ReadQuery(`
      SELECT c.feature_1, DATE_TRUNC('${time}', c.ts) as monthly from ${view} as c group by c.feature_1, DATE_TRUNC('${time}', c.ts) ORDER BY DATE_TRUNC('${time}', c.ts) ASC`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
          const data = customParseInt(data_set)
        res.send(data.rows);
      })
    }
  }
})


// Group by feature_2.
app.post('/group_by_feature2', (req, res) => {
  const {time, view} = req.body
  if(view) {
    if(time){
      RealPostgress.ReadQuery(`SELECT c.feature_2, DATE_TRUNC('${time}', c.ts) as monthly, SUM(revenue_impact) as total_revenue_impact, SUM(secondary_activity) as total_secondary, SUM(primary_activity) as total_primary, CASE WHEN SUM(secondary_activity) != 0 and SUM(primary_activity) != 0 THEN SUM(secondary_activity)/SUM(primary_activity) ELSE 0 end as conversion_rate from ${view} as c group by c.feature_2, DATE_TRUNC('${time}', c.ts) ORDER BY DATE_TRUNC('${time}', c.ts) ASC`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
          const data = customParseInt(data_set)
        res.send(data.rows);
      })
    } else if(!time) {
      RealPostgress.ReadQuery(`
      SELECT c.feature_2, SUM(revenue_impact) as total_revenue_impact, SUM(secondary_activity) as total_secondary, SUM(primary_activity) as total_primary, CASE WHEN SUM(secondary_activity) != 0 and SUM(primary_activity) != 0 THEN SUM(secondary_activity)/SUM(primary_activity) ELSE 0 end as conversion_rate from ${view} as c group by c.feature_2`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
          const data = customParseInt(data_set)
        res.send(data.rows);
      })
    }
  } else {
    if(!time){
      RealPostgress.ReadQuery(`SELECT c.feature_2, SUM(c.revenue_impact) as total_revenue_impact from ${view} as c group by c.feature_2`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
          const data = customParseInt(data_set)
        res.send(data.rows);
      })
    } else if(time) {
      RealPostgress.ReadQuery(`
      SELECT c.feature_2, DATE_TRUNC('${time}', c.ts) as monthly from ${view} as c group by c.feature_2, DATE_TRUNC('${time}', c.ts) ORDER BY DATE_TRUNC('${time}', c.ts) ASC`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
          const data = customParseInt(data_set)
        res.send(data.rows);
      })
    }
  }
})

// Group by feature_3.
app.post('/group_by_feature3', (req, res) => {
  const {time, view} = req.body
  if(view) {
    if(time){
      RealPostgress.ReadQuery(`SELECT c.feature_3, DATE_TRUNC('${time}', c.ts) as monthly, SUM(revenue_impact) as total_revenue_impact, SUM(secondary_activity) as total_secondary, SUM(primary_activity) as total_primary, CASE WHEN SUM(secondary_activity) != 0 and SUM(primary_activity) != 0 THEN SUM(secondary_activity)/SUM(primary_activity) ELSE 0 end as conversion_rate from ${view} as c group by c.feature_3, DATE_TRUNC('${time}', c.ts) ORDER BY DATE_TRUNC('${time}', c.ts) ASC`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
          const data = customParseInt(data_set)
        res.send(data.rows);
      })
    } else if(!time) {
      RealPostgress.ReadQuery(`
      SELECT c.feature_3, SUM(revenue_impact) as total_revenue_impact, SUM(secondary_activity) as total_secondary, SUM(primary_activity) as total_primary, CASE WHEN SUM(secondary_activity) != 0 and SUM(primary_activity) != 0 THEN SUM(secondary_activity)/SUM(primary_activity) ELSE 0 end as conversion_rate from ${view} as c group by c.feature_3`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
          const data = customParseInt(data_set)
        res.send(data.rows);
      })
    }
  } else {
    if(!time){
      RealPostgress.ReadQuery(`SELECT c.feature_3, SUM(c.revenue_impact) as total_revenue_impact from ${view} as c group by c.feature_3`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
          const data = customParseInt(data_set)
        res.send(data.rows);
      })
    } else if(time) {
      RealPostgress.ReadQuery(`
      SELECT c.feature_3, DATE_TRUNC('${time}', c.ts) as monthly from ${view} as c group by c.feature_3, DATE_TRUNC('${time}', c.ts) ORDER BY DATE_TRUNC('${time}', c.ts) ASC`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
          const data = customParseInt(data_set)
        res.send(data.rows);
      })
    }
  }
})

// Group by revenue_impact.
app.post('/group_by_revenue_impact', (req, res) => {
  const {time, view} = req.body
  if(view) {
    if(time){
      RealPostgress.ReadQuery(`SELECT c.revenue_impact, DATE_TRUNC('${time}', c.ts) as monthly, SUM(revenue_impact) as total_revenue_impact, SUM(secondary_activity) as total_secondary, SUM(primary_activity) as total_primary, CASE WHEN SUM(secondary_activity) != 0 and SUM(primary_activity) != 0 THEN SUM(secondary_activity)/SUM(primary_activity) ELSE 0 end as conversion_rate from ${view} as c group by c.revenue_impact, DATE_TRUNC('${time}', c.ts) ORDER BY DATE_TRUNC('${time}', c.ts) ASC`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
          const data = customParseInt(data_set)
        res.send(data.rows);
      })
    } else if(!time) {
      RealPostgress.ReadQuery(`
      SELECT c.revenue_impact, SUM(revenue_impact) as total_revenue_impact, SUM(secondary_activity) as total_secondary, SUM(primary_activity) as total_primary, CASE WHEN SUM(secondary_activity) != 0 and SUM(primary_activity) != 0 THEN SUM(secondary_activity)/SUM(primary_activity) ELSE 0 end as conversion_rate from ${view} as c group by c.revenue_impact`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
          const data = customParseInt(data_set)
        res.send(data.rows);
      })
    }
  } else {
    if(!time){
      RealPostgress.ReadQuery(`SELECT c.revenue_impact, SUM(c.revenue_impact) as total_revenue_impact from ${view} as c group by c.revenue_impact`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
          const data = customParseInt(data_set)
        res.send(data.rows);
      })
    } else if(time) {
      RealPostgress.ReadQuery(`
      SELECT c.revenue_impact, DATE_TRUNC('${time}', c.ts) as monthly from ${view} as c group by c.revenue_impact, DATE_TRUNC('${time}', c.ts) ORDER BY DATE_TRUNC('${time}', c.ts) ASC`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
          const data = customParseInt(data_set)
        res.send(data.rows);
      })
    }
  }
})

// Group by Link.
app.post('/group_by_link', (req, res) => {
  const {time, view} = req.body
  if(view) {
    if(time){
      RealPostgress.ReadQuery(`SELECT c.link, DATE_TRUNC('${time}', c.ts) as monthly, SUM(revenue_impact) as total_revenue_impact, SUM(secondary_activity) as total_secondary, SUM(primary_activity) as total_primary, CASE WHEN SUM(secondary_activity) != 0 and SUM(primary_activity) != 0 THEN SUM(secondary_activity)/SUM(primary_activity) ELSE 0 end as conversion_rate from ${view} as c group by c.link, DATE_TRUNC('${time}', c.ts) ORDER BY DATE_TRUNC('${time}', c.ts) ASC`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
          const data = customParseInt(data_set)
        res.send(data.rows);
      })
    } else if(!time) {
      RealPostgress.ReadQuery(`
      SELECT c.link, SUM(revenue_impact) as total_revenue_impact, SUM(secondary_activity) as total_secondary, SUM(primary_activity) as total_primary, CASE WHEN SUM(secondary_activity) != 0 and SUM(primary_activity) != 0 THEN SUM(secondary_activity)/SUM(primary_activity) ELSE 0 end as conversion_rate from ${view} as c group by c.link`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
          const data = customParseInt(data_set)
        res.send(data.rows);
      })
    }
  } else {
    if(!time){
      RealPostgress.ReadQuery(`SELECT c.link, SUM(c.revenue_impact) as total_revenue_impact from ${view} as c group by c.link`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
          const data = customParseInt(data_set)
        res.send(data.rows);
      })
    } else if(time) {
      RealPostgress.ReadQuery(`
      SELECT c.link, DATE_TRUNC('${time}', c.ts) as monthly from ${view} as c group by c.link, DATE_TRUNC('${time}', c.ts) ORDER BY DATE_TRUNC('${time}', c.ts) ASC`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
          const data = customParseInt(data_set)
        res.send(data.rows);
      })
    }
  }
})

// Group by Occurence.
app.post('/group_by_occurence', (req, res) => {
  const {time, view} = req.body
  if(view) {
    if(time){
      RealPostgress.ReadQuery(`SELECT c.occurence, DATE_TRUNC('${time}', c.ts) as monthly, SUM(revenue_impact) as total_revenue_impact, SUM(secondary_activity) as total_secondary, SUM(primary_activity) as total_primary, CASE WHEN SUM(secondary_activity) != 0 and SUM(primary_activity) != 0 THEN SUM(secondary_activity)/SUM(primary_activity) ELSE 0 end as conversion_rate from ${view} as c group by c.occurence, DATE_TRUNC('${time}', c.ts) ORDER BY DATE_TRUNC('${time}', c.ts) ASC`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
          const data = customParseInt(data_set)
        res.send(data.rows);
      })
    } else if(!time) {
      RealPostgress.ReadQuery(`
      SELECT c.occurence, SUM(revenue_impact) as total_revenue_impact, SUM(secondary_activity) as total_secondary, SUM(primary_activity) as total_primary, CASE WHEN SUM(secondary_activity) != 0 and SUM(primary_activity) != 0 THEN SUM(secondary_activity)/SUM(primary_activity) ELSE 0 end as conversion_rate from ${view} as c group by c.occurence`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
          const data = customParseInt(data_set)
        res.send(data.rows);
      })
    }
  } else {
    if(!time){
      RealPostgress.ReadQuery(`SELECT c.occurence, SUM(c.revenue_impact) as total_revenue_impact from ${view} as c group by c.occurence`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
          const data = customParseInt(data_set)
        res.send(data.rows);
      })
    } else if(time) {
      RealPostgress.ReadQuery(`
      SELECT c.occurence, DATE_TRUNC('${time}', c.ts) as monthly from ${view} as c group by c.occurence, DATE_TRUNC('${time}', c.ts) ORDER BY DATE_TRUNC('${time}', c.ts) ASC`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
          const data = customParseInt(data_set)
        res.send(data.rows);
      })
    }
  }
})

// Group by Activity Repeated at. *
app.get('/group_by_activity_repeated_at', (req, res) => {
  const {time, view} = req.body
  if(view) {
    if(time){
      RealPostgress.ReadQuery(`SELECT c.source, DATE_TRUNC('${time}', c.ts) as monthly, SUM(revenue_impact) as total_revenue_impact, SUM(secondary_activity) as total_secondary, SUM(primary_activity) as total_primary, CASE WHEN SUM(secondary_activity) != 0 and SUM(primary_activity) != 0 THEN SUM(secondary_activity)/SUM(primary_activity) ELSE 0 end as conversion_rate from ${view} as c group by c.source, DATE_TRUNC('${time}', c.ts) ORDER BY DATE_TRUNC('${time}', c.ts) ASC`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
          const data = customParseInt(data_set)
        res.send(data.rows);
      })
    } else if(!time) {
      RealPostgress.ReadQuery(`
      SELECT c.source, SUM(revenue_impact) as total_revenue_impact, SUM(secondary_activity) as total_secondary, SUM(primary_activity) as total_primary, CASE WHEN SUM(secondary_activity) != 0 and SUM(primary_activity) != 0 THEN SUM(secondary_activity)/SUM(primary_activity) ELSE 0 end as conversion_rate from ${view} as c group by c.source`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
          const data = customParseInt(data_set)
        res.send(data.rows);
      })
    }
  } else {
    if(!time){
      RealPostgress.ReadQuery(`SELECT c.source, SUM(c.revenue_impact) as total_revenue_impact from ${view} as c group by c.source`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
          const data = customParseInt(data_set)
        res.send(data.rows);
      })
    } else if(time) {
      RealPostgress.ReadQuery(`
      SELECT c.source, DATE_TRUNC('${time}', c.ts) as monthly from ${view} as c group by c.source, DATE_TRUNC('${time}', c.ts) ORDER BY DATE_TRUNC('${time}', c.ts) ASC`, (data_set) =>{
        res.setHeader('Content-Type', 'application/json');
          const data = customParseInt(data_set)
        res.send(data.rows);
      })
    }
  }
})

// Group by Day
app.get('/day', (req, res) => {
  let sql = "SELECT DATE_TRUNC('day',ts) AS  ts, COUNT(id) AS count FROM activity_stream GROUP BY DATE_TRUNC('day',ts);"
  RealPostgress.ReadQuery(sql, (data_set) =>{
    res.setHeader('Content-Type', 'application/json');
      const data = customParseInt(data_set)
        res.send(data.rows);
  })
})

// Group by Week.
app.get('/week', (req, res) => {
  let sql = "SELECT DATE_TRUNC('week',ts) AS ts, COUNT(id) AS count FROM activity_stream GROUP BY DATE_TRUNC('week',ts);"
  RealPostgress.ReadQuery(sql, (data_set) =>{
    res.setHeader('Content-Type', 'application/json');
    let data_set1 = groupByWeek(data_set)
    res.send(data_set1.rows);
  })
})

// Group by Month.
app.get('/month', (req, res) => {
  let sql = "SELECT DATE_TRUNC('month',ts) AS  ts, COUNT(id) AS count FROM activity_stream GROUP BY DATE_TRUNC('month',ts);"
  RealPostgress.ReadQuery(sql, (data_set) =>{
    res.setHeader('Content-Type', 'application/json');
    let data_set1 = groupByMonth(data_set)
    res.send(data_set1.rows);
  })
})

// Group by Year.
app.get('/year', (req, res) => {
  let sql = "SELECT DATE_TRUNC('year',ts) AS ts, COUNT(id) AS count FROM activity_stream GROUP BY DATE_TRUNC('year',ts);"
  RealPostgress.ReadQuery(sql, (data_set) =>{
    res.setHeader('Content-Type', 'application/json');
    let data_set1 = groupByYear(data_set)
    res.send(data_set1.rows);
  })
})
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
