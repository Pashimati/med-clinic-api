// Import the functions you need from the SDKs you need
const {initializeApp} = require("firebase/app");
const {getFirestore} = require("firebase/firestore");
const { doc, setDoc, collection, deleteDoc, getDoc, getDocs} = require("firebase/firestore");
const uuid = require('uuid');

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
 * Добавляет если файла в базе нет, если есть- перезаписывает!
 *
 * Функция создаёт файл с переданным именем,
 * иначе генерирует и использует уникальный uuid
 *
 * @param {string}collectionName
 * @param {object}data
 * @param {string|null} fileName
 * @returns {Promise<void>}
 */
exports.addOrUpdateFileCollection = async function(collectionName, data, fileName = null) {
    let originalFileName = fileName || uuid.v1();
    let res = true;
    await setDoc(doc(db, collectionName, originalFileName), data)
        .catch(() => {
            res = false;
        })

    return res;
}

/**
 * Удаляет файл из коллекции
 *
 * @param {string}collectionName  Имя коллекции
 * @param {string}fileName  Имя файла
 * @returns {Promise<void>}
 */
exports.deleteFileCollection = async function(collectionName, fileName) {
    let res = true
    await deleteDoc(doc(db, collectionName, fileName))
        .catch(() => {
            res = false
        })

    return res;
}

/**
 * Получает файл из коллекции
 *
 * @param {string}collectionName  Имя коллекции
 * @param {string}fileName Имя файла
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

/**
 * Получает все файлы из коллекции
 *
 * @param collectionName Имя коллекции
 * @returns {Promise<{data: *, id: string}[]>}
 */
exports.getAllFromCollection = async function (collectionName) {
        const dataCol = collection(db, collectionName);
        const dataSnapshot = await getDocs(dataCol);
        const document = dataSnapshot.docs;
        let dataList = [];
        if (document.length) {
            dataList = document.map(doc => {
                return {
                    id : doc.id,
                    data: doc.data()
                }
            })
        } else {
            throw new Error('not correct collectionName or folder is empty');
        }

        return dataList;
}