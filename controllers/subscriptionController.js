const express = require('express');
const router = express.Router();
const { addOrUpdateFileCollection, deleteFileCollection, getFileCollection, getAllFromCollection } = require('./../db/db')
const { SUBSCRIPTIONS } = require('./../db/tables')
const { sendingLetter } = require('../services/email-service')
const { collection, query, where, getDocs } = require("firebase/firestore");
const { db } = require('../db/db');
const subscriptions = collection(db, "subscriptions");

router.post('/add', async (request, res) => {
    const email = request.body.data.email
    const date = request.body.data.date
    const uidUser = request.body.data.uidUser
    const uidDoctor = request.body.data.nameDoctor.doctorUid

    let message = 'subscription has not been created'
    let success = false;

    if ( email && date && uidUser && uidDoctor) {
        sendingLetter(email)
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


router.get('/get-all', async (request, res) => {
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

router.get('/get-all-byId', async (request, res) => {
    const uidDoctor = 'ZFZwDcId1YamM0wnZeSAcfVb4AA3'
    let subscriptionsById = [];
    let state = true;
    const q = query(subscriptions, where("uidDoctor", "==", uidDoctor))

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        subscriptionsById = doc.data()
        // console.log(doc.id, " => ", doc.data());
    });

    res.json({
        subscriptionsById: subscriptionsById,
        success: state
    })
})

module.exports = router