const mongoose = require('mongoose');
const admin = require('firebase-admin');
const serviceAccount = require('../config/fcmConfig'); // Update this path
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

     // Initialize Firebase Admin SDK
     admin.initializeApp({
      credential: admin.credential.cert({
        ...serviceAccount.firebase.serviceAccount,
        projectId: 'onbo-dev-a43e3', // Update this with your actual project ID
      }),
      databaseURL: `https://onbo-dev-a43e3.firebaseio.com`, // Update this with your actual project ID
    });
    console.log('Firebase Admin SDK initialized');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

module.exports = connectDB;
