const express = require('express');
const router = express.Router();
const { addOrUpdateFileCollection, deleteFileCollection, getFileCollection, getAllFromCollection } = require('./../db/db')
const { DEPARTMENTS } = require('./../db/tables')

router.get('/get/:id', async (request, res) => {
    const id = request.params.id
    let status = true;
    const department = await getFileCollection(DEPARTMENTS, id);

    if (!department) {
        status = false;
    }

    res.json({
        department: department,
        success: status
    })
})

router.post('/add', async (request, res) => {
    const title = request.body.data.title

    let message = 'department has not been created'
    let success = false;

    if (title) {
        await addOrUpdateFileCollection(DEPARTMENTS, null,{
            title: title,
        })
            .then((status) => {
                message = 'department has been created'
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

    let message = 'department has not been updated'
    let success = false;

    if (id && title) {
        await addOrUpdateFileCollection(DEPARTMENTS, id, {
            title: title,
        })
            .then((status) => {
                message = 'department has been updated'
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

    let message = 'department has been deleted'
    let success = true;

    try {
        if (!fileName) {
            throw new Error('fileName is not exist')
        }

        await deleteFileCollection(DEPARTMENTS, fileName)
            .then((status) => {
                success = status
                if (!status) {
                    throw new Error('department has not been deleted');
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
    let departments = [];
    let state = true;
    await getAllFromCollection(DEPARTMENTS)
        .then((departmentsList) => {
            departments = departmentsList
        })
        .catch(() => {
            state = false;
        })

    res.json({
        departments: departments,
        success: state
    })
})

module.exports = router;