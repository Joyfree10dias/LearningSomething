import dotenv from "dotenv";
import app from "./app.js";
dotenv.config({
    path:"./.env"
});
import connectDB from "./db/index.js";

// Connect to Database
connectDB()
.then(() => {
    app.listen(process.env.PORT || 3000,() => {
        console.log(`Server is running on port ${process.env.PORT}`);
    })
})
.catch((err) => console.log(err))