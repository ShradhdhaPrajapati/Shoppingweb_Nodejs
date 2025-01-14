const express = require("express")
const router = express.Router()
const User = require("../model/users")
const auth = require("../middleware/auth")
const bcrypt = require("bcryptjs")

router.get("/",(req,resp)=>{
    resp.redirect("index")
})

router.get("/index",(req,resp)=>{
    resp.render("index")
})


router.get("/contact",(req,resp)=>{
    resp.render("contact")
})

router.get("/detail",(req,resp)=>{
    resp.render("detail")
})

router.get("/shop",(req,resp)=>{
    resp.render("shop")
})

router.get("/cart",auth,(req,resp)=>{
    resp.render("cart")
})

router.get("/login",(req,resp)=>{
    resp.render("login")
})


router.get("/reg",(req,resp)=>{
    resp.render("reg")
})

router.get("/logout",auth,async(req,resp)=>{
     
    var user = req.user
    var token = req.token
    user.Tokens = user.Tokens.filter(ele=>{
        return ele.token !=token
    })

    await user.save()

    resp.clearCookie("jwt")
    resp.render("login")
})

router.post("/userreg",async(req,resp)=>{
    try {
       const user = new User(req.body)
       const dt = await user.save()

       resp.render("reg",{"msg":"registration successfully !!!"})
    } catch (error) {
        console.log(error);
    }
})


router.post("/userlogin",async (req,resp)=>{

    const email = req.body.email
    const password = req.body.pass

    try {
        
        const data = await User.findOne({email:email})    


        const isValid =  await bcrypt.compare(password,data.pass)
        if(isValid)
        {
            
            const token = await data.generateToken()
            resp.cookie("jwt",token)
            resp.redirect("index")
        }
        else{
            resp.render("login",{"msg":"Invalid credentials"})
        }


    } catch (error) {
        console.log(error);
        resp.render("login",{"msg":"Invalid credentials"})
    }

})




module.exports=router