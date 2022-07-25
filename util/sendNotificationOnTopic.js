const admin = require("firebase-admin")

function sendNotificationByTopic(topic,data) {
    
	const message = {
		data: data,
		topic: topic,
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




module.exports = sendNotificationByTopic;