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
const [ Ylabel, setYlabel ] = useState('Total Revenue Impact')
const [ Y2label, setY2label ] = useState('Y2-axis')
const [chartData, setChartdata] = useState([])
const [yValue, setYValue] = useState('total_revenue_impact')
const [y2Value, setY2Value] = useState('total_revenue_impact')

console.log(yValue, 'Value')
console.log(columns, 'Columns')

  const handleShowChart = () => {
    setisModalVisible(true)
  }

  const handleOk = () => {
    setisModalVisible(false)
  }

  const handleCancel = () => {
    setisModalVisible(false)
  }


  // useEffect(() => {
  //   if (columns.length) setYlabel(columns[0].title);    
  // }, [columns])

  const handleYColumnChange = (value) => {
    columns.forEach(v => {
      if (v.dataIndex === value && v.dataIndex !== xAxis.dataIndex) {
        setYlabel(v.title);
        setYValue(v.dataIndex);
      }
    })
  }

  const handleY2ColumnChange = (value) => {
    columns.shift()
    columns.forEach(v => {
      if (v.dataIndex === value) {
        setY2label(v.title);
        setY2Value(v.dataIndex);
      }
    })
  }


  const handleGraphTypeChange = (value) => {
    setGraphType(value)
  }

const ticks = [5000, 10000, 15000, 20000, 25000, 60000, 70000, 80000, 90000, 100000, 110000, 120000]
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
          <Select defaultValue="Total Revenue Impact" onChange={handleYColumnChange} style={{width: '250px'}} >
            {columns.map(item => (
              <Option value={item.dataIndex} key={item.key}>
                {item.title}
              </Option>
            ))}
          </Select>
              </Col>
              <Col span={4} offset={4}>
              <Select defaultValue={Y2label} onChange={handleY2ColumnChange} style={{width: '250px'}} >
            {columns.map(item => (
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
              <YAxis dataKey={yValue} domain = {[0, 'dataMax']} minTickGap={5000}>
                <Label  value={Ylabel} angle={-90} position="insideBottomLeft" />
              </YAxis>
              {graphType === 'composite_graph' && <YAxis yAxisId="right" dataKey={y2Value} orientation='right' tickLine={false} axisLine={false} domain={[0, 100]} >
                <Label value={y2Value} angle={-90} position="insideTopRight" />
                </YAxis>
              }
              {((data && graphType === 'bar_graph') ||( data && graphType === 'composite_graph')) && <Bar dataKey={graphType === 'composite_graph' ? yValue : y2Value} barSize={60} fill="#8884d8" >
                <LabelList dataKey={yValue} position="insideTop"/>
                </Bar>
              }
                <Tooltip />
              {/* <Bar dataKey= "total_revenue_impact" barSize={60} fill="#8884d8" ></Bar> */}
              {(graphType === 'line_graph' || graphType === 'composite_graph') && <Line dataKey={graphType === 'composite_graph' ? y2Value : yValue} stroke="#000" fill="#000"  strokeDasharray="3 3"/> }
              {/* <Line dataKey= {yValue} stroke="#000" fill="#000"  strokeDasharray="3 3"/> */}
              <Legend verticalAlign="top" height={36}/>
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