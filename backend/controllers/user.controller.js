import User from "../models/user.model.js";
export const getUserForsidebar = async(req,res)=>{
    try {

        const loggedInUser = req.user._id;

        const alluser = await User.find().select("-password");

        res.status(200).json(alluser);
        
    } catch (error) {
        console.log("Error in the getUserForsidebar controller",error.message);
        res.status(500).json({error:"Internal server error"})
        
    }
}