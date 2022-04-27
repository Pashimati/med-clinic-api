const express = require('express');
const { checkIfAuthenticated, checkIfDoctor } = require("../middlewares/auth-middleware");
const router = express.Router();
const { addOrUpdateFileCollection, deleteFileCollection, getFileCollection, getAllFromCollection } = require('./../db/db')
const { SUBSCRIPTIONS, USERS, DOCTORS } = require('./../db/tables')
const { sendingLetter } = require('../services/email-service')
const { collection, query, where, getDocs, orderBy } = require("firebase/firestore");
const { db } = require('../db/db');
const subscriptions = collection(db, "subscriptions");


router.post('/add', checkIfAuthenticated, async (request, res) => {
    const email = request.body.data.email
    let date = request.body.data.date
    const time = request.body.data.time
    const uidUser = request.body.data.uidUser
    const uidDoctor = request.body.data.nameDoctor.doctorUid
    if (time) {
        let hoursAndMinArray = time.split(':')
        let dateObject = new Date(date)
        dateObject.setHours(hoursAndMinArray[0])
        dateObject.setMinutes(hoursAndMinArray[1])

        date = dateObject.getTime()
    }

    let message = 'subscription has not been created'
    let success = false;

    if ( email && date && uidUser && uidDoctor) {

        const user = await getFileCollection(USERS, uidUser);
        const doctor = await getFileCollection(DOCTORS, uidDoctor);

        if (!user && !doctor) {
            success = false;
        }

        let dateString = new Date(date);

        let dateFormat = dateString.getDate()+
            "/"+(dateString.getMonth()+1)+
            "/"+dateString.getFullYear()+
            " "+dateString.getHours()+
            ":"+dateString.getMinutes();

        const info = {
            user: user,
            doctor: doctor,
            date: dateFormat
        }
        sendingLetter(email, info)

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


router.post('/delete', checkIfDoctor, async (request, res) => {
    const fileName = request.body.id

    let message = 'subscription has been deleted'
    let success = true;

    try {
        if (!fileName) {
            throw new Error('fileName is not exist')
        }

        await deleteFileCollection(SUBSCRIPTIONS, fileName)
            .then((status) => {
                success = status
                if (!status) {
                    throw new Error('subscription has not been deleted');
                }
            })
    } catch (e) {
        message = e;
    }

    res.json({
        success,
        message
    })
})


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

router.post('/get-all-byId', checkIfDoctor, async (request, res) => {
    const uidDoctor = request.body.uid
    let subscriptionsById = [];
    let state = true;
    const q =  query(subscriptions, where("uidDoctor", "==", uidDoctor), orderBy("date", "asc"))

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        subscriptionsById.push({
            data:doc.data(),
            id: doc.id
        })
    });
    res.json({
        subscriptionsById: subscriptionsById,
        success: state
    })
})

module.exports = router