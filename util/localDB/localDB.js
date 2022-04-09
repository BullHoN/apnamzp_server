const levelup = require('levelup')
const leveldown = require('leveldown')

class localDB {
    constructor(){
        levelup(leveldown('../../deliveryBoysData'),{},(err,db)=>{
            if(err) throw err;

            this.db = db
            this.db.put('deliverySathis',"{}");
        });
    }

    get(key){
        return new Promise((resolve,reject)=>{
            this.db.get(key,{asBuffer: false},(err,value)=>{
                if(err) resolve({})
                resolve(value);
            })
        })
    }

    pushDeliveryBoys(key,data){
        return new Promise(async (resolve,reject)=>{
            let oldData = await this.get(key);
            oldData = JSON.parse(oldData);

            oldData[data.phoneNo] = data;

            this.db.put(key,JSON.stringify(oldData)).then(()=>{
                resolve({
                    success: true
                })
            })
            
        })
    }

}

module.exports = new localDB();