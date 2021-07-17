import React from "react";
import {
  LabelList,
  Label,
  Bar,
  XAxis,
  YAxis,
  BarChart
} from "recharts";
import {Card} from 'antd'

export default function App({data}) {
  console.log(data)
  return (
<Card title="Median Days Between Each Other" style={{width: "550px", margin:"100px"}}> 
  <BarChart width={500} height={300} data={data}>
    <XAxis dataKey="name" tickLine={false} type="number" domain={[0, 'dataMax + 1']} scale="time" >
    <Label value="Activity Occurence" offset={0} position="insideBottom" />
    </XAxis>
    <YAxis  axisLine={false} dataKey='amt' tickLine={false} type="number" domain={[0, 'dataMax + 10']} tickCount="10" minTickGap="20">
    <Label value="Median Days to next completed order" angle={-90} position="insideBottomLeft" /> 
    </YAxis>
    {
      data?  <Bar dataKey="amt" barSize={60} fill="#8884d8" >
      <LabelList dataKey="amt" position="insideTop"/>
  </Bar> : <div></div>
    }
  </BarChart>
</Card>

  );
}