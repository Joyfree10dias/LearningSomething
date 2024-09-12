import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// CONFIGURATIONS
app.use(cors({
    origin: "*",
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'device-remember-token', 'Access-Control-Allow-Origin', 'Origin', 'Accept']
}));
app.use(express.json({limit: "20kb"}));
app.use(express.urlencoded({extended: true, limit: "20kb"}));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
import userRouter from "./routes/user.routes.js";


// Routes Declaration
app.use("/api/v1/users", userRouter);

export default app;