const express = require('express');
const router = express.Router();
const { addOrUpdateFileCollection, deleteFileCollection, getFileCollection, getAllFromCollection } = require('./../db/db')
const { SPECIALITY } = require('./../db/tables')

router.get('/get/:id', async (request, res) => {
    const id = request.params.id
    let status = true;
    const speciality = await getFileCollection(SPECIALITY, id);

    if (!speciality) {
        status = false;
    }

    res.json({
        speciality: speciality,
        success: status
    })
})

router.post('/add', async (request, res) => {
    const title = request.body.data.title

    let message = 'speciality has not been created'
    let success = false;

    if (title) {
        await addOrUpdateFileCollection(SPECIALITY, null,{
            title: title,
        })
            .then((status) => {
                message = 'speciality has been created'
                success = status
            })
    }

    res.json({
        success: success,
        message: message,
    })
})

router.post('/update', async (request, res) => {
    const id = request.body.data.id
    const title = request.body.data.title

    let message = 'speciality has not been updated'
    let success = false;

    if (id && title) {
        await addOrUpdateFileCollection(SPECIALITY, id, {
            title: title,
        })
            .then((status) => {
                message = 'speciality has been updated'
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

    let message = 'speciality has been deleted'
    let success = true;

    try {
        if (!fileName) {
            throw new Error('fileName is not exist')
        }

        await deleteFileCollection(SPECIALITY, fileName)
            .then((status) => {
                success = status
                if (!status) {
                    throw new Error('speciality has not been deleted');
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
    let specialitys = [];
    let state = true;
    await getAllFromCollection(SPECIALITY)
        .then((specialityList) => {
            specialitys = specialityList
        })
        .catch(() => {
            state = false;
        })

    res.json({
        specialitys: specialitys,
        success: state
    })
})

module.exports = router;