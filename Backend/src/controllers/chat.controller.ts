import { Request, NextFunction, Response } from "express";
import User from "../models/User.js";
import { configureOpenAI } from "../config/openai-config.js";
import { OpenAIApi, ChatCompletionRequestMessage } from 'openai';

const MAX_CHAT_HISTORY = 10; // Limit the chat history to prevent exceeding token limits.

const generateChatCompletion = async (req: Request, res: Response, next: NextFunction) => {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
        return res.status(400).json({ message: "Invalid or empty message provided." });
    }

    try {
        // Find the user from the database
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).json("User not registered or Token malfunctioned");
        }

        // Prepare chat history for OpenAI
        const chats = user.chats.map(({ role, content }) =>
            ({ role, content }) as ChatCompletionRequestMessage
        );

        // Add the new user message
        chats.push({ content: message, role: "user" });

        // Limit chat history to the last MAX_CHAT_HISTORY messages
        const trimmedChats = chats.slice(-MAX_CHAT_HISTORY);

        // Add the new message to the database
        user.chats.push({ content: message, role: "user" });

        // Configure OpenAI and send the request
        const config = configureOpenAI();
        const openai = new OpenAIApi(config);

        let retryCount = 0;
        const MAX_RETRIES = 3;

        let chatResponse;
        while (retryCount < MAX_RETRIES) {
            try {
                chatResponse = await openai.createChatCompletion({
                    model: "gpt-3.5-turbo",
                    messages: trimmedChats,
                });
                break; // Exit the loop if the request succeeds
            } catch (error: any) {
                if (error.response && error.response.status === 429) {
                    // Handle rate limit error
                    const retryAfter = error.response.headers['retry-after'] || 1; // Retry-After header
                    console.warn(`Rate limited. Retrying after ${retryAfter} seconds...`);
                    await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
                    retryCount++;
                } else {
                    throw error; // Throw other errors
                }
            }
        }

        if (!chatResponse) {
            return res.status(429).json({ message: "Too many requests. Please try again later." });
        }

        // Add OpenAI's response to the database
        const botMessage = chatResponse.data.choices[0].message;
        user.chats.push(botMessage);

        // Save the updated chat history to the database
        await user.save();

        return res.status(200).json({ chats: user.chats });
    } catch (error) {
        console.error("Error in generateChatCompletion:", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

const sendChatsToUser = async (req: Request, res: Response, next: NextFunction) => {
    // user token check
    try{
        const user = await User.findById(res.locals.jwtData.id)
        if(!user){
            return res.status(401).send("user not registered OR token malfunctioned")
        }
        if(user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match")
        } 
        
        return res.status(200).json({message: "Ook", chats: user.chats });
       
    } catch (err) {
        console.log("error in chat-controller : ",err)
        res.status(404).json({message: "Error in User Controller", cause: err.message})
    }
}

const deleteChats = async (req: Request, res: Response, next: NextFunction) => {
    // user token check
    try{
        const user = await User.findById(res.locals.jwtData.id)
        if(!user){
            return res.status(401).send("user not registered OR token malfunctioned")
        }
        if(user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match")
        } 
        //@ts-ignore
        user.chats = [];
        await user.save();
        
        return res.status(200).json({message: "Ook" });
       
    } catch (err) {
        console.log(err)
        res.status(404).json({message: "Error in User Controller", cause: err.message})
    }
}


export { generateChatCompletion, sendChatsToUser, deleteChats };
