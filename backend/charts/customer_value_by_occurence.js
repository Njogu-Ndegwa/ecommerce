// Accrued Customer Value by Occurence
const {createOccurenceArray, expectedValues, calculateLtv} = require('./chart_services')

let occurenceCount = createOccurenceArray()
const expectedValue = expectedValues()
const ltv = calculateLtv()

module.exports = occurenceCount.reduce((r, c, i) => {
    r['customer-value-by-occurence'].data.push({
        name: i+1,
        amt: expectedValue[i],
        ltv: ltv
    });
    return r;
}, 
{
    'customer-value-by-occurence': { 
        data: [] 
    }
});