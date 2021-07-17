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

export default function App({data}) {
  return (
       <Card title="Accrued Customer Value by Customer Tenure" style={{width: "550px", margin:"0px 0px 0px 100px"}}> 
<LineChart width={500} height={300} data={data}>
    <XAxis dataKey="name" tickLine={false} type="number" domain={[0, 'dataMax + 20']} scale="time" minTickGap={50} tickCount="5">
    <Label value="Days since First Completed Order" offset={0} position="insideBottom" />
    </XAxis>
    <YAxis dataKey="amt" axisLine={false} tickLine={false} type="number" tickCount="9" domain={[0, 'dataMax + 12']} minTickGap="20" >
    <Label value="Expected customer Revenue ($)" angle={-90} position="insideBottomLeft" />
    </YAxis>
    <Line type="linear" dataKey="amt" stroke="#8884d8" />
    <ReferenceLine y={150} label="LTV 150$" stroke="grey" strokeDasharray="3 3" />
  </LineChart>
  </Card>
  );
}