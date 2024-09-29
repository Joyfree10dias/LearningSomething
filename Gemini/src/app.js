import express from "express";

const app = express();

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "200kb" }));
app.use(express.static("public"));

// IMPORT ROUTES 
import geminiRouter from "./routes/gemini.route.js";

app.use("/api/v1/gemini", geminiRouter);

export default app;