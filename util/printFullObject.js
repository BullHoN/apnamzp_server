const util = require('util');

function printFullObject(data){
    console.log(util.inspect(data,false,null,true));
}

module.exports = printFullObject;