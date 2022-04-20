const express = require('express');
const router = express.Router();
const { firebaseAdmin } = require('../services/firebase-service');


router.get("/get-role", async (req, res) => {
    let role = 'USER'
    try {
        let authToken = null;
        if (
            req.headers.authorization &&
            req.headers.authorization.split(' ')[0] === 'Bearer'
        ) {
            authToken = req.headers.authorization.split(' ')[1];
        }
        const userInfo = await firebaseAdmin
            .auth()
            .verifyIdToken(authToken);

        if (userInfo.admin === true) {
            role = 'ADMIN'
        } else if (userInfo.doctor === true) {
            role = 'DOCTOR'
        }
        res.status(200).json({role:role})
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
});

router.post("/signup", async (req, res) => {
    const { data } = req.body;
    const { email, password } = data;

    try {
        const user = await firebaseAdmin.auth().createUser({
            email,
            password,
        });

        res.status(201).json(user);
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
});

router.get("/signOut", async (req, res) => {
    try {
        await userService.signOut()
            .then((user) => {
                res.json(user);
            })
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
});

module.exports = router;