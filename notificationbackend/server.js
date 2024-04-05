const express = require('express');
const admin = require('firebase-admin');
const mongoose = require('mongoose');

const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const app = express();
app.use(express.json());


mongoose.connect('mongodb://127.0.0.1:27017/notificationtest').then(()=>{
    console.log("connection succesfull")
}).catch((e)=>{
    console.log(e)
})


const userSchema = new mongoose.Schema({
    name:String,
    token:String
})

const usemodel = mongoose.model("user",userSchema)


app.post("/createuser",(async(req,res)=>{
    const {name,token}=req.body;
    console.log(name,token)
    console.log("request aayi h");
   const newuser = await usemodel.create({name:name,token:token})
   const message = {
            notification: {
              title:"hi i am here",
              body:"why you msg me",
            },
            token: "f7DkuLksT6KQB23Y-ZHUA1:APA91bEwgC3XB4XIG-E6wiN4u10p41cXt5VnT8YAXwsZ2kW5DwX0rDIHVplRQqsCMdsZSejG06xpR3jIfsFpX9w9pJUIOSPhnDK3gnAMdtISXMtz1cG1wjREjxd-sUybnnZ7_IlsYskF"
          };
          const response = await admin.messaging().send(message);
          console.log('Notification sent:', response);
         return res.send(newuser);
}))


const meesagesend =async()=>{
    const message = {
        notification: {
          title:"hi i am here",
          body:"why you msg me",
        },
        data:{
            navigationId:'Old'
        }, 
        token: "f7DkuLksT6KQB23Y-ZHUA1:APA91bEwgC3XB4XIG-E6wiN4u10p41cXt5VnT8YAXwsZ2kW5DwX0rDIHVplRQqsCMdsZSejG06xpR3jIfsFpX9w9pJUIOSPhnDK3gnAMdtISXMtz1cG1wjREjxd-sUybnnZ7_IlsYskF"
      };
      const response = await admin.messaging().send(message);
}
setTimeout(()=>{
   meesagesend()
},2000)

// Initialize Firebase Admin SDK


// Connect to MongoDB
// mongodb.MongoClient.connect('mongodb://localhost:27017', (err, client) => {
//   if (err) {
//     console.error('Error connecting to MongoDB:', err);
//     return;
//   }
//   console.log('Connected to MongoDB');
//   const db = client.db('testnotification');

//   // Save device token API endpoint
//   app.post('/save-device-token', async (req, res) => {
//     const { userId, deviceToken } = req.body;

//     try {
//       await db.collection('users').updateOne(
//         { _id: userId },
//         { $set: { deviceToken } },
//         { upsert: true }
//       );
//       res.json({ success: true });
//     } catch (error) {
//       console.error('Error saving device token:', error);
//       res.status(500).json({ success: false, error: 'Failed to save device token' });
//     }
//   });

//   // Send notification API endpoint
//   app.post('/send-notification', async (req, res) => {
//     const { title, body, userId } = req.body;

//     try {
//       const user = await db.collection('users').findOne({ _id: userId });
//       const deviceToken = user.deviceToken;

//       const message = {
//         notification: {
//           title,
//           body,
//         },
//         token: deviceToken,
//       };

//       const response = await admin.messaging().send(message);
//       console.log('Notification sent:', response);

//       res.json({ success: true });
//     } catch (error) {
//       console.error('Error sending notification:', error);
//       res.status(500).json({ success: false, error: 'Failed to send notification' });
//     }
//   });
// });

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});