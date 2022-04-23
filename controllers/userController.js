const express = require('express');
const { firebaseAdmin } = require("../services/firebase-service");
const { checkIfAdmin } = require("../middlewares/auth-middleware");
const router = express.Router();
const { addOrUpdateFileCollection, deleteFileCollection, getFileCollection, getAllFromCollection } = require('./../db/db')
const { USERS } = require('./../db/tables')

router.get('/get/:id', async (request, res) => {
    const fileName = request.params.id
    let status = true;
    const user = await getFileCollection(USERS, fileName);

    if (!user) {
        status = false;
    }

    res.json({
        user: user,
        success: status
    })
})

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
    console.log(fileName)
    if (name && surname && sex && age && address && phone && fileName) {
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
            })
    }

    res.json({
        success: success,
        message: message,
    })
})


router.post('/admin/add', checkIfAdmin, async (request, res) => {
    const password = request.body.data.password
    const email = request.body.data.email
    const name = request.body.data.name
    const surname = request.body.data.surname
    const sex = request.body.data.sex
    const age = request.body.data.age
    const address = request.body.data.address
    const phone = request.body.data.phone

    let message = 'user has not been created'
    let success = false;

    const user = await firebaseAdmin.auth().createUser({
        email,
        password,
    });

    const uid = user.uid
    firebaseAdmin.auth()
        .setCustomUserClaims(uid, { user: true })
        .then(() => {
            // The new custom claims will propagate to the user's ID token the
            // next time a new one is issued.
        });

    if (name && surname && sex && age && address && phone) {
        await addOrUpdateFileCollection(USERS, uid,{
            userUid: uid,
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
            })
    }

    res.json({
        success: success,
        message: message,
    })
})




router.post('/update', async (request, res) => {
    const fileName = request.body.data.fileName
    const name = request.body.data.name
    const surname = request.body.data.surname
    const sex = request.body.data.sex
    const age = request.body.data.age
    const address = request.body.data.address
    const phone = request.body.data.phone

    let message = 'user has not been created'
    let success = false;

    if (fileName && name && surname && sex && age && address && phone) {
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
            })
    }

    res.json({
        success: success,
        message: message,
    })
})



router.post('/admin/delete', checkIfAdmin, async (request, res) => {
    const fileName = request.body.id

    let message = 'user has been deleted'
    let success = true;

    try {
        if (!fileName) {
            throw new Error('fileName is not exist')
        }

        await deleteFileCollection(USERS, fileName)
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


router.get('/admin/get-all', checkIfAdmin, async (request, res) => {
    let users = [];
    let state = true;
    await getAllFromCollection(USERS)
        .then((usersList) => {
            users = usersList
        })
        .catch(() => {
            state = false;
        })

    res.json({
        users: users,
        success: state
    })
})

module.exports = router;