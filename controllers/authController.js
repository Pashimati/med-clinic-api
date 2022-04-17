const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const { firebaseAdmin } = require('../services/firebase-service');

router.post("/signin", async (req, res) => {
    const { email, password } = req.body.data;
    console.log(email, password)
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

module.exports = router;