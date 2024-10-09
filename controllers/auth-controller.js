const prisma = require("../config/prisma")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const createError = require("../utils/createError")



module.exports.register = async (req,res,next) => {
    try {
        //1 validate req.body ** joi
        const {email,password,confirmPassword} = req.input 
        

        //2 is there this email in db ?
        const user = await prisma.user.findFirst({
            where : {
                email
            },
        });

        if(user) {
            return createError(400,"email is already exist")
        }

        //3 Encrypt password with bcryptjs
        const hashedPassword = await bcrypt.hash(password,10);
        

        //4 register success
        const newUser = await prisma.user.create({
            data : {
                email : email,
                password : hashedPassword,
            },
        });
        res.json({message : "register successfully"})

    } catch (err) {
        next(err)
    }

}


module.exports.login = async (req,res,next) => {
    try {
        //1 vilidate req.body
        const {email,password} = req.input

        //2 is there user in db ?
        const user = await prisma.user.findFirst({
            where : {
                email
            }
        })

        if(!user) {
            return createError(400,"Email or Password is Invalid")
        }

        //3 check password match

        const isPasswordMatch = await bcrypt.compare(password,user.password)

        if(!isPasswordMatch) {
            return createError(400,"Email or Password is Invalid!")
        }

        //4 create payload
        const payload = {
            user : {
                id : user.id,
                email : user.email,
                role : user.role
            },
        };

        console.log(payload)

        //5 generate token
        const genToken = jwt.sign(payload,process.env.SECRET,{ expiresIn : "1d" });


        //6 send to front-end
        res.json({
            user : payload,
            token : genToken
        });

    } catch (err) {
        console.log(err)
        next(err)
    }
}