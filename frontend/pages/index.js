import React, {useEffect, useState} from 'react'
import OrderRetention from './charts/order_retention'
import LikelihoodToReachOrder from './charts/likelihood_to_reach_order'
import AverageOrderValue from './charts/average_order_value'
import CustomerValueByOccurence from './charts/customer_value_by_occurence'
import MedianDaysBetweenOrder from './charts/median_days_between_order'
import CustomerValueByTenure from './charts/customer_value_by_tenure'
import getData from './charts/chart-service'
import Loading from './charts/loading'

export default function Main() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    
    useEffect( async () => {
        const response = await getData().catch(error => console.log(error))
        setData(response.data)
        setLoading(false)

      }, []);

     
    return (
       
        loading ? <Loading/> :
        <>
        <div style={{width: "100%", height: "100%", backgroundColor:"grey", padding:"75px"}} >
        <OrderRetention data = { data['order-retention'] !== undefined && data['order-retention'].data} />
        <LikelihoodToReachOrder data = { data['likelihood-to-reach-order'] !== undefined && data['likelihood-to-reach-order'] .data} /> 
        <AverageOrderValue data = { data['average-order-value'] !== undefined && data['average-order-value'].data} />
        <CustomerValueByOccurence ltv={data['customer-value-by-occurence'] !== undefined && data['ltv']} data = { data['customer-value-by-occurence'] !== undefined && data['customer-value-by-occurence'].data} />
       <MedianDaysBetweenOrder data = { data['median-days-between-order'] !== undefined && data['median-days-between-order'].data} /> 
        <CustomerValueByTenure ltv={data['customer-value-by-tenure'] !== undefined && data['ltv']} data = { data['customer-value-by-tenure'] !== undefined && data['customer-value-by-tenure'].data} /> 
        </div>
        </>
    )
}