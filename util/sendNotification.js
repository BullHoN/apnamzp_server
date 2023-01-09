const admin = require("firebase-admin")

function sendNotification(userFCMId,data) {
	if(!userFCMId) return;
	
	const message = {
		data: data,
		token: userFCMId,
        android:{
            priority: "high"
        }
	}

	admin.messaging().send(message)
	  .then((response) => {
	    console.log('Successfully sent message to ' + "user", response);
	  })
	  .catch((error) => {
	    console.log('Error sending message to' + "user", error);
	  });	

}


module.exports = sendNotification;