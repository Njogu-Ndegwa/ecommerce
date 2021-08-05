import {useState} from 'react';
import {Card, Select, Button, Row, Col, Modal } from 'antd';
import { PlayCircleOutlined, LineChartOutlined} from '@ant-design/icons';
const { Meta } = Card;
import {
  ComposedChart,
  Line,
  Label,
  LabelList,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import Item from 'antd/lib/list/Item';
const {Option} = Select

export default function PlotChart({data, columns}) {
  console.log(data) 
  const [isModalVisible, setisModalVisible] = useState(false)
  const [graphType, setGraphType] = useState('line_graph')
  const [yColumn, setyColumn] = useState(columns[1].dataIndex)
  const handleShowChart = () => {
    setisModalVisible(true)
  }

  const handleOk = () => {
    setisModalVisible(false)
  }

  const handleCancel = () => {
    setisModalVisible(false)
  }

  const handleYColumnChange = (value) => {
    // console.log(value)
    setyColumn(value)
      
      // console.log(graphType)
  }

  const handleGraphTypeChange = (value) => {
    setGraphType(value)
  }

  const handleY2Change = () => {

  }
console.log((graphType === 'line_graph' || graphType === 'composite_graph') && 'amen')
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
      title="Basic Modal" 
      visible={isModalVisible}
      centered
      width={1000}
      onOk={handleOk} 
      onCancel={handleCancel}
      >
                <Card title='New Plot' style={{ width: 900, margin: "20px" }}>
            <div style={{display: "flex", justifyContent:"space-between" }} >
                <div>
                <span>Y1 Column</span>
                </div>
                {graphType === 'composite_graph' && <div style={{marginRight:"75px"}} >
                <span>Y2 Column</span>
                </div>}
            </div>
            <Row>
                <Col span={12}>
            <Select defaultValue="lucy" style={{width: 120}} onChange={handleYColumnChange}>
              {columns.map((item) => (
                <Option value={item.dataIndex}>{item.title}</Option>
              ))}
            </Select>
                </Col>
                <Col span={4} offset={8}>
            <Select defaultValue="lucy" style={{width: 120}} onChange={handleY2Change} >
            {columns.map((item) => (
              item != 
                <Option value={item.dataIndex}>{item.title}</Option>
              ))}
            </Select>
                </Col>
            </Row>
            <div style={{padding: "20px"}}>
<ComposedChart width={800} height={320} data={data}>
    <XAxis dataKey = {columns[0].dataIndex} >
    <Label value="Occurence" offset={0} position="insideBottom"/>
    </XAxis>
    <YAxis dataKey={yColumn} domain = {[0, 'dataMax']} >
    <Label value="Conversion  rate to next completed Order (%)" angle={-90} position="insideBottomLeft" />
    </YAxis>
    {graphType === 'composite_graph' && <YAxis yAxisId="right" dataKey='tco' orientation='right' tickLine={false} axisLine={false} domain={[0, 100]} >
    <Label value="Total Completed  Orders" angle={-90} position="insideTopRight" />
    </YAxis>}
    {((data && graphType === 'bar_graph') ||( data && graphType === 'composite_graph')) && <Bar dataKey={yColumn} barSize={60} fill="#8884d8" >
    <LabelList dataKey="cto" position="insideTop"/>
    </Bar>}
    {/* <Bar dataKey={yColumn} barSize={60} fill="#8884d8" ></Bar> */}
    {(graphType === 'line_graph' || graphType === 'composite_graph') && <Line dataKey={yColumn} stroke="#000" fill="#000"  strokeDasharray="3 3"/> }
    {/* <Line dataKey={yColumn} stroke="#000" fill="#000"  strokeDasharray="3 3"/> */}
    <Legend verticalAlign="top" height={36}/>
  </ComposedChart>
  </div>

    <Select defaultValue="lucy" style={{width: 120}} onChange={ handleGraphTypeChange}>
                <Option value="composite_graph">Composite Graph</Option>
                <Option value="bar_graph">Bar Graph</Option>
                <Option value="line_graph">Line Graph</Option>
    </Select>
  </Card>
      </Modal>
      </Card>
    )
}