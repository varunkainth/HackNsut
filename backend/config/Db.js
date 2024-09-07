import mongoose from "mongoose"

const DataBaseConnection = async()=>{
    try{
        await mongoose.connect(process.env.DB_URI)
        console.log('Database connected')
    }
    catch(err){
        console.log("DataBase Connection Error",err)
    }
}

export default DataBaseConnection