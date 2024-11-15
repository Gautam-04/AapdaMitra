import mongoose from "mongoose";
import {SihDb} from '../backend/constants.js'

async function connectDb(){
try {
    const Connection = await mongoose.connect(`${process.env.MONGODB_URL}/${SihDb}`)
    console.log(`MongoDb is connected to the port: ${Connection.connection.host}`)
} catch (error) {
    console.log(`MongoDb cannot be connected`, error)
    process.exit(1)
}
}

export default connectDb;