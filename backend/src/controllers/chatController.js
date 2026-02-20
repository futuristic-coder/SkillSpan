import { chatClient } from "../config/stream.js";

export async function getStreamToken(req,res){
    try{
        //use clerkId from req.user to generate Stream token
        const token=chatClient.createToken(req.user.clerkId)
        res.status(200).json({
            token,
            userId:req.user.clerkId,
            userName:req.user.name,
            userImage:req.user.image
        })
    }catch(error){
        console.error("Error generating Stream token:", error);
        res.status(500).json({message:"Internal server error"})
    }
}
