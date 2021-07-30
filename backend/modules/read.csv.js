const csv = require('csv-parser');
const fs = require('fs');
const { resolve } = require('path');

class CsvHandeller {
  async CreateTableColums(files, callback) {
    const csvParser = csv({ delimiter: ',' });
    new Promise((resolve, reject) => {
      const csvFile = files;
      const fileStream = fs.createReadStream(csvFile);
      let lines = 0;
      let row = null;
      csvParser.on('data', function (line) {
        if (lines === 0) {
          row = line;
          csvParser.pause();
          csvParser.emit('end');
        }
        lines += 1;
      });
      csvParser.on('end', function () {
        let keys = Object.keys(row);
        let rows = [];
        keys.forEach((ele) => {
          rows.push({ coloumn: ele, type: typeof row[ele] });
          if (rows.length === keys.length) {
            resolve(rows);
          }
        });
      });
      fileStream.pipe(csvParser);
    })
      .then((result) => {
        callback(result);
      })
      .catch((error) => {
        console.log(error);
        console.log('Errors');
      });
  }
  async ReadCsv(files, callback) {
    let done = [];
    new Promise((resolve, reject) => {
      fs.createReadStream(files)
        .pipe(csv())
        .on('data', (row) => {
          done.push(row);
        })
        .on('end', () => {
          resolve();
        });
    }).then((resolve) => {
      callback(done);
    });

  }
}
module.exports = { CsvHandeller };
