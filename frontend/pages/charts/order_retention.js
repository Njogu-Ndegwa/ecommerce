import React from "react";
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
import {Card} from 'antd'

export default function App({data}) {
const ticks  = [10, 20 , 30 , 40 , 50, 60 ,70, 80 , 90, 100]
  return (
  <Card title="Order Retention by Occurence" style={{width: "850px", margin:"100px"}}> 
<ComposedChart width={800} height={320} data={data}>
    <XAxis dataKey="name" tickLine={false} type="number" domain={[0, 'dataMax']} scale="time" >
    <Label value="Occurence" offset={0} position="insideBottom" />
    </XAxis>
    <YAxis  dataKey="cto" axisLine={false} tickLine={false} type="number" tickCount="5" domain={[0, 'dataMax']} minTickGap="20">
    <Label value="Conversion rate to next completed Order (%)" angle={-90} position="insideBottomLeft" />
    </YAxis>
    <YAxis yAxisId="right" dataKey='tco' orientation='right' tick={ticks} tickLine={false} axisLine={false} domain={[0, 100]}>
    <Label value="Total Completed Orders" angle={-90} position="insideTopRight" />
    </YAxis>
    {data ? <Bar dataKey="cto" barSize={60} fill="#8884d8" >
    <LabelList dataKey="cto" position="insideTop"/>
    </Bar> : <div></div>}
    <Line yAxisId="right" dataKey='tco' stroke="#000" fill="#000"  strokeDasharray="3 3"/>
    <Legend verticalAlign="top" height={36}/>
  </ComposedChart>
  </Card>

  );
}