module.exports =  (orders)=>{
    let earnings = 0;
    // TODO: take incentives into considirations
    for(let i=0;i<orders.length;i++){
        const order = orders[i]
        const actutalDistace = Number.parseInt(order.actualDistance)
        // TODO: Change this to actual data
        if(actutalDistace <= 2){
            earnings += 15
        }
        else if(actutalDistace <= 4){
            earnings += 20
        }
        else {
            earnings += 50
        }
    }

    return earnings
}




