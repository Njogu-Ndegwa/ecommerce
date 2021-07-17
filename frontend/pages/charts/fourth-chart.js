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
  return (
  <Card title="Average Order Value by Occurence" style={{width: "550px", margin:"100px", paddingBottom: "100px"}}> 
<ComposedChart width={500} height={300} data={data}>
    <XAxis dataKey="name" tickLine={false} type="number" domain={[0, 'dataMax + 1']} scale="time">
    <Label value="Activity occurence" offset={0} position="insideBottom" />
    </XAxis>
    <YAxis  axisLine={false} dataKey='aov' tickLine={false} type="number" domain={[0, 'dataMax + 30']} tickCount="10" minTickGap="20">
    <Label value="Average Order Value ($)" angle={-90} position="insideBottomLeft" />
    </YAxis>
    <YAxis yAxisId="right" dataKey='tco' orientation='right' tickCount={6} tickLine={false} domain={[0, 'dataMax']} axisLine={false} minTickGap={10}>
    <Label value="Percentage of Total completed Order (%)" angle={-90} position="insideTopRight" />
    </YAxis>
    {
      data ?  <Bar dataKey="aov" barSize={60} fill="#8884d8" >
        <LabelList dataKey="aov" position="insideTop"/>
      </Bar> : <div></div>
    }
    <Line yAxisId="right" dataKey='tco' stroke="#000" fill="#000"  strokeDasharray="3 3"/>
    <Legend verticalAlign="top" height={36}/>
  </ComposedChart>
  </Card>

  );
}