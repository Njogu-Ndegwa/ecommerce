import { Col, Row, Table } from 'antd';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { appendColums, humanize } from '../utils';

const columns = [
  {
    title: 'Timestamp',
    dataIndex: 'ts',
    key: 'ts',
  },
  {
    title: 'Customer',
    dataIndex: 'customer',
    key: 'customer',
  },
  {
    title: 'Primary Activity',
    dataIndex: 'primary_activity',
    key: 'primary_activity',
  },
  {
    title: 'Append Activity',
    dataIndex: 'append_activity',
    key: 'append_activity',
  },
];

function Explanation({ activities, form, appendData }) {
  const [dataSource, setDataSource] = useState([]);
  const [tableColumns, setTableColumns] = useState(columns);

  useEffect(async () => {
    const { activity_type, append_type } = appendData;
    const primaryActivity = form.getFieldValue('primary_activity');
    const dataSourceTemp = [];
    activities.forEach((x) => {
      const date = moment(x.ts).format('YYYY-MM-DD');
      const isExists = dataSourceTemp.find((d) => d.ts === date && d.customer === x.customer);
      if (!isExists) {
        dataSourceTemp.push({
          id: x.id,
          ts: moment(x.ts).format('YYYY-MM-DD'),
          primary_activity: primaryActivity,
          append_activity: activity_type,
          customer: x.customer,
          [appendColums[append_type]]: x[appendColums[append_type]]
        });
      }
    });
    setDataSource(dataSourceTemp);
    setTableColumns([
      ...columns,
      {
        title: humanize(append_type).replace(/-/g, ' '),
        dataIndex: appendColums[append_type],
        key: appendColums[append_type],
      },
    ]);
  }, [activities]);

  return (
    <Row>
      <Col span={24}>
        <h3>Dataset</h3>
        <Table dataSource={dataSource} rowKey="id" columns={tableColumns} />
      </Col>
    </Row>
  );
}

export default Explanation;
