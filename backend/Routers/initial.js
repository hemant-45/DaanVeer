const express = require("express");
const Route = express.Router();
const Mongoosemodal = require("../Modals/schema");
const Joi = require("@hapi/joi");
const bcrypt = require("bcryptjs")

const user_schema = Joi.object({
    user_name: Joi.string().required().min(6),
    user_email: Joi.string().required().min(6).email(),
    user_password: Joi.string().required().min(6),
})

Route.post("/register",async (req,res)=>{
    const {user_name,user_email,user_password} = req.body;
    const validation = user_schema.validate(req.body)

    if(validation.error){
        res.send(validation.error.details[0].message)
    }
    else{
        const email_duplicate = await Mongoosemodal.findOne({user_email:user_email});
        if(email_duplicate){
            res.send("email already exist")
                }
        else{
            
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(user_password,salt);
            
            const new_user = new Mongoosemodal({
                user_name,
                user_email,
                user_password:hash
            })
            try{
                   const savepost = await new_user.save();
                   res.send(savepost._id)
            }catch(error){
                console.log(error)
            }
        }
        
    }
    
})

module.exports = Route;