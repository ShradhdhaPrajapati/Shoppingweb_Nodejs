const express = require("express")
const router = express.Router()
const User = require("../model/users")
const auth = require("../middleware/auth")
const bcrypt = require("bcryptjs")
const Admin = require("../model/admin")
const jwt = require("jsonwebtoken")
const aauth = require("../middleware/aauth")
const category = require("../model/categories")
const product = require("../model/products")

router.get("/admin",(req,resp)=>{
    resp.render("adminlogin")
})

router.get("/dashboard",aauth,(req,resp)=>{
    resp.render("dashboard")
})

router.post("/adminlogin",async(req,resp)=>{

    const username = req.body.username
    const password = req.body.password

    try {
        
        const data = await Admin.findOne({username:username})    


        if(password==data.password)
        {
            
            const token = await jwt.sign({_id:data._id},process.env.A_key)
            resp.cookie("ajwt",token)
            resp.redirect("dashboard")
        }
        else{
            resp.render("adminlogin",{"msg":"Invalid credentials"})
        }


    } catch (error) {
        console.log(error);
        resp.render("adminlogin",{"msg":"Invalid credentials"})
    }
})


router.get("/adminlogout",aauth,async(req,resp)=>{
     
  
    resp.clearCookie("ajwt")
    resp.redirect("admin")
})


//category section start

router.get("/category",aauth,async(req,resp)=>{
    try {
        const categories = await category.find();
        resp.render("category",{"categories": categories})
    } catch (error) {
        
    }
})

router.post("/addcategory",aauth,async(req,resp)=>{
    try {
        const cat = new category(req.body)
        await cat.save();
        resp.redirect("category")
    } catch (error) {
        
    }
})

router.get("/deletecategory",aauth,async(req,resp)=>{
    try {

        const _id = req.query.id;
        await category.findByIdAndDelete(_id);
        resp.redirect("category");
    } catch (error) {
        
    }
})
router.post("/addcategory",aauth,async(req,resp)=>{
    try {
        const cat = new category(req.body)
        await cat.save();
        resp.redirect("category")
    } catch (error) {
        
    }
})


//category section end




//product section start

router.get("/product",aauth,async(req,resp)=>{
    try {
        resp.render("product")
    } catch (error) {
        
    }
})


//product section end


//order section start

router.get("/order",aauth,async(req,resp)=>{
    try {
        resp.render("order")
    } catch (error) {
        
    }
})


//order section end


//users section start

router.get("/user",aauth,async(req,resp)=>{
    try {
        resp.render("user")
    } catch (error) {
        
    }
})


//user section end



module.exports = router