const express = require('express');
const router = express.Router();
const { addOrUpdateFileCollection, deleteFileCollection, getFileCollection, getAllFromCollection } = require('./../db/db')
const { DOCTORS } = require('./../db/tables')
const { checkIfDoctor, checkIfAdmin } = require('../middlewares/auth-middleware')
const { firebaseAdmin } = require('../services/firebase-service');

router.get('/get/:id', async (request, res) => {
    const id = request.params.id
    let status = true;
    const doctor = await getFileCollection(DOCTORS, id);

    if (!doctor) {
        status = false;
    }

    res.json({
        doctor: doctor,
        success: status
    })
})

router.post('/admin/add', checkIfAdmin, async (request, res) => {
    const password = request.body.data.password
    const email = request.body.data.email
    const name = request.body.data.name
    const surname = request.body.data.surname
    const speciality = request.body.data.speciality
    const department = request.body.data.department
    const about = request.body.data.about

    let message = 'doctor has not been created'
    let success = false;

    const doctor = await firebaseAdmin.auth().createUser({
        email,
        password,
    });

    const uid = doctor.uid
    firebaseAdmin.auth()
        .setCustomUserClaims(uid, { doctor: true })
        .then(() => {
            // The new custom claims will propagate to the user's ID token the
            // next time a new one is issued.
        });

    if (name && surname && speciality && department && about && uid) {
        await addOrUpdateFileCollection(DOCTORS, uid,{
            doctorUid: uid,
            name: name,
            surname: surname,
            speciality: speciality,
            department: department,
            about: about,
        })
            .then((status) => {
                message = 'doctor has been created'
                success = status
            })
    }

    res.json({
        success: success,
        message: message,
    })
})


router.post('/admin/update', checkIfAdmin, async (request, res) => {
    const id = request.body.data.id
    const name = request.body.data.name
    const surname = request.body.data.surname
    const speciality = request.body.data.speciality
    const department = request.body.data.department
    const about = request.body.data.about

    let message = 'doctor has not been updated'
    let success = false;

    if (id && name && surname && speciality && about) {
        await addOrUpdateFileCollection(DOCTORS, id, {
            doctorUid: id,
            name: name,
            surname: surname,
            speciality: speciality,
            department: department,
            about: about,
        })
            .then((status) => {
                message = 'doctor has been updated'
                success = status
            })
    }

    res.json({
        success: success,
        message: message,
    })
})


router.post('/delete', checkIfAdmin, async (request, res) => {
    const fileName = request.body.id

    let message = 'doctor has been deleted'
    let success = true;

    try {
        if (!fileName) {
            throw new Error('fileName is not exist')
        }

        await deleteFileCollection(DOCTORS, fileName)
            .then((status) => {
                success = status
                if (!status) {
                    throw new Error('doctor has not been deleted');
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


router.get('/get-all', async (request, res) => {
    let doctors = [];
    let state = true;
    await getAllFromCollection(DOCTORS)
        .then((doctorsList) => {
            doctors = doctorsList
        })
        .catch(() => {
            state = false;
        })

    res.json({
        doctors: doctors,
        success: state
    })
})


router.get('/admin/get-all', checkIfAdmin, async (request, res) => {
    let doctors = [];
    let state = true;
    await getAllFromCollection(DOCTORS)
        .then((doctorsList) => {
            doctors = doctorsList
        })
        .catch(() => {
            state = false;
        })

    res.json({
        doctors: doctors,
        success: state
    })
})


module.exports = router;