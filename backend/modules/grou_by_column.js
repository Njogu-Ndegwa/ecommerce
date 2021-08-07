function groupByColumn(data_set) {
    function getRandomInt(max, min) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      for(let i = 0; i<data_set.rows.length; i++){
        data_set.rows[i].sum = getRandomInt(15000, 1000)
        data_set.rows[i].total_primary_activity = getRandomInt(100, 10)
        data_set.rows[i].total_secondary_activity = getRandomInt(20, 10)
        data_set.rows[i].conversion_rate = getRandomInt(10,1)
        data_set.rows[i].average_days = getRandomInt(40,20) 
      }
      return data_set
}

function groupByColumn2(data_set) {
    data_set.rows[0].total_primary_activity = 0
    data_set.rows[0].total_secondary_activity = 0
    data_set.rows[0].conversion_rate = 0
    data_set.rows[0].average_days = 0
    return data_set
}


function groupByDay(data_set) {
    function getRandomInt(max, min) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      for(let i = 0; i<data_set.rows.length; i++){
        data_set.rows[i].sum = getRandomInt(2000, 0)
        data_set.rows[i].total_primary_activity = getRandomInt(5, 1)
        data_set.rows[i].total_secondary_activity = getRandomInt(2, 0)
        data_set.rows[i].conversion_rate = getRandomInt(5,1)
        data_set.rows[i].average_days = getRandomInt(40,20) 
      }
      return data_set
}

function groupByWeek(data_set) {
    function getRandomInt(max, min) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      for(let i = 0; i<data_set.rows.length; i++){
          
        data_set.rows[i].sum = getRandomInt(5000, 2000)
        data_set.rows[i].total_primary_activity = getRandomInt(30, 5)
        data_set.rows[i].total_secondary_activity = getRandomInt(10, 1)
        data_set.rows[i].conversion_rate = getRandomInt(5,1)
        data_set.rows[i].average_days = getRandomInt(50,20) 
        console.log(data_set.rows[i])
      }
      return data_set
}

function groupByMonth(data_set) {
    function getRandomInt(max, min) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      for(let i = 0; i<data_set.rows.length; i++){
        data_set.rows[i].sum = getRandomInt(10000, 1000)
        data_set.rows[i].total_primary_activity = getRandomInt(150, 50)
        data_set.rows[i].total_secondary_activity = getRandomInt(20, 5)
        data_set.rows[i].conversion_rate = getRandomInt(5,1)
        data_set.rows[i].average_days = getRandomInt(40,20) 
      }
      return data_set
}

function groupByYear(data_set) {
    function getRandomInt(max, min) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      for(let i = 0; i<data_set.rows.length; i++){
        data_set.rows[i].sum = getRandomInt(50000, 30000)
        data_set.rows[i].total_primary_activity = getRandomInt(1000, 500)
        data_set.rows[i].total_secondary_activity = getRandomInt(50, 20)
        data_set.rows[i].conversion_rate = getRandomInt(5,1)
        data_set.rows[i].average_days = getRandomInt(300, 150) 
      }
      return data_set
}

module.exports = {
    groupByColumn,
    groupByColumn2,
    groupByDay,
    groupByMonth,
    groupByYear,
    groupByWeek
}