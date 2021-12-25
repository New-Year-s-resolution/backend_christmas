const express = require("express")
const router = express.Router()
const hash = require("object-hash")
const jwt = require("jsonwebtoken")
const User = require("../schemas/users")

router.post('/login', async (req, res) => {
    console.log(" login API")
    res.status(200).json({ "isCreated": true })
});

router.post('/signup', async (req, res) => {
    console.log(" signup API")

    const { email, name, institute } = req.body
    const isExist = await User.findOne({ email: email })
    if (isExist) {

        return res.status(400).send("email already registered")
    } else {

        await User.create({ name, email, password, institute })
        return res.status(201).send(" signup successful ")
    }
});

router.get("/test", (req, res) => {
    console.log("hi")
    res.status(201).send("test")
})



router.get('/', async function (req, res) {
    res.send("this is home")

});


module.exports = router