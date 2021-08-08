const { Pool} = require('pg')
const fs = require('fs')
const fastcsv = require('fast-csv')
// pools will use environment variables
// for connection information
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'guru99',
    password: '123456',
    port: 5432,
})


// pool.query('SELECT NOW()', (err, res) => {
//   console.log(err, res)
// })

// const activitiesStream = 'CREATE TABLE activities (activity_id NUMERIC PRIMARY KEY, ts timestamp ,  customer VARCHAR(50) , activity VARCHAR(50) , feature_1 VARCHAR(50), revenue_impact NUMERIC)'
// const addactivities = "COPY  activities(activity_id, ts,  customer, activity, revenue_impact) FROM 'C:\Users\lenovo\Downloads\activities.csv' DELIMITER ',' CSV HEADER"

// pool.query(addactivities, (err, res) =>{
//     console.log(err)
    
// })
let path = './controllers/activities.csv'
// let query = "COPY activities(activity_id, ts,  customer, activity, feature_1, revenue_impact) FROM 'C:\Users\lenovo\Downloads\activities.csv' DELIMITER ',' CSV HEADER;"
let query = "INSERT INTO activities (activity_id, ts,  customer, activity, feature_1, revenue_impact) VALUES ($1, $2, $3, $4, $5, $6)";
let stream = fs.createReadStream(path);
    let csvData = [];
    let csvStream = fastcsv

      .parse()
      .on("data", function(data) {
        csvData.push(data);  
      })
      .on("end", function() {
        // remove the first line: header
        csvData.shift();
        // connect to the PostgreSQL database
        // save csvData
    
        pool.connect((err, client, done) => {
            if (err) throw err;
            try {
              csvData.forEach(row => {
                client.query(query, row, (err, res) => {
                  if (err) {
                    console.log(err.stack);
                  } else {
                  }
                });
              });
            } finally {
              done();
            }
    
        })
      });
    
    stream.pipe(csvStream);