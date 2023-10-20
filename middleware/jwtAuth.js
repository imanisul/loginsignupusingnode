const JWT = require('jsonwebtoken');

const jwtAuth = (req, res, next) =>{
    const token = (req.cookies && req.cookies.token) || null;
   
    if(!token) {
        return res.status(400).json({
            success: false,
            message: 'Invalid token'

        })
    }

    try {
        const payload = JWT.verify(token, process.env.SECERT);  
        req.user  = {id: payload.id, email: payload.email};
    } catch (error) {
        return res(400).json({
            success: false,
            message: error.message
        })
    }


    next();


}

module.exports = jwtAuth;