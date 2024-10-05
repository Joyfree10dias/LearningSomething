import dotenv from "dotenv";
import app from "./app.js";
dotenv.config({
    path: "./.env"
});

// Listen 
app.listen(process.env.PORT, () => {
    console.log(`App is listening on port: ${process.env.PORT}`);
});