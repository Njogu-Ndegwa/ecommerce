const {createOccurenceArray, expectedValues, medianDaysBetweenEachOrder} = require('./chart_services')

let occurenceCount = createOccurenceArray()
let medianDays = medianDaysBetweenEachOrder()
const expectedValue = expectedValues()

module.exports = occurenceCount.reduce((r, c, i) => {
    r['customer-value-by-tenure'].data.push({
        name: medianDays[i],
        amt: expectedValue[i],
    });
    return r;
}, 
{
    'customer-value-by-tenure': { 
        data: [] 
    }
});