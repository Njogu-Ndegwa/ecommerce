import React from "react";
import {
  LineChart,
  Line,
  Label,
  XAxis,
  YAxis,
  ReferenceLine
} from "recharts";
import {Card} from 'antd'

export default function App({data}) {
  return (
       <Card title="Accrued Customer Value by Order Occurence" style={{width: "570px", margin:"100px"}}> 
<LineChart width={520} height={300} data={data}>
    <XAxis dataKey="name" tickLine={false} tickCount="12" type="number" domain={[0, 'dataMax + 1']}>
    <Label value="Order Occurence" offset={0} position="insideBottom" />
    </XAxis>
    <YAxis dataKey="amt" axisLine={false} tickLine={false} type="number" tickCount="6" minTickGap="20" domain={[0, 'dataMax + 10']}>
    <Label value="Expected Customer Revenue ($)" angle={-90} position="insideBottomLeft" />
    </YAxis>
    <Line type="linear" dataKey="amt" stroke="#8884d8" />
    <ReferenceLine y={171} label="LTV" stroke="grey" strokeDasharray="3 3" />
  </LineChart>
  </Card>
  );
}