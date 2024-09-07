import admin from "firebase-admin";
import FirebaseServiceCred from "./config/FireBase_Cred.js";
import DataBaseConnection from "./config/Db.js";
import app from "./app.js";
import "dotenv/config"

const port = process.env.PORT


  try {
    DataBaseConnection();


    try {
        console.log("Initializing Firebase Admin...");
        admin.initializeApp({
          credential: admin.credential.cert(FirebaseServiceCred),
        });
        console.log("Firebase Admin initialized successfully");
      } catch (error) {
        console.error("Error initializing Firebase Admin:", error);
        throw error;
      }

      app.listen(port,async()=>{
        console.log(`Server is running on port ${port}`)
      })

  } catch (error) {
    console.log("Index File Error",error)
  }