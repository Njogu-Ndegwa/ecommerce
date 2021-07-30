const KnexStaticDatabases = require('./knex.class');
const KnexObj = new KnexStaticDatabases();
const Knex = KnexObj.db;
const { CsvHandeller } = require('../modules/read.csv');
CsvObj = new CsvHandeller();

class PostgressFuntion {
  CreateColoums(callback) {
    CsvObj.CreateTableColums('./csv_files/ActivityStream.csv', (res) => {
      callback(res);
    });
  }

  InsertActivityData(callback) {
    let size = 0;
    CsvObj.ReadCsv('./csv_files/ActivityStream.csv', (res) => {
      res.forEach((element) => {
        KnexObj.InsertActivity(element, () => {
          size++;
          if (size === res.length) {
            callback(true);
          }
        });
      });
    });
  }


  InsertViewDemoData(callback) {
    let size = 0;
    CsvObj.ReadCsv('./csv_files/viewdemotable.csv', (res) => {
      res.forEach((element) => {
        KnexObj.InsertViewDemo(element, () => {
          size++;
          if (size === res.length) {
            callback(true);
          }
        });
      });
    });
  }

  SelectAll(callback) {
    KnexObj.SelectAllRecords(callback);
  }
}
module.exports = { PostgressFuntion };
