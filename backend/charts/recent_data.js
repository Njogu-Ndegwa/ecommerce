// let data = require('./Datafile.json')

module.exports =  function ignoreRecentData(data) {
    let customers = []
    let individual_customer_occurence = []
    let un_recent_data = []
    // An array of customers names
    for(let i = 0; i< data.length; i++){
        if(!customers.includes(data[i].customer)) {
            customers.push(data[i].customer)
        }
    }
    // An array of Customers occurences
    for(let i = 0; i <customers.length; i++){
        let sum = 0
        for(let j = 0; j<data.length; j++){
            if(data[j].customer === customers[i]){
                sum+= 1
            }
        }
        individual_customer_occurence.push(sum)
    }
// Return An array with Most Unrecent Data - 85% of orders for each customer
    for(let i = 0; i<customers.length; i++){
        let recent_customer_occurences = individual_customer_occurence[i]
        let unrecent_customer_occurences = Math.round(recent_customer_occurences *0.85)
        for(let j = 0; j<data.length; j++){
            if(data[j].customer === customers[i] && unrecent_customer_occurences) {
                un_recent_data.push(data[j])
                unrecent_customer_occurences-=1
            }
        }
    }
    return un_recent_data
}

// ignoreRecentData()