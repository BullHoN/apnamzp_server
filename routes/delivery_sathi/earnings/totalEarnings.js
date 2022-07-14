module.exports =  (orders)=>{
    let earnings = 0;
    let incentives = 0;

    if(orders.length == 1){
        incentives += 30;
    }
    else if(orders.length == 9){
        incentives += 30;
    }
    else if(orders.length == 13){
        incentives += 120;
    }
    else if(orders.length == 18){
        incentives += 180;
    }

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

    return {earnings,incentives,totalEarnings: earnings + incentives}
}




