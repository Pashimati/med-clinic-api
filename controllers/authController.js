const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const {firebaseAdmin} = require('../services/firebase-service');

router.post("/signin", async (req, res) => {
    const { email, password } = req.body.data;
    try {
        await userService.authenticate(email, password)
            .then((user) => {
                if (!user) {
                    throw new Error('user not found')
                }

                res.json(user);
            })
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

const getAuthToken = (req, res, next) => {
    if (
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
        req.authToken = req.headers.authorization.split(' ')[1];
    } else {
        req.authToken = null;
    }
    next();
};


const checkIfAuthenticated = (req, res, next) => {
    getAuthToken(req, res, async () => {
        try {
            const { authToken } = req;
            const userInfo = await firebaseAdmin
                .auth()
                .verifyIdToken(authToken);
            req.authId = userInfo.uid;
            return next();
        } catch (e) {
            return res
                .status(401)
                .send({ error: 'You are not authorized to make this request' });
        }
    });
};

module.exports = router;