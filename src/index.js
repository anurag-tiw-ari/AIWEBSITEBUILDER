
import express from "express";
import promptRouter from "./routes/prompt.js";
import dotenv from "dotenv"
import imageRouter from "./routes/image.js";
import cors from "cors"
dotenv.config();
import path from "path"


const __dirname = path.resolve()

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

app.use(express.static(path.join(__dirname,"/frontendp","dist")))

app.get("/*splat",(_,res)=>{
     res.sendFile(path.resolve(__dirname,"frontendp","dist","index.html"))
})

app.listen(3000,()=>{
    console.log("Server is listening at port 3000")
})