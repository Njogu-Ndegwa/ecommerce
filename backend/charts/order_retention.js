// Order retention by Occurence
let {conversionToNextOrder} = require('./chart_services')
let { createOccurenceArray : createOccurences, likelihoodToCompletedOrders } = require('./chart_services')
let conversionRate = conversionToNextOrder()
let createOccurence =  createOccurences()
let likelihood = likelihoodToCompletedOrders()

module.exports = createOccurence.reduce((r, c, i) => {
    r['order-retention'].data.push({
        name: i + 1,
        cto: conversionRate[i],
        tco: createOccurence[i]
    });
    return r;
}, 
{
    'order-retention': { 
        data: [] 
    }
});
