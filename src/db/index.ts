import mongoose from "mongoose"


const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string, {
            dbName: "CHAT"
        })
        console.log("☑️  MongoDB Connection Established Successfully!!")

    } catch (error) {
        console.log(`MongoDB Connection Error: ${error}`)
        process.exit(1)
    }
}


export default connectToDB