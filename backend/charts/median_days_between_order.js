// Median Days Between Each Order
const {createOccurenceArray, medianDaysBetweenEachOrder} = require('./chart_services')

let occurenceCount = createOccurenceArray()
const medianDays = medianDaysBetweenEachOrder()

module.exports = occurenceCount.reduce((r, c, i) => {
    r['median-days-between-order'].data.push({
        name: i+1,
        amt: medianDays[i],
    });
    return r;
}, 
{
    'median-days-between-order': { 
        data: [] 
    }
});