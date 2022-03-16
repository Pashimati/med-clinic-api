// Import the functions you need from the SDKs you need
const {initializeApp} = require("firebase/app");
const {getFirestore} = require("firebase/firestore")
const { doc, setDoc, collection, deleteDoc, getDoc } = require("firebase/firestore");



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAN8J6iltTJ7bTU-76hBSk8qK1E2OGBO_A",
    authDomain: "medical-clinic-db.firebaseapp.com",
    projectId: "medical-clinic-db",
    storageBucket: "medical-clinic-db.appspot.com",
    messagingSenderId: "529552749456",
    appId: "1:529552749456:web:7b23b6f033079e01b83915",
    measurementId: "G-5H64M71JY8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

/**
 *
 * @param {string}collectionName
 * @param {string}fileName
 * @param {object}data
 * @returns {Promise<void>}
 */
exports.addOrUpdateFileCollection = async function(collectionName, fileName, data) {
    await setDoc(doc(db, collectionName, fileName), data);
}

/**
 *
 * @param {string}collectionName
 * @param {string}fileName
 * @returns {Promise<void>}
 */
exports.deleteFileCollection = async function(collectionName, fileName) {
    await deleteDoc(doc(db, collectionName, fileName));
}

/**
 *
 * @param {string}collectionName
 * @param {string}fileName
 * @returns {Promise<DocumentData|null>}
 */
exports.getFileCollection = async function(collectionName, fileName) {
    const docSnap = await getDoc(doc(db, collectionName, fileName));
    if (docSnap.exists()) {
       return docSnap.data();
    } else {
        return null
    }
}