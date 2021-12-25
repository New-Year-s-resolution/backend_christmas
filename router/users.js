const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../schemas/users')
const bcrypt = require('bcrypt');
const setRounds = 10;
// const authMiddleware = require('../middlewares/auth-middleware')

// 회원가입 API - POST
router.post('/signUp', async (req, res, next) => {
    try {
        const { user_id, userNickname, password, confirmPassword } = req.body
        const existsUsers = await User.findOne({ user_id })

        // 영문자로 시작하는 영문자 또는 숫자 6~20자
        const regUserIdExp = /^[a-zA-z]+[a-zA-z0-9]{5,19}$/g
        // 영문자로 시작하는 영문자 또는 숫자 6~20자
        const regUserNickname = /^[a-zA-z]+[a-zA-z0-9]{5,19}$/g
        // 
        const regUserPasswordExp = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/

        if (user_id.search(regUserIdExp) == -1) {
            return res.status(401).send({
                errorMessage: 'ID 형식이 일치하지 않습니다.',
            })
        } else if (userNickname.search(regUserNickname) == -1) {
            return res.status(401).send({
                errorMessage: '닉네임 형식이 일치하지 않습니다.',
            })
        } else { }
        const salt = bcrypt.genSaltSync(setRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const user = new User({ user_id: user_id, password: hashedPassword })
        await user.save()

        res.status(201).send({ result: "sucess" })
    } catch (err) {
        next(err)
    }
})

//로그인 API - POST
router.post('/signIn', async (req, res) => {
    try {
        const { user_id, password } = req.body

        const user = await User.findOne({ user_id })
        console.log('user===', user);

        //만약 user가 없거나
        //password가, 찾은 nickname의 password와 일치하지 않는다면
        //에러메세지를 보낸다
        if (!user) {
            res.status(400).send({
                sucess: false,
                //일부러 error message를 모호하게 말해준다.
                errorMessage: '닉네임 또는 패스워드를 확인해주세요.',
            })
            if (!bcrypt.compareSync(password, user.password)) {
                return res.status(401).send({
                    success: false,
                    msg: '아이디 또는 패스워드를 확인해주세요.',
                });
            }

        } else {
            //console.log("Test")
            const user_id = user['user_id'];
            const userNickname = user['userNickname'];

            const token = jwt.sign(user_id, "2oindoi1ndih777");
            res.status(201).send({
                sucess: true,
                token,
                user_id,
                userNickname,
                msg: "성공적으로 로그인 되었습니다"
            })
        }
    } catch (err) {
        // 예측하지 못한 에러 발생(Internal Server Error)
        console.log('로그인 API에서 발생한 에러: ', err);
        res
            .status(500).send({
                sucess: false,
                //일부러 error message를 모호하게 말해준다.
                errorMessage: '예상치 못한 에러가 발생했습니다.',
            })
    }
})

// router.get("/me", authMiddleware, async (req, res) => {
//     const { user } = res.locals;
//     res.send({
//       user,
//     });
// });


// router.post('/login', async (req, res) => {
//     console.log(" login API")
//     res.status(200).json({ "isCreated": true })
// });

// router.post('/signup', async (req, res) => {
//     console.log(" signup API")

//     const { email, name, institute } = req.body
//     const isExist = await User.findOne({ email: email })
//     if (isExist) {

//         return res.status(400).send("email already registered")
//     } else {

//         await User.create({ name, email, password, institute })
//         return res.status(201).send(" signup successful ")
//     }
// });

module.exports = router