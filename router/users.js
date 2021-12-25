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
        const existsUsers = await User.findOne({user_id })


        console.log(user_id, password)
        // 영문자로 시작하는 영문자 또는 숫자 6~20자
        const regUserIdExp = /^[a-zA-z]+[a-zA-z0-9]{5,19}$/g
        // 영문자로 시작하는 영문자 또는 숫자 6~20자
        const regUserNickname = /^[가-힣]+$/
        // 8 ~ 16자 영문, 숫자, 특수문자를 최소 한가지씩 조합
        const regUserPasswordExp =/^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/

        if (user_id.search(regUserIdExp) == -1) {
            return res.status(401).send({
                errorMessage: 'ID 형식이 일치하지 않습니다.',
            })
        } else if (userNickname.search(regUserNickname == -1)){
            return res.status(401).send({
                errorMessage: '닉네임 형식이 일치하지 않습니다.',
            })
        }else if (password.search(regUserPasswordExp) == -1) {
            return res.status(400).send({
                errorMessage: '패스워드의 형식이 일치하지 않습니다.',
            })
        } else if (password.includes(userId)) {
            return res.status(400).send({
                errorMessage: '비밀번호에 아이디가 포함되어있습니다.',
            })
        } else if (password !== confirmPassword) {
            return res.status(400).send({
                errorMessage: '패스워드가 패스워드 확인란과 다릅니다.',
            })
        } else if (existsUsers) {
            return res.status(400).send({
                errorMessage: '아이디 또는 닉네임을 이미 사용중입니다.',
            })
        }
        const salt = bcrypt.genSaltSync(setRounds);
        const hashedPassword = bcrypt.hashSync(userPw, salt);

        const user = new User({ user_id:user_id, password:hashedPassword })
        await user.save()

        res.status(201).send({ result : "sucess"})
    } catch (err) {
        next(err)
    }
})

//로그인 API - POST
router.post('/signIn', async (req, res) => {
    const { userId, password } = req.body

    console.log('sign In', userId, password)

    const user = await User.findOne({ userId })

    //만약 user가 없거나
    //password가, 찾은 nickname의 password와 일치하지 않는다면
    //에러메세지를 보낸다
    if (!user || password !== user.password) {
        res.status(400).send({
            //일부러 error message를 모호하게 말해준다.
            errorMessage: '닉네임 또는 패스워드를 확인해주세요.',
        })
        return
    }
    //send token
    const token = jwt.sign({ userObjectId: user.userObjectId }, 'artube-secret-key')
    res.send({ token })
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