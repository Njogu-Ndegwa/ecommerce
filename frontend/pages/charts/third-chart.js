import React from "react";
import {
  ComposedChart,
  LineChart,
  Line,
  XAxis,
  Label,
  YAxis,
  ReferenceLine
} from "recharts";
import {Card} from 'antd'


export default function App({data}) {
  console.log(data)
  return (
       <Card title="Modeled Likelihood of reaching Each Completed order" style={{width: "550px", margin:"100px"}}> 
<LineChart width={500} height={350} data={data}>
    <XAxis dataKey="name" tickLine={false} tickCount="12" type="number" domain={[0, 'dataMax + 1']}>
    <Label value="Activity occurence" offset={0} position="insideBottom" />
    </XAxis>
    <YAxis dataKey="lco" axisLine={false} tickLine={false} type="number" tickCount="6" minTickGap="20" domain={[0, 'dataMax']}>
    <Label value="Likelihood of reaching each completed order (%)" angle={-90} position="insideBottomLeft" />
    </YAxis>
    <Line type="linear" dataKey="lco" stroke="#8884d8" />
    <ReferenceLine y={150} label="LTV" stroke="grey" strokeDasharray="3 3" />
  </LineChart>
  </Card>

  );
}