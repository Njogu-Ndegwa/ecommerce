// Average Order value by occurence
const {createOccurenceArray, averageOrderValueByOccurence, totalOrdersPercent} = require('./chart_services')

let occurenceCount = createOccurenceArray()
let averageOrderValue = averageOrderValueByOccurence()
let ordersPercent = totalOrdersPercent()
module.exports = occurenceCount.reduce((r, c, i) => {
    r['average-order-value'].data.push({
        name: i+1,
        aov: averageOrderValue[i],
        tco: ordersPercent[i]
    });
    return r;
}, 
{
    'average-order-value': { 
        data: [] 
    }
});