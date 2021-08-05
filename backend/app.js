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
const {firstEver, lastEver, firstBetween, lastBetween, aggregationAll} = require('./modules/secondary_activities')

// app instance
var app = express();
app.use(bodyParser.json());
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
        <li>To Create and Insert Data to Database<a href="/create-insert-viewdemo-stream"> Link</a></li>
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
  let sql = `SELECT DISTINCT acts.activity FROM public.activity_stream as acts;`;
  RealPostgress.ReadQuery(sql, function (data_set) {
    res.setHeader('Content-Type', 'application/json');
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

  let sql = `SELECT ${selectQuery}
    FROM public.activity_stream AS az1 where az1.activity = '${primary_activity}' ${filterQuery}
    ${occurrenceQuery}
  `;
  RealPostgress.ReadQuery(sql, function (data_set) {
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
      firstEver(data_set, appends, primary_activity, res)
    }
    else if(appends[0].append_type === 'last-before') {
      lastEver(data_set, appends, primary_activity, res)
    }
  }
  else {
    res.send(data_set.rows)
  }
  });
});

app.get('/first-ever', function (req, res) {
  const { primary_activity, append_activity, appends, filters } = req.query;
  let sql = `SELECT az1.customer, az1.activity,
  case
  when activity = 'completed_order'
  then
    (select MIN(ts) as ts from activity_stream as az
    where activity = 'completed_order' and az1.customer = az.customer order by ts)
  end as first_ever
  FROM public.activity_stream as az1 group by first_ever, az1.customer, az1.activity
  `;
  RealPostgress.ReadQuery(sql, function (data_set) {
    res.setHeader('Content-Type', 'application/json')
    ;
    res.send(data_set.rows);
  });
}); 

app.get('/last-ever', function (req, res) {
  const { primary_activity, append_activity } = req.query;
  let sql = `SELECT  *,
    case
    when activity = '${primary_activity}'
    then
    (select
    MAX(ts) as ts
    from activity_stream as az where activity = '${append_activity}' and az1.customer = az.customer order by ts )
    end as last_ever
    FROM public.activity_stream as az1  order by ts
  `;
  RealPostgress.ReadQuery(sql, function (data_set) {
    res.setHeader('Content-Type', 'application/json');
    res.send(data_set.rows);
  });
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

app.get('/first-between', function (req, res) {
  const { primary_activity, append_activity } = req.query;
  let sql = `select a.activity_id, a.ts, a.customer, a.activity,
    case when a.activity = '${primary_activity}' then
      (select b.activity_id from activity_stream b where a.customer = b.customer and b.activity = '${append_activity}' and b.ts between a.ts and (select c.ts from activity_stream c where a.customer = c.customer and c.activity = '${primary_activity}' and a.ts < c.ts limit 1) order by b.ts limit 1)
    end as first_in_between
    from activity_stream as a
    order by ts


`;
  RealPostgress.ReadQuery(sql, function (data_set) {
    res.setHeader('Content-Type', 'application/json');
    res.send(data_set.rows);
  });
});

app.get('/last-between', function (req, res) {
  const { primary_activity, append_activity } = req.query;
  let sql = `select a.activity_id, a.ts, a.customer, a.activity,
    case when a.activity = '${primary_activity}' then
      (select b.activity_id from activity_stream b where a.customer = b.customer and b.activity = '${append_activity}' and b.ts between a.ts and (select c.ts from activity_stream c where a.customer = c.customer and c.activity = '${primary_activity}' and a.ts < c.ts limit 1) order by b.ts desc limit 1)
    end as last_in_between
    from activity_stream as a
    order by ts`;
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
app.get('/group_by_activityid', (req, res) => {
  let sql = "SELECT activity_id, SUM(revenue_impact) from activity_stream GROUP BY activity_id;"
  RealPostgress.ReadQuery(sql, (data_set) =>{
    res.setHeader('Content-Type', 'application/json');
   let data_set1 = groupByColumn(data_set)
    res.send(data_set1.rows);
  })
})
// Group by customers.
app.get('/group_by_customer', (req, res) => {
  let sql = "SELECT customer , SUM(revenue_impact) from activity_stream GROUP BY customer;"
  RealPostgress.ReadQuery(sql, (data_set) =>{
    res.setHeader('Content-Type', 'application/json');
    let data_set1 = groupByColumn(data_set)
    res.send(data_set1.rows);
  })
})
// Group by timestamp.
app.get('/group_by_timestamp', (req, res) => {
  let sql = "SELECT ts, SUM(revenue_impact) from activity_stream GROUP BY ts"
  RealPostgress.ReadQuery(sql, (data_set) =>{
    res.setHeader('Content-Type', 'application/json');
    let data_set1 = groupByColumn(data_set)
    res.send(data_set1.rows);
  })
})
// Group by source.
app.get('/group_by_source', (req, res) => {
  let sql = "SELECT source,  SUM(revenue_impact) from activity_stream GROUP BY source;"
  RealPostgress.ReadQuery(sql, (data_set) =>{
    res.setHeader('Content-Type', 'application/json');
    let data_set1 = groupByColumn2(data_set)
    res.send(data_set1.rows);
  })
})

// Group by Source Id.
app.get('/group_by_sourceid', (req, res) => {
  let sql = "SELECT source_id,  SUM(revenue_impact) from activity_stream GROUP BY source_id;"
  RealPostgress.ReadQuery(sql, (data_set) =>{
    res.setHeader('Content-Type', 'application/json');
    let data_set1 = groupByColumn2(data_set)
    res.send(data_set1.rows);
  })
})

// Group by Activity.
app.get('/group_by_activity', (req, res) => {
  let sql = "SELECT activity,  SUM(revenue_impact) from activity_stream GROUP BY activity;"
  RealPostgress.ReadQuery(sql, (data_set) =>{
    res.setHeader('Content-Type', 'application/json');
    let data_set1 = groupByColumn(data_set)
    res.send(data_set1.rows);
  })
})

// Group by feature_1.
app.get('/group_by_feature1', (req, res) => {
  let sql = "SELECT feature_1,  SUM(revenue_impact) from activity_stream GROUP BY feature_1;"
  RealPostgress.ReadQuery(sql, (data_set) =>{
    res.setHeader('Content-Type', 'application/json');
    let data_set1 = groupByColumn(data_set)
    res.send(data_set1.rows);
  })
})


// Group by feature_2.
app.get('/group_by_feature2', (req, res) => {
  let sql = "SELECT feature_2,  SUM(revenue_impact)  from activity_stream GROUP BY feature_2;"
  RealPostgress.ReadQuery(sql, (data_set) =>{
    res.setHeader('Content-Type', 'application/json');
    let data_set1 = groupByColumn2(data_set)
    res.send(data_set1.rows);
  })
})

// Group by feature_3.
app.get('/group_by_feature3', (req, res) => {
  let sql = "SELECT feature_3,  SUM(revenue_impact) from activity_stream GROUP BY feature_3;"
  RealPostgress.ReadQuery(sql, (data_set) =>{
    res.setHeader('Content-Type', 'application/json');
    let data_set1 = groupByColumn2(data_set)
    res.send(data_set1.rows);
  })
})

// Group by revenue_impact.
app.get('/group_by_revenue_impact', (req, res) => {
  let sql = "SELECT revenue_impact from activity_stream GROUP BY revenue_impact;"
  RealPostgress.ReadQuery(sql, (data_set) =>{
    res.setHeader('Content-Type', 'application/json');
    let data_set1 = groupByColumn(data_set)
    res.send(data_set1.rows);
  })
})

// Group by Link.
app.get('/group_by_link', (req, res) => {
  let sql = "SELECT link,  SUM(revenue_impact) from activity_stream GROUP BY link;"
  RealPostgress.ReadQuery(sql, (data_set) =>{
    res.setHeader('Content-Type', 'application/json');
    let data_set1 = groupByColumn2(data_set)
    res.send(data_set1.rows);
  })
})

// Group by Occurence.
app.get('/group_by_occurence', (req, res) => {
  let sql = "SELECT v.activity_id, v.occurence, s.customer, s.activity, SUM(s.revenue_impact) from activity_stream as s CROSS JOIN viewdemo_stream as v where s.activity_id = v.activity_id GROUP BY s.customer, v.activity_id, s.activity, v.occurence;"
  RealPostgress.ReadQuery(sql, (data_set) =>{
    res.setHeader('Content-Type', 'application/json');
    let data_set1 = groupByColumn(data_set)
    res.send(data_set1.rows);
  })
})

// Group by Activity Repeated at.
app.get('/group_by_activity_repeated_at', (req, res) => {
  let sql = "SELECT v.activity_repeated_at, v.activity_id, s.customer, s.activity, SUM(s.revenue_impact) from activity_stream as s CROSS JOIN viewdemo_stream as v where s.activity_id = v.activity_id GROUP BY s.customer, v.activity_id, s.activity, v.activity_repeated_at;"
  RealPostgress.ReadQuery(sql, (data_set) =>{
    res.setHeader('Content-Type', 'application/json');
    let data_set1 = groupByColumn(data_set)
    res.send(data_set1.rows);
  })
})

// Group by Day
app.get('/day', (req, res) => {
  let sql = "SELECT DATE_TRUNC('day',ts) AS  production_to_month, COUNT(id) AS count FROM activity_stream GROUP BY DATE_TRUNC('day',ts);"
  RealPostgress.ReadQuery(sql, (data_set) =>{
    res.setHeader('Content-Type', 'application/json');
    let data_set1 = groupByDay(data_set)
    res.send(data_set1.rows);
  })
})

// Group by Week.
app.get('/week', (req, res) => {
  let sql = "SELECT DATE_TRUNC('week',ts) AS  production_to_month, COUNT(id) AS count FROM activity_stream GROUP BY DATE_TRUNC('week',ts);"
  RealPostgress.ReadQuery(sql, (data_set) =>{
    res.setHeader('Content-Type', 'application/json');
    let data_set1 = groupByWeek(data_set)
    res.send(data_set1.rows);
  })
})

// Group by Month.
app.get('/month', (req, res) => {
  let sql = "SELECT DATE_TRUNC('month',ts) AS  production_to_month, COUNT(id) AS count FROM activity_stream GROUP BY DATE_TRUNC('month',ts);"
  RealPostgress.ReadQuery(sql, (data_set) =>{
    res.setHeader('Content-Type', 'application/json');
    let data_set1 = groupByMonth(data_set)
    res.send(data_set1.rows);
  })
})

// Group by Year.
app.get('/year', (req, res) => {
  let sql = "SELECT DATE_TRUNC('year',ts) AS  production_to_month, COUNT(id) AS count FROM activity_stream GROUP BY DATE_TRUNC('year',ts);"
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
