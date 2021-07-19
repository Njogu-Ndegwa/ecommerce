let orderRetention = require('./order_retention')
let likelihoodToReachOrder = require('./likelihood_to_reach_completed_order')
let averageOrderValue = require('./average_order_value')
let customerValueByOccurence = require('./customer_value_by_occurence')
let medianDaysBetweenOrder = require('./median_days_between_order')
let customerValueByTenure = require('./value_by_customer_tenure')
const {calculateLtv} = require('./chart_services')
let ltv = calculateLtv()
console.log(ltv)

module.exports = {
    data: {
        ...orderRetention,
        ...likelihoodToReachOrder,
        ...averageOrderValue,
        ...customerValueByOccurence,
        ...medianDaysBetweenOrder,
        ... customerValueByTenure,
        ltv
    }
}
