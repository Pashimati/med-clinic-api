const express = require('express');
const { checkIfAdmin } = require("../middlewares/auth-middleware");
const router = express.Router();
const { addOrUpdateFileCollection, deleteFileCollection, getFileCollection, getAllFromCollection } = require('./../db/db')
const { SPECIALITYS } = require('./../db/tables')

router.get('/get/:id', checkIfAdmin, async (request, res) => {
    const id = request.params.id
    let status = true;
    const speciality = await getFileCollection(SPECIALITYS, id);

    if (!speciality) {
        status = false;
    }

    res.json({
        speciality: speciality,
        success: status
    })
})

router.post('/add', checkIfAdmin, async (request, res) => {
    const title = request.body.title

    let message = 'speciality has not been created'
    let success = false;

    if (title) {
        await addOrUpdateFileCollection(SPECIALITYS, null,{
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

router.post('/update', checkIfAdmin, async (request, res) => {
    const id = request.body.id
    const title = request.body.title

    let message = 'speciality has not been updated'
    let success = false;

    if (id && title) {
        await addOrUpdateFileCollection(SPECIALITYS, id, {
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


router.delete('/delete/:id', checkIfAdmin, async (request, res) => {
    const fileName = request.params.id

    let message = 'speciality has been deleted'
    let success = true;

    try {
        if (!fileName) {
            throw new Error('fileName is not exist')
        }

        await deleteFileCollection(SPECIALITYS, fileName)
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


router.get('/get-all', checkIfAdmin, async (request, res) => {
    let specialitys = [];
    let state = true;
    await getAllFromCollection(SPECIALITYS)
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