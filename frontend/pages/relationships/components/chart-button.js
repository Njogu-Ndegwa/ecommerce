import {useEffect, useState} from 'react';
import {Card, Select, Button, Row, Col, Modal } from 'antd';
import { PlayCircleOutlined, LineChartOutlined} from '@ant-design/icons';
import { 
  ComposedChart, Line, Label, LabelList, Bar,
  XAxis, YAxis, Legend,
} from "recharts";

const {Option} = Select

export default function PlotChart({data, columns}) {
  const [chartData, setChartdata] = useState([])
  useEffect(() => {
    if (data.length) {
      console.log('dataSet: ', {data, columns})
    }
  }, [data]);

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

  const [ Ylabel, setYlabel ] = useState('Y-axis')
  useEffect(() => {
    if (columns.length) setYlabel(columns[0].title);    
  }, [columns])
  const handleYColumnChange = (value) => {
    columns.forEach(v => {
      if (v.dataIndex === value) setYlabel(v.title);
    })
  }

  const handleGraphTypeChange = (value) => {
    setGraphType(value)
  }

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
          <Select defaultValue={Ylabel} onChange={handleYColumnChange} style={{width: '250px'}} >
            {columns.map(item => (
              <Option value={item.dataIndex} key={item.key}>
                {item.title}
              </Option>
            ))}
          </Select>
              </Col>
              <Col span={4} offset={8}>
                <Button type='default'>Refresh plot</Button>
              </Col>
          </Row>
          <div style={{padding: "20px"}}>
            <ComposedChart width={800} height={320} >
              <XAxis dataKey = {columns[0].dataIndex} >
                <Label value="Occurence" offset={0} position="insideBottom"/>
              </XAxis>
              <YAxis dataKey={columns[1].dataIndex} domain = {[0, 'dataMax']} >
                <Label  value={Ylabel} angle={-90} position="insideBottomLeft" />
              </YAxis>
              {graphType === 'composite_graph' && <YAxis yAxisId="right" dataKey='tco' orientation='right' tickLine={false} axisLine={false} domain={[0, 100]} >
                <Label value="Total Completed  Orders" angle={-90} position="insideTopRight" />
                </YAxis>
              }
              {/* {((data && graphType === 'bar_graph') ||( data && graphType === 'composite_graph')) && <Bar dataKey={yColumn} barSize={60} fill="#8884d8" >
                <LabelList dataKey="cto" position="insideTop"/>
                </Bar>
              } */}
              {/* <Bar dataKey={yColumn} barSize={60} fill="#8884d8" ></Bar> */}
              {/* {(graphType === 'line_graph' || graphType === 'composite_graph') && <Line dataKey={yColumn} stroke="#000" fill="#000"  strokeDasharray="3 3"/> } */}
              {/* <Line dataKey={yColumn} stroke="#000" fill="#000"  strokeDasharray="3 3"/> */}
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