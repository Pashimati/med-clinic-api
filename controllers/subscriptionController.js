const express = require('express');
const { checkIfAuthenticated, checkIfDoctor } = require("../middlewares/auth-middleware");
const router = express.Router();
const { addOrUpdateFileCollection, deleteFileCollection, getFileCollection, getAllFromCollection } = require('./../db/db')
const { SUBSCRIPTIONS } = require('./../db/tables')
const { sendingLetter } = require('../services/email-service')
const { collection, query, where, getDocs, orderBy } = require("firebase/firestore");
const { db } = require('../db/db');
const subscriptions = collection(db, "subscriptions");
let ejs = require('ejs');


router.post('/add', checkIfAuthenticated, async (request, res) => {
    const email = request.body.data.email
    let date = request.body.data.date
    const time = request.body.data.time
    const uidUser = request.body.data.uidUser
    const uidDoctor = request.body.data.nameDoctor.doctorUid
    if (time) {
        console.log('time is exist');
        let hoursAndMinArray = time.split(':')
        let dateObject = new Date(date)
        dateObject.setHours(hoursAndMinArray[0])
        dateObject.setMinutes(hoursAndMinArray[1])

        date = dateObject.getTime()
    }

    let message = 'subscription has not been created'
    let success = false;

    if ( email && date && uidUser && uidDoctor) {
        let path = __dirname + "/../views/report.ejs";

        console.log(path)
        const template = ejs.renderFile(path, {people: people})
        sendingLetter(email, template)
        await addOrUpdateFileCollection(SUBSCRIPTIONS, null,{
            uidDoctor: uidDoctor,
            uidUser: uidUser,
            email: email,
            date: date,
        })
            .then((status) => {
                message = 'subscription has been created'
                success = status
            })
    }

    res.json({
        success: success,
        message: message,
    })
})


// router.post('/delete', async (request, res) => {
//     const fileName = request.body.id
//
//     let message = 'user has been deleted'
//     let success = true;
//
//     try {
//         if (!fileName) {
//             throw new Error('fileName is not exist')
//         }
//
//         await deleteFileCollection(USERS, fileName)
//             .then((status) => {
//                 success = status
//                 if (!status) {
//                     throw new Error('doctor has not been deleted');
//                 }
//             })
//     } catch (e) {
//         message = e;
//     }
//
//     res.json({
//         success,
//         message
//     })
// })


router.get('/get-all', checkIfDoctor, async (request, res) => {
    let subscriptions = [];
    let state = true;
    await getAllFromCollection(SUBSCRIPTIONS)
        .then((subscriptionsList) => {
            subscriptions = subscriptionsList
        })
        .catch(() => {
            state = false;
        })

    res.json({
        subscriptions: subscriptions,
        success: state
    })
})

router.post('/get-all-byId', async (request, res) => {
    const uidDoctor = request.body.uid
    let subscriptionsById = [];
    let state = true;
    const q =  query(subscriptions, where("uidDoctor", "==", uidDoctor), orderBy("date", "asc"))

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        subscriptionsById.push(doc.data())
    });
    res.json({
        subscriptionsById: subscriptionsById,
        success: state
    })
})

module.exports = router