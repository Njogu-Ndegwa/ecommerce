import React, {useEffect, useState} from 'react'
import FirstChart from './charts/first-chart'
import SecondChart from './charts/second-chart'
import ThirdChart from './charts/third-chart'
import FourthChart from './charts/fourth-chart'
import FifthChart from './charts/fifth-chart'
import SixthChart from './charts/sixth-chart'
import SeventhChart from './charts/seventh-chart'
import getData from './charts/chart-service'
import Loading from './charts/loading'

export default function Main() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    
    useEffect( async () => {
        const response = await getData().catch(error => setError(true))
        setData(response.data)
        setLoading(false)

      }, []);
      data['first-chart'] !== undefined
       && console.log(data['fourth-chart'].data)
    return (
       
        loading ? <Loading/> :
        <>
        <div style={{width: "100%", height: "100%", backgroundColor:"grey", padding:"150px"}} >
        <FirstChart data = { data['first-chart'] !== undefined &&  data['first-chart'].data}/>
        <SecondChart data = { data['second-chart'] !== undefined && data['second-chart'].data} />
        <ThirdChart data = { data['third-chart'] !== undefined && data['third-chart'].data} /> 
        <FourthChart data = { data['fourth-chart'] !== undefined && data['fourth-chart'].data} />
        <FifthChart data = { data['fifth-chart'] !== undefined && data['fifth-chart'].data} />
        <SixthChart data = { data['sixth-chart'] !== undefined && data['sixth-chart'].data} />
        <SeventhChart data = { data['seventh-chart'] !== undefined && data['seventh-chart'].data} />
        </div>
        </>
    )
}