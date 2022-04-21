const express = require('express');
const router = express.Router();
const { addOrUpdateFileCollection, deleteFileCollection, getFileCollection, getAllFromCollection } = require('./../db/db')
const { SUBSCRIPTIONS } = require('./../db/tables')

// router.get('/get/:id', async (request, res) => {
//     const id = request.params.id
//     let status = true;
//     const user = await getFileCollection(USERS, id);
//
//     if (!user) {
//         status = false;
//     }
//
//     res.json({
//         user: user,
//         success: status
//     })
// })

router.post('/add', async (request, res) => {
    const email = "request.body.data.email"
    const date = "request.body.data.date"
    const uidUser = "request.body.data.uidUser"
    const uidDoctor = "request.body.data.uidDoctor"

    let message = 'subscription has not been created'
    let success = false;

    if ( email && date && uidUser && uidDoctor) {
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

// router.post('/update', async (request, res) => {
//     const fileName = request.body.data.fileName
//     const name = request.body.data.name
//     const surname = request.body.data.surname
//     const sex = request.body.data.sex
//     const age = request.body.data.age
//     const address = request.body.data.address
//     const phone = request.body.data.phone
//
//     let message = 'user has not been created'
//     let success = false;
//
//     if (fileName && name && surname && sex && age && address && phone) {
//         await addOrUpdateFileCollection(USERS, fileName,{
//             name: name,
//             surname: surname,
//             sex: sex,
//             age: age,
//             address: address,
//             phone: phone,
//         })
//             .then((status) => {
//                 message = 'user has been created'
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
//
//
// router.get('/get-all', async (request, res) => {
//     let users = [];
//     let state = true;
//     await getAllFromCollection(USERS)
//         .then((usersList) => {
//             users = usersList
//         })
//         .catch(() => {
//             state = false;
//         })
//
//     res.json({
//         users: users,
//         success: state
//     })
// })
//
module.exports = router