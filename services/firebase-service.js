const admin = require("firebase-admin");
const {
    getAuth,
    signOut
} = require("firebase/auth")
const auth = getAuth();

const serviceAccount = require("../db/medical-clinic-db-firebase-adminsdk-66h4d-8b2d4a893e.json");

exports.firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://medical-clinic-db.firebaseio.com'
});

exports.signOut = async () => {
    let res = false;
    await signOut(auth).then(() => {
        res = true;
    }).catch((error) => {
        res = false;
    });

    return res;
}