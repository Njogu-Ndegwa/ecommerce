// Modelled likelihood of reaching each order
const {createOccurenceArray, likelihoodToCompletedOrders} = require('./chart_services')
let occurenceCount = createOccurenceArray()
let likelihood = likelihoodToCompletedOrders()

module.exports = occurenceCount.reduce((r, c, i) => {
    r['likelihood-to-reach-order'].data.push({
        name: i+1,
        lco: likelihood[i]
    });
    return r;
}, 
{
    'likelihood-to-reach-order': { 
        data: [] 
    }
});