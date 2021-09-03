const knex = require('knex');
const knexfile = require('../includes/knexfile');

class KnexStaticDatabases {
  knex = null;
  constructor() {
    this.knex = knex(knexfile.development);
  }
  CreateActivityStream(callback) {
    this.knex.schema
      .createTable('activity_stream', (table) => {
        table.increments('id');
        table.string('activity_id');
        table.timestamp('ts');
        table.string('source');
        table.string('source_id');
        table.string('customer');
        table.string('activity');
        table.string('feature_1');
        table.string('feature_2');
        table.string('feature_3');
        table.integer('revenue_impact');
        table.string('link');
      })
      .then(() => callback())
      .catch((err) => {
        console.log(err);
        throw err;
      })
      .finally(() => {
        // this.knex.destroy();
      });
  }
  CreateViewDemoStream(callback) {
    this.knex.schema
      .createTable('viewdemo_stream', (table) => {
        table.increments('id');
        table.string('activity_id');
        table.integer('occurence');
        table.string('activity_repeated_at');
      })
      .then(() => callback())
      .catch((err) => {
        console.log(err);
        throw err;
      })
      .finally(() => {
        // this.knex.destroy();
      });
  }

  CreateActivityReferenceTable(callback) {
    this.knex.schema
      .createTable('activity_reference', (table) => {
        table.increments('id');
        table.string('activity');
        table.string('feature_1');
        table.string('feature_2');
        table.string('feature_3');
      })
      .then(() => callback())
      .catch((err) => {
        console.log(err);
        throw err;
      })
      .finally(() => {
        // this.knex.destroy();
      });
  }

  InsertActivity(res, callback) {
    this.knex('activity_stream')
      .insert(res)
      .then(() => {
        callback();
      });
  }

  InsertViewDemo(res, callback) {
    // console.log(res, 'viewdemo_stream')
    this.knex('viewdemo_stream')
      .insert(res)
      .then(() => {
        callback();
      });
  }

  InsertActivityRefence(res, callback) {
    this.knex('activity_reference')
      .insert(res)
      .then(() => {
        callback();
      });
  }

  SelectAllRecordsActivity(callback) {
    this.knex
      .select()
      .from('activity_stream')
      .then((records) => {
        callback(records);
      });
  }

  SelectAllRecordsViewDemo(callback) {
    this.knex
      .select()
      .from('viewdemo_stream')
      .then((records) => {
        callback(records);
      });
  }

  SelectAllRecordsActivityReference(callback) {
    this.knex
      .select()
      .from('activity_reference')
      .then((records) => {
        callback(records);
      });
  }
}
module.exports = KnexStaticDatabases;
