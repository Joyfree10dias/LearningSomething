import express from "express";
import cors from "cors";

const app = express();

// CONFIGURATION
app.use(express.json({limit: "50kb"}));
app.use(express.urlencoded({extended: true, limit: "50kb"}));
app.use(express.static("public"));
app.use(cors());

// IMPORT ROUTES 
import testRouter from "./routes/test.route.js";

// ROUTES DECLARATION
app.use("/api/v1/test", testRouter);


export default app;