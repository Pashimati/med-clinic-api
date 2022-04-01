const express = require('express');
const router = express.Router();
const userService = require('../services/userService');


router.post("/signup", async (req, res) => {
    const { email, password } = req.body;
    // const email = 'Pashimatii@gmail.com'
    // const password = '123456789'
    try {
        const user = await userService.addUser(email, password);
        res.status(201).json(user);
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
});

router.get("/signin", async (req, res) => {
    // const { email, password } = req.body;
    const email = 'Pashimatii@gmail.com'
    const password = '123456789'
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

router.get("/signOut", async (req, res) => {
    // const { email, password } = req.body;
    const email = 'Pashimatii@gmail.com'
    const password = '123456789'
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

module.exports = router;