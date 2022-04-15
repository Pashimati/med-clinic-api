const admin = require("firebase-admin");
// const { initializeApp } = require('firebase-admin/app');
const serviceAccount = require("../db/medical-clinic-db-firebase-adminsdk-66h4d-8b2d4a893e.json");

exports.firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://medical-clinic-db.firebaseio.com'
});