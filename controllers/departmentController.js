const express = require('express');
const router = express.Router();
const { addOrUpdateFileCollection, deleteFileCollection, getFileCollection, getAllFromCollection } = require('./../db/db')
const { DEPARTMENTS } = require('./../db/tables')

// router.get('/get/:id', async (request, res) => {
//     const id = request.params.id
//     let status = true;
//     const doctor = await getFileCollection(DEPARTMENTS, id);
//
//     if (!doctor) {
//         status = false;
//     }
//
//     res.json({
//         doctor: doctor,
//         success: status
//     })
// })

router.get('/add', async (request, res) => {
    const title = 'хирургия'

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

// router.post('/update', async (request, res) => {
//     const id = request.body.data.id
//     const name = request.body.data.name
//     const surname = request.body.data.surname
//     const speciality = request.body.data.speciality
//     const department = request.body.data.department
//
//     let message = 'doctor has not been updated'
//     let success = false;
//
//     if (id && name && surname && speciality) {
//         await addOrUpdateFileCollection(DOCTORS, id, {
//             id: id,
//             name: name,
//             surname: surname,
//             speciality: speciality,
//             department: department,
//         })
//             .then((status) => {
//                 message = 'doctor has been updated'
//                 success = status
//             })
//     }
//
//     res.json({
//         success: success,
//         message: message,
//     })
// })
//
//
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