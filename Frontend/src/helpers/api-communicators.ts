import axios from 'axios'


const loginUser = async (email:string, password: string) => {
    const res = await axios.post("/user/login", {email, password})
    if(res.status !== 200){
        throw new Error("Unable to Login");
    }
    const data= await res.data
    return data;
} 

const signupUser = async (name: string, email:string, password: string) => {
    const res = await axios.post("/user/signup", {name, email, password})
    if(res.status !== 201){
        throw new Error("Unable to signup");
    }
    const data= await res.data
    return data;
} 

const checkAuthStatus = async () => {
    const res = await axios.get("/user/auth-status")
    if(res.status !== 200){
        throw new Error("Unable to autheenticate");
    }
    const data= await res.data
    return data;
} 

const sendChatRequest = async (message: string) => {
    const res = await axios.post("/chat/new", {message})
    if(res.status !== 200){
        throw new Error("Unable to send chat");
    }
    const data= await res.data
    return data;
} 

const getUserChats = async () => {
    const res = await axios.get("/chat/all-chats")
    if(res.status !== 200){
        throw new Error("Unable to send chat");
    }
    const data= await res.data
    return data;
} 

const deleteUserChats = async () => {
    const res = await axios.delete("/chat/delete")
    if(res.status !== 200){
        throw new Error("Unable to delete chat");
    }
    const data= await res.data
    return data;
} 

const logoutUser = async () => {
    const res = await axios.get("/user/logout")
    if(res.status !== 200){
        throw new Error("Unable to delete chat");
    }
    const data= await res.data
    return data;
} 

export {loginUser, signupUser, checkAuthStatus, sendChatRequest, logoutUser, getUserChats, deleteUserChats}