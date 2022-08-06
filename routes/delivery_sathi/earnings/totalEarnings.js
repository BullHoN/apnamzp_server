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
        // TODO: Change this to actual data
        earnings += order.deliverySathiIncome
    }

    return {earnings,incentives,totalEarnings: earnings + incentives}
}




