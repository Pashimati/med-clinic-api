const express = require('express');
const router = express.Router();
const { addOrUpdateFileCollection, deleteFileCollection, getFileCollection, getAllFromCollection } = require('./../db/db')
const { DOCTORS } = require('./../db/tables')

router.get('/get/:id', async (request, res) => {
    const id = request.params.id
    console.log(request)
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

router.post('/add', async (request, res) => {
    const name = request.body.name
    const surname = request.body.surname
    const speciality = request.body.speciality

    let message = 'doctor has not been created'
    let success = false;

    if (name && surname && speciality) {
        await addOrUpdateFileCollection(DOCTORS, {
            name: name,
            surname: surname,
            speciality: speciality,
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

router.post('/update', async (request, res) => {
    const name = request.body.name
    const surname = request.body.surname
    const speciality = request.body.speciality

    let message = 'doctor has not been created'
    let success = false;

    if (name && surname && speciality) {
        await addOrUpdateFileCollection(DOCTORS, {
            name: name,
            surname: surname,
            speciality: speciality,
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


router.post('/delete', async (request, res) => {
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
            console.log('doctors is empty')
            state = false;
        })

    res.json({
        doctors: doctors,
        success: state
    })
})

module.exports = router;