const PaytmChecksum = require('paytmchecksum');
const https = require('https')

var paytmParams = {};

async function generateToken(orderId){

    return new Promise((resolve,reject)=>{
        paytmParams.body = {
            "requestType"   : "Payment",
            "mid"           : "LsEyrl52456588932146",
            "websiteName"   : "WEBSTAGING",
            "orderId"       : orderId,
            "txnAmount"     : {
                "value"     : "10.00",
                "currency"  : "INR",
            },
            "userInfo"      : {
                "custId"    : "CUST_001",
            },
        };
        
        /*
        * Generate checksum by parameters we have in body
        * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
        */
        PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), "tDgsZhK0qNuoIeGE").then(function(checksum){
        
            paytmParams.head = {
                "signature"    : checksum
            };
        
            var post_data = JSON.stringify(paytmParams);
        
            var options = {
        
                /* for Staging */
                hostname: 'securegw-stage.paytm.in',
        
                /* for Production */
                // hostname: 'securegw.paytm.in',
        
                port: 443,
                path: `/theia/api/v1/initiateTransaction?mid=LsEyrl52456588932146&orderId=${orderId}`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': post_data.length
                }
            };
        
            var response = "";
            var post_req = https.request(options, function(post_res) {
                post_res.on('data', function (chunk) {
                    response += chunk;
                });
        
                post_res.on('end', function(){
                    console.log('Response: ', response);
                    response = JSON.parse(response)
                    resolve({
                        token: response.body.txnToken
                    })
                });
            });
        
            post_req.write(post_data);
            post_req.end();
        });
    })

}

module.exports = generateToken;
