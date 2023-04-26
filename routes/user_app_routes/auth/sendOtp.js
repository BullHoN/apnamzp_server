const axios = require('axios');

let sendOtp = function (number, otp) {
  const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${process.env.OTP_AUTH_KEY}&variables_values=${otp}&route=otp&numbers=${number}`;
  axios.get(url).then((res) => {
    console.log(res.data);
  });

  // var req = unirest("POST", "https://www.fast2sms.com/dev/bulk");

  // req.headers({
  //   "content-type": "application/x-www-form-urlencoded",
  //   "cache-control": "no-cache",
  //   "authorization": process.env.OTP_AUTH_KEY
  // });

  // req.form({
  //   "sender_id": "FSTSMS",
  //   "language": "english",
  //   "route": "qt",
  //   "numbers": number,
  //   "message": "31719",
  //   "variables": "{#AA#}",
  //   "variables_values": otp
  // });

  // req.end(function (res) {
  //   if (res.error) console.log(res.error)
  //   console.log(res.body);
  // });
};

module.exports = sendOtp;
