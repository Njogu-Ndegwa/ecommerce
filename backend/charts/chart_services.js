const { json } = require('express')
var data = require('./Datafile.json')
var unRecentData = require('./recent_data.js')
var { PostGressConnection } = require('../modules/database');
const RealPostgress = new PostGressConnection();

// let filteredData =  unRecentfilteredData(filteredData)

// async function getData(){
//     let a = await RealPostgress.ReadQuery("SELECT * FROM activity_stream as s CROSS JOIN viewdemo_stream as v WHERE s.activity_id = v.activity_id", function (data_set) {
//         return data_set.rows
//         // res.setHeader('Content-Type', 'application/json');
//         // res.send(data_set.rows);
//       });
//       return a
      
// }

// const a =  getData()

// console.log(a)

function dateDiff() {
    let sql = "SELECT datediff('days', '1996-08-13 00:00:00+05', '1996-08-27 00:00:00+05')"
    RealPostgress.ReadQuery(sql, function (data_set) {
        console.log(data_set.rows)
      })
}

dateDiff()


function filterByCompletedOrders(data){
    let filteredData = []
    let completedOrder = "completed_order"
    for(let i = 0; i<data.length; i++){
        if(data[i].activity === completedOrder) {
            filteredData.push(data[i])
        }
    }
    return filteredData
}

const filteredData = filterByCompletedOrders(data)

function createCustomer(){
    // Get a list of Customers
    let customer = []
    for (let i = 0; i<filteredData.length; i++){
        if(filteredData[i].occurrence === 1) {
            customer.push(filteredData[i].customer)
        }
    }
    return customer

}

// function createTotalValuePerOccurence(){
//     let occurenceCount = createOccurenceArray()
//     let totals = []
//     for(let i = 0; i<occurenceCount.length; i++){
//         let sum = 0
//         for(let j =0; j<filteredData.length; j++){
//             if(data[j].occurrence === i+1 ) {
//                 sum += data[j].revenue_impact
//             }
//         }
//         totals.push(sum)
//     }
//     console.log(totals)
// }
 
// createTotalValuePerOccurence()


function createOccurenceArray(){
    //  Get a list of occurences
    let customer = createCustomer()
    let occurence = []
    // Ensures customers at the begining remain the same to the end
    for (let i = 0; i<filteredData.length; i++){
        if(customer.includes(filteredData[i].customer)) {
            occurence.push(filteredData[i].occurrence)
        }
       
    }

occurence.sort(function(a, b) {
    return a - b;
  });
const countOccurrences = arr => arr.reduce((prev, curr) => (prev[curr] = ++prev[curr] || 1, prev), {});
const occurenceCount = countOccurrences(occurence)
const occurenceCountArray = Object.values(occurenceCount)

return occurenceCountArray
}


function conversionToNextOrder(){
    // Conversion to next Order
    let conversionRate = []
    let occurenceCount = createOccurenceArray()
for(let i = 0; i < occurenceCount.length; i++){
    let cr = 0
        
    cr = Math.trunc(occurenceCount[i+1]/occurenceCount[i] * 100)
    if(cr){
        conversionRate.push(cr)
    }  
   
}

return conversionRate
}

conversionToNextOrder()

function totalOrdersPercent(){
    // Percentage of total completed order
    let occurenceCount = createOccurenceArray()
    const totalCompletedOrders = occurenceCount.reduce((a, b) => a+b)
    let ordersPercent = []
for(let i = 0; i<occurenceCount.length; i++){
    let percent = occurenceCount[i]/totalCompletedOrders * 100
    ordersPercent.push(percent)
}
return ordersPercent
}

function likelihoodToCompletedOrders(){
    // Likelihood of reaching each Completed Order
    let conversionRate = conversionToNextOrder()
    let likelihoodToCompleteOrders = [100]
    let product = conversionRate[0]
    for(let j =1; j<conversionRate.length; j++) {  
        product = product * conversionRate[j]/100
        if(product){
            likelihoodToCompleteOrders.push(product)
        }
        
    }
    return likelihoodToCompleteOrders
}

    function medianDaysBetweenEachOrder(){
    // Median Days between Each order
    let occurenceCount = createOccurenceArray()
    let customer = createCustomer()
    let allDays = []
    for(let i = 0; i<customer.length; i++){
        let ts = []
        for (let j =0; j<filteredData.length; j++ ){
            if(filteredData[j].customer === customer[i]){
                ts.push(filteredData[j].ts)
                ts.sort(function(a, b) {     
                    a = new Date(a);
                    b = new Date(b);
                    return a <b ? -1 : a > b ? 1 : 0; })
            }
        }
        allDays.push(ts)
    }
    
    let timeDifferenceBetweenOrders = []
    for(let i = 0; i<allDays.length; i++){
        let difference = []
        for(let j = 0; j<allDays[i].length; j++){
            let a = new Date(allDays[i][j]) 
            let b = new Date(allDays[i][j+1])
            let diff = (b - a)/(1000*3600*24);
            if(diff) {
            difference.push(diff) 
            }
            
        }
        timeDifferenceBetweenOrders.push(difference)
    }

    // Calculate the median time difference between two orders
    let medianTdForAllOrders  = []
    for(let i = 0; i<occurenceCount.length; i++){
        let sum = 0
        for (let j =0; j <timeDifferenceBetweenOrders.length; j++){
            if(timeDifferenceBetweenOrders[i][j]){
                sum += timeDifferenceBetweenOrders[i][j]
            }
        }
     
        let medianTimeDifference = Math.trunc(sum/occurenceCount[i])
        medianTdForAllOrders.push(medianTimeDifference)
    }
    medianTdForAllOrders.sort((a,b) => a-b)
    return medianTdForAllOrders
}


function averageOrderValueByOccurence(){
// Average Order value by occurence

let occurenceCount = createOccurenceArray()
let averageOrderOccurence = []
for(let i = 0; i<occurenceCount.length; i++){
    let sum = 0
    for(let j =0; j<filteredData.length; j++){   
        if( i+1 === filteredData[j].occurrence) {
            sum+= filteredData[j].revenue_impact
        }
    }
    let average = Math.round(sum/occurenceCount[i])
    averageOrderOccurence.push(average)
}

return averageOrderOccurence
}



function expectedValues(){
    // LIKELIHOOD OF NTH ORDER * AVERAGE ORDER VALUE = EXPECTED VALUE
let averageOrderOccurence = averageOrderValueByOccurence()
let expectedValues = []
let expectedCustomerRevenue = 0
let likelihood = likelihoodToCompletedOrders()
for(let i =0; i<likelihood.length; i++){
    let product = likelihood[i] * averageOrderOccurence[i]/100
    expectedCustomerRevenue += product
    expectedValues.push(expectedCustomerRevenue)
}

return expectedValues
}


function calculateLtv(){
    // Calculate Ltv
let expectedValue = expectedValues()
let sum = 0
let ltv, orderNumber
for(let i = 0; i < expectedValue.length; i++){
    sum+= expectedValue[i]
    if((expectedValue[i]/sum) * 100 <= 1 || i === expectedValue.length - 1){
        let a  = expectedValue[i]
        ltv = a/0.95
        orderNumber = i + 1
        break;
    }
}
return ltv

}

function modellingLtv(){
// Modelling ltv to accrue time
let medianDaysBetweenOrders = medianDaysBetweenEachOrder()
let totalTime = 0
for(let i = 0; i<order_number; i++){
    totalTime += medianDaysBetweenOrders[i]
}
return totalTime
}

let customer = createCustomer()



module.exports = {
    conversionToNextOrder,
    createOccurenceArray,
    likelihoodToCompletedOrders,
    averageOrderValueByOccurence,
    totalOrdersPercent,
    expectedValues,
    calculateLtv,
    medianDaysBetweenEachOrder
};
