const express = require('express');
const router = express.Router();
const { addOrUpdateFileCollection, deleteFileCollection, getFileCollection, getAllFromCollection } = require('./../db/db')
const { USERS } = require('./../db/tables')
//
// router.get('/get/:id', async (request, res) => {
//     const id = request.params.id
//     let status = true;
//     const doctor = await getFileCollection(DOCTORS, id);
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

router.post('/add', async (request, res) => {
    const fileName = request.body.data.fileName
    const name = request.body.data.name
    const surname = request.body.data.surname
    const sex = request.body.data.sex
    const age = request.body.data.age
    const address = request.body.data.address
    const phone = request.body.data.phone

    let message = 'user has not been created'
    let success = false;

    if (name && surname && sex && age && address && phone) {
        await addOrUpdateFileCollection(USERS, fileName,{
            name: name,
            surname: surname,
            sex: sex,
            age: age,
            address: address,
            phone: phone,
        })
            .then((status) => {
                message = 'user has been created'
                success = status
                console.log(status)
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


// router.post('/delete', async (request, res) => {
//     const fileName = request.body.id
//
//     let message = 'doctor has been deleted'
//     let success = true;
//
//     try {
//         if (!fileName) {
//             throw new Error('fileName is not exist')
//         }
//
//         await deleteFileCollection(DOCTORS, fileName)
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


// router.get('/get-all', async (request, res) => {
//     let doctors = [];
//     let state = true;
//     await getAllFromCollection(DOCTORS)
//         .then((doctorsList) => {
//             doctors = doctorsList
//         })
//         .catch(() => {
//             state = false;
//         })
//
//     res.json({
//         doctors: doctors,
//         success: state
//     })
// })

module.exports = router;