import {useEffect, useState} from 'react';
import {Card, Select, Button, Row, Col, Modal } from 'antd';
import { PlayCircleOutlined, LineChartOutlined} from '@ant-design/icons';
import { 
  ComposedChart, Line, Label, LabelList, Bar,
  XAxis, YAxis, Legend, Tooltip
} from "recharts";

const {Option} = Select

export default function PlotChart({data, columns, xAxis}) {
const [isModalVisible, setisModalVisible] = useState(false)
const [graphType, setGraphType] = useState('line_graph')

  const handleShowChart = () => {
    setisModalVisible(true)
  }

  const handleOk = () => {
    setisModalVisible(false)
  }

  const handleCancel = () => {
    setisModalVisible(false)
  }

  const handleGraphTypeChange = (value) => {
    setGraphType(value)
  }

  // columns store
  const [store, setStore] = useState({
    yAxis: [], 
    y2Axis: []
  });

  useEffect(() => {
    // filter 'customer' in yColumns
    const filteredCols = columns.filter(obj => obj.dataIndex !== 'customer');
    setStore({yAxis: filteredCols, y2Axis: columns});
  }, [columns]);

  const [ Ylabel, setYlabel ] = useState('Total Revenue Impact');
  const [ Yvalue, setYvalue] = useState('total_revenue_impact');
  const [ Y2value, setY2value] = useState('customer');

  const onYchange = index => {
    const cols = columns.filter(obj => obj.dataIndex !== index);
    store.yAxis.forEach(obj => {
      if (obj.dataIndex === index && obj.dataIndex !== xAxis.dataIndex) {
        setYlabel(obj.title);
        setYvalue(obj.dataIndex);
      }
    });
    setStore(prev => ({...prev, xAxis: cols}));
  };

  const onY2change = index => {
    const cols = columns.filter(obj => (
      obj.dataIndex !== index && 
      obj.dataIndex !== xAxis.dataIndex
    ));
    store.y2Axis.forEach(obj => {
      if (obj.dataIndex === index && obj.dataIndex !== xAxis.dataIndex) {
        setY2value(obj.dataIndex);
      }
    });
    setStore(prev => ({...prev, yAxis: cols}));
  };

// const ticks = [5000, 10000, 15000, 20000, 25000, 60000, 70000, 80000, 90000, 100000, 110000, 120000]
  return (
    <Card style={{ width: 200, marginBottom: 16 }}>
      <Row>
        <Col span={6}>
          <Button type="primary" icon={<PlayCircleOutlined />}/>
        </Col>
        <Col span={6} offset={12}>
          <Button type="primary" onClick={handleShowChart} icon={<LineChartOutlined />}/>
        </Col>
      </Row>
      <Modal
        title="New Plot" 
        visible={isModalVisible}
        centered
        width={1000}
        onOk={handleOk} 
        onCancel={handleCancel}
      >
        <Card style={{ width: 900, margin: "20px" }}>
        <div style={{display: "flex", justifyContent:"space-between" }} >
            <div>
            <span>YColumns</span>
            </div>
            {graphType === 'composite_graph' && <div style={{marginRight:"75px"}} >
            <span>Y2 Column</span>
            </div>}
        </div>
        <Row>
          <Col span={12}>
            <Select defaultValue={columns[1]?.title} onChange={onYchange} style={{width: '250px'}} >
              {store.yAxis.map(item => (
                <Option value={item.dataIndex} key={item.key}>
                  {item.title}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={4} offset={4}>
            <Select defaultValue={columns[0]?.title} onChange={onY2change} style={{width: '250px'}} >
              {store.y2Axis.map(item => (
                <Option value={item.dataIndex} key={item.key}>
                  {item.title}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
        <div style={{padding: "20px"}}>
          <ComposedChart width={800} height={500} style={{maginTop: '100px'}} data={data} >
            <XAxis dataKey = {xAxis.dataIndex} >
              <Label value={xAxis.title} offset={0} position="insideBottom"/>
            </XAxis>
            <YAxis dataKey={Yvalue} domain = {[0, 'dataMax']}>
              <Label  value={Ylabel} angle={-90} position="insideBottomLeft" />
            </YAxis>
            {graphType === 'composite_graph' && <YAxis yAxisId="right" dataKey={Yvalue} orientation='right' tickLine={false} axisLine={false} domain={[0, 100]} >
              <Label value={Ylabel} angle={-90} position="insideTopRight" />
              </YAxis>
            }
            {((data && graphType === 'bar_graph') ||( data && graphType === 'composite_graph')) && 
              <Bar dataKey={graphType === 'composite_graph' ?  Y2value: Yvalue} barSize={60} fill="#1890ff" >
                <LabelList dataKey={ Yvalue} position="insideTop"/>
              </Bar>
            }
            {(graphType === 'line_graph' || graphType === 'composite_graph') && 
              <Line dataKey={graphType === 'composite_graph' ? Y2value: Yvalue} stroke="#1890ff" fill="#1890ff" strokeDasharray="3 3"/> 
            }
            <Legend verticalAlign="top" height={36}/>
            <Tooltip />
          </ComposedChart>            
        </div>

        <Select defaultValue="Graph type" style={{width: 120}} onChange={handleGraphTypeChange}>
          <Option value="composite_graph">Composite Graph</Option>
          <Option value="bar_graph">Bar Graph</Option>
          <Option value="line_graph">Line Graph</Option>
        </Select>
        </Card>
      </Modal>
    </Card>
  )
}