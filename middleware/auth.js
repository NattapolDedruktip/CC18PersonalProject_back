const jwt = require("jsonwebtoken");
const createError = require("../utils/createError");

exports.auth = (req,res,next) => {
    try {
        
        //step 1 check header
        const authHeader = req.headers.authorization;

        if(!authHeader) {
            return createError(401,"TOKEN is missing!")
        }

        const token = authHeader.split(" ")[1]

        console.log(token)

        //step 2 decode payload

        jwt.verify(token,process.env.SECRET,(err,decode)=>{

            if(err) {
                return createError(401,"TOKEN invalid")
            }

            //step 3 next

            req.user = decode
            next()
        })

    } catch (err) {
        next(err)
    }
}