import {connect, disconnect} from 'mongoose'

async function connectDB() {
    try{
        await connect(process.env.MONGODB_URL)
    } catch(err) {
        console.log("cannot connect to MongoDB")
        throw new Error("Cannot connect to Mongo DB ")
    }
}

async function disconnectDB() {
    try {
        await disconnect()
    } catch(err) {
        console.log("Error in db: ", err);
        throw new Error("Could not disconnect from MongoDB")
    }
}

export {connectDB, disconnectDB};