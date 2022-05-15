const express = require('express');
const { firebaseAdmin } = require("../services/firebase-service");
const { checkIfAdmin, checkIfAuthenticated } = require("../middlewares/auth-middleware");
const router = express.Router();
const { addOrUpdateFileCollection, deleteFileCollection, getFileCollection, getAllFromCollection } = require('./../db/db')
const { USERS } = require('./../db/tables')

router.get('/get/:id', checkIfAuthenticated, async (request, res) => {
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

router.post('/add', checkIfAuthenticated, async (request, res) => {
    const password = request.body.password
    const email = request.body.email
    const name = request.body.name
    const surname = request.body.surname
    const sex = request.body.sex
    const age = request.body.age
    const address = request.body.address
    const phone = request.body.phone

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


router.post('/update', checkIfAuthenticated, async (request, res) => {
    const fileName = request.body.id
    const name = request.body.name
    const surname = request.body.surname
    const sex = request.body.sex
    const age = request.body.age
    const address = request.body.address
    const phone = request.body.phone

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

router.delete('/delete/:id', checkIfAdmin, async (request, res) => {
    const fileName = request.params.id

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


router.get('/get-all', checkIfAdmin, async (request, res) => {
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