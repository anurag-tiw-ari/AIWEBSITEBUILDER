
import express from "express";
import promptRouter from "./routes/prompt.js";
import dotenv from "dotenv"
import imageRouter from "./routes/image.js";
import cors from "cors"
dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json())

app.use("/user",promptRouter)
app.use("/photo",imageRouter)

app.listen(3000,()=>{
    console.log("Server is listening at port 3000")
})