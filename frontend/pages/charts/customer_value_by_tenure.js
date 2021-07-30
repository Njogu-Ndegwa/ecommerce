import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ReferenceLine, 
  Label
} from "recharts";
import {Card} from 'antd'


export default function App({data, ltv}) {
  const ticks = [
    0, 100, 200, 300, 400
  ];
  return (
<Card title="Accrued Customer Value by Customer Tenure" style={{width: "850px", margin:"100px"}}> 
  <LineChart width={800} height={400} data={data}>
    <XAxis dataKey="name" type="number" tick={ticks} domain ={[0, 500]} tickCount={5} minTickGap={100}>
    <Label value="Days since First Completed Order" offset={0} position="insideBottom" />
    </XAxis>
    <YAxis dataKey="amt" axisLine={false} tickLine={false} type="number" tickCount="10" domain={[0, 'dataMax + 1000']} minTickGap="5000" >
    <Label value="Expected customer Revenue ($)" angle={-90} position="insideBottomLeft" />
    </YAxis>
    <Line type="linear" dataKey="amt" stroke="#8884d8" />
    <ReferenceLine y={ltv} label={`LTV ${ltv}`} stroke="grey" strokeDasharray="3 3" />
  </LineChart>
</Card>
  );
}