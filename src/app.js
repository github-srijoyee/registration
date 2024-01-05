require('dotenv').config();
const express=require("express");
const path=require("path");
require("./db/conn");
const Register=require("./models/registers");
//const studentRouter=require("./routers/student")
const app=express();
const hbs=require("hbs");
const bcrypt=require("bcryptjs");

const port=process.env.PORT||3002;

const static_path=path.join(__dirname,"../public");
const template_path=path.join(__dirname,"../templates/views");
const partials_path=path.join(__dirname,"../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.set("view engine","hbs");
app.set("views",template_path);
hbs.registerPartials(partials_path);

//app.use(studentRouter);

console.log(process.env.SECRET_KEY);

app.get("/",(req,res)=>{
    res.render("index")
})
app.get("/register",(req,res)=>{
    res.render("register");
})
app.get("/login",(req,res)=>{
    res.render("login");
})
//create a new user in our database
app.post("/register",async (req,res)=>{
    try{
const password=req.body.password;
const cpassword=req.body.confirmpassword;

if(password===cpassword){
const registerEmployee=new Register({
    firstname:req.body.firstname,
    lastname:req.body.lastname,
    email:req.body.email,
    gender:req.body.gender,
    phone:req.body.phone,
    password:password,
    confirmpassword:cpassword
})
console.log("the success part"+registerEmployee);

//password hash
const token=await registerEmployee.generateAuthToken();
console.log("the token part"+token);
const registered=await registerEmployee.save();
console.log("the page part"+registered);

res.status(201).render("account");
}else{
    res.send("password not matched");
}
    }catch(error){
        res.status(400).send(error);
    }
})

//login check
app.post("/login",async (req,res)=>{
   try{
const email=req.body.email;
const password=req.body.password;

const useremail=await Register.findOne({email:email});

const isMatch=await bcrypt.compare(password,useremail.password);

const token=await useremail.generateAuthToken();
console.log("the token part"+token);

if(isMatch){
    res.status(201).render("account");
}
else{
    res.send("Wrong Log in credentials");
}
   }catch(error){
    res.status(400).send("Wrong Log in credentials")
   }
})
/*const jwt=require("jsonwebtoken");

const createToken=async()=>{
   const token=jwt.sign({_id:"6597b6ca92d7b528f0059c8d"},"mynameissrijoyeebhanjaandiamabtechstudent",{
    expiresIn:"2 seconds"
   });
   console.log(token);

   const userVer=await jwt.verify(token,"mynameissrijoyeebhanjaandiamabtechstudent");
   console.log(userVer);
}
createToken();*/
app.listen(port,()=>{
    console.log(`connection is set up at ${port}`);
})