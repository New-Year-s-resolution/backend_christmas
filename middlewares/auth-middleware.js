const jwt = require('jsonwebtoken');
const User = require('../schemas/users');
require('dotenv').config();

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401).send({
      errorMessage: '로그인 후 사용하세요'
    })
  }

  const [tokenType, tokenValue] = authorization.split(' ');
  if (!tokenValue || tokenType !== 'Bearer') {
    res.status(401).send({
      errorMessage: '로그인 후 사용하세요',
    });
    return;
  }

  try {
    const { user_id } = jwt.verify(tokenValue, "2oindoi1ndih777");
    //console.log(jwt.verify(tokenValue, "2oindoi1ndih777"))

    User.findOne({ user_id: jwt.verify(tokenValue, "2oindoi1ndih777") }) // id 에서 user차저
      .exec()
      .then((user) => {
        res.locals.user = user;

        next();
      });

    // jwt.verify(tokenValue, "2oindoi1ndih777", async (error, decoded) => {
    //   if (error) {
    //     return res.status(401).send({
    //       errorMessage: "로그인 후 이용 가능한 기능입니다.",
    //     });
    //   }
    // });
    // const user = await User.findOne(
    //   { user_id: decoded.user_id },
    // );
    // if (!user) {
    //   return res.status(401).send({
    //     errorMessage: "존재하지 않는 회원입니다",
    //   });
    // }
    // req.user = user;
    // next();
  } catch (err) {
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
  }
};