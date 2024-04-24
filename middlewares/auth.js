const jwt = require('jsonwebtoken')
require('dotenv').config()
const User = require('../models/User')

//auth
exports.auht = async (req,res,next) =>{
    try {
        //extract token
        const token = req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer ","")

        //if token missing,then return response
        if(!token){
            return res.status(401).json({
                success:false,
                message:'Token is missing',
            })
        }

        //verify the token
        try {
            const decode = await jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.body.user = decode
        } catch (error) {
            //verification - issue
            return res.status(401).json({
                success:false,
                message:'token is invalid',
            })
        }

    } catch (error) {
        
    }
}

//isStudent

//isInstructor


//isAdmin