const express = require("express")
const router = express.Router()


router.get("/test", (req, res) => {
    console.log("hi")
    res.status(201).send("test")
})



router.get('/', async function (req, res) {
    res.send("this is home")

});


module.exports = router