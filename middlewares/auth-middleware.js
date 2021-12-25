const jwt = require('jsonwebtoken');
const User = require('../schemas/users');
require('dotenv').config();

module.exports = (req, res, next) => {
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
    jwt.verify(tokenValue, process.env.SECRET_KEY,async(error,decoded) =>{
      if(error) {
        return res.status(401).send({
          errorMessage: "로그인 후 이용 가능한 기능입니다.",
        });
      }
    });
    const user = await User.findOne(
      {user_id: decoded.user_id},
    );
    if(!user) {
      return res.status(401).send({
        errorMessage: "존재하지 않는 회원입니다",
      });
    }
    req.user = user;
      next();
  } catch (err) {
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
  }
};