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

export default function App({data, ltv}) {
function calculateLtv(){
    // Calculate Ltv
let expectedValue = expectedValues()
let sum = 0
let ltv, orderNumber
for(let i = 0; i < expectedValue.length; i++){
    sum+= expectedValue[i]
    if((expectedValue[i]/sum) * 100 <= 1){
        let a  = expectedValue[i]
        ltv = a/0.95
        orderNumber = i + 1
        break;
    }
}
// return {ltv, orderNumber}
}


  return (
       <Card title="Accrued Customer Value by Order Occurence" style={{width: "850px", margin:"100px"}}> 
<LineChart width={800} height={300} data={data}>
    <XAxis dataKey="name" tickLine={false} tickCount="12" type="number" domain={[0, 'dataMax + 1']}>
    <Label value="Order Occurence" offset={0} position="insideBottom" />
    </XAxis>
    <YAxis dataKey="amt" axisLine={false} tickLine={false} type="number" tickCount="10" domain={[0, 'dataMax + 1000']} minTickGap="5000" >
    <Label value="Expected Customer Revenue ($)" angle={-90} position="insideBottomLeft" />
    </YAxis>
    <Line type="linear" dataKey="amt" stroke="#8884d8" />
    <ReferenceLine y={ltv} label={`LTV ${ltv}`} stroke="grey" strokeDasharray="3 3" />
  </LineChart>
  </Card>
  );
}