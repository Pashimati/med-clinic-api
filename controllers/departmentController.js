const express = require('express');
const { checkIfAdmin,  } = require("../middlewares/auth-middleware");
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

router.post('/add', checkIfAdmin,async (request, res) => {
    const title = request.body.title
    const description = request.body.description

    let message = 'department has not been created'
    let success = false;

    if (title) {
        await addOrUpdateFileCollection(DEPARTMENTS, null,{
            title: title,
            description: description,
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

router.post('/update', checkIfAdmin,  async (request, res) => {
    const id = request.body.id
    const title = request.body.title
    const description = request.body.description

    let message = 'department has not been updated'
    let success = false;

    if (id && title && description) {
        await addOrUpdateFileCollection(DEPARTMENTS, id, {
            title: title,
            description: description,
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


router.delete('/delete/:id', checkIfAdmin, async (request, res) => {
    const fileName = request.params.id
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