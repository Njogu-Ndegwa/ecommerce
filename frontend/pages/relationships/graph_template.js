import {Card, Select, Row, Col} from 'antd';
import { useState } from 'react';
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
const {Option} = Select

export default function graphTemplate({data}) {
    const [graphType, setGraphType] = useState('line_graph')
    const handleChange = (value) => {
        setGraphType(value)
    }
    return (
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
            <Select defaultValue="lucy" style={{width: 120}} onChange={handleChange}>
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
            </Select>
                </Col>
                <Col span={4} offset={8}>
            <Select defaultValue="lucy" style={{width: 120}} onChange={handleChange} >
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
            </Select>
                </Col>
            </Row>
            <div style={{padding: "20px"}}>
<ComposedChart width={800} height={320} data={data}>
    <XAxis dataKey="name"  type="number" domain={[0, 'dataMax']} scale="time" >
    <Label value="Occurence" offset={0} position="insideBottom" />
    </XAxis>
    <YAxis  dataKey="cto" axisLine={false} tickLine={false} type="number" tickCount="5" domain={[0, 'dataMax']} minTickGap="20">
    <Label value="Conversion rate to next completed Order (%)" angle={-90} position="insideBottomLeft" />
    </YAxis>
    {graphType === 'composite_graph' && <YAxis yAxisId="right" dataKey='tco' orientation='right' tickLine={false} axisLine={false} domain={[0, 100]}>
    <Label value="Total Completed Orders" angle={-90} position="insideTopRight" />
    </YAxis>}
    {(data && graphType === 'bar_graph') || data && graphType === 'composite_graph' && <Bar dataKey="cto" barSize={60} fill="#8884d8" >
    <LabelList dataKey="cto" position="insideTop"/>
    </Bar>}
    { graphType === 'line_graph' || graphType === 'composite_graph' && <Line yAxisId="right" dataKey='tco' stroke="#000" fill="#000"  strokeDasharray="3 3"/> } 
    <Legend verticalAlign="top" height={36}/>
  </ComposedChart>
  </div>

    <Select defaultValue="lucy" style={{width: 120}} onChange={handleChange}>
                <Option value="composite_graph">Composite Graph</Option>
                <Option value="bar_graph">Bar Graph</Option>
                <Option value="line_graph">Line Graph</Option>
    </Select>
  </Card>

    )
}