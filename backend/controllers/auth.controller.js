import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndCookie from '../utils/generateToken.js';

export const signup = async(req, res) =>{
   try {
    const {fullName,username,password,confirmPassword,gender} = req.body;

    if(password !== confirmPassword){
        return res.status(400).json({error:"Password don't match"})
    }

    const user = await User.findOne({username});
    if(user){
        return res.status(400).json({error:"username already exists"})
     }

     // hashing the password 
     const salt = await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash(password,salt);

     const boyProfile = `https://avatar.iran.liara.run/public/boy?username=${username}`;
     const girlProfile = `https://avatar.iran.liara.run/public/girl?username=${username}`;

     const newUser = new User({
        fullName,
        username,
        password:hashedPassword,
        gender,
        profilePic: gender === "male" ? boyProfile : girlProfile
     })

     if(newUser){
         generateTokenAndCookie(newUser._id,res);
        await newUser.save();

     res.status(201).json({
        id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilePic: newUser.profilePic,
     });
     }else{
        res.status(400).json({error:"invalid user data"})
     }


   } catch (error) {
    console.log("Error in signin controller", error.message);
    res.status(500).json({ error:"internal server error"});
   }
}
export const login = async (req, res) =>{
    try{
    const {username, password } = req.body;
    const user = await User.findOne({username});
    const isPasswordCorrect = await bcrypt.compare(password, user?.password ||"");

    if(!user || !isPasswordCorrect){
        return res.status(400).json({error:" Inalid username or password"});
    }

    generateTokenAndCookie(user._id,res);

 res.status(201).json({
    id: user._id,
    fullName: user.fullName,
    username: user.username,
    profilePic: user.profilePic,
 });

    }catch(error){
        console.log("Error in login controller", error.message);
        res.status(500).json({ error:"internal server error"});
    }
}
export const logout = (req, res) =>{
    try{
    res.cookie("jwt","",{ maxAge:0});
    res.status(200).json({message:" Logged out successfully"});

    }catch(error){
        console.log("Error in logout controller", error.message);
        res.status(500).json({ error:"internal server error"});
    }
}