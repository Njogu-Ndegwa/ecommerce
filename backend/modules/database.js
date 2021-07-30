const { Pool } = require('pg');

class PostGressConnection {
  pool = null;
  constructor() {
    this.pool = new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'nuk_example_db',
      password: '123456',
      // port: 5432,
    });
  }

  ReadQuery(query, callback) {
    this.pool.query(query, (err, res) => {
      callback(res);
    });
  }
}

module.exports = { PostGressConnection };
// let connection = new PostGressConnection();
// connection.ReadQuery("SELECT * FROM activity_stream",(res)=>{
//     console.log(res.rows[0])
// })
