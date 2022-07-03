import http from "http"
import express, {raw} from "express";

import cors from "cors";
import morgan from "morgan";

import c from "./console"
c()

import routes from "./routes"
import {socketInitiate} from "./socket";

import dotenv from "dotenv";

dotenv.config();

import dbConnect from "./database";
import saveLog from "./logger/saveLog";
import mongoose from "mongoose";


// let c = ['debug', 'log', 'warn', 'error']
// c.forEach((methodName) => {
//   const originalLoggingMethod = console[methodName];
//   console[methodName] = (firstArgument, ...otherArguments) => {
//     const originalPrepareStackTrace = Error.prepareStackTrace;
//     Error.prepareStackTrace = (_, stack) => stack;
//     const callee: any = new Error().stack[1];
//     Error.prepareStackTrace = originalPrepareStackTrace;
//     const relativeFileName = path.relative(process.cwd(), callee.getFileName());
//     const prefix = `${relativeFileName}:${callee.getLineNumber()}:`;
//     if (typeof firstArgument === 'string') {
//       originalLoggingMethod(prefix + ' ' + firstArgument, ...otherArguments);
//     } else {
//       originalLoggingMethod(prefix, firstArgument, ...otherArguments);
//     }
//   };
// });


const app = express()

app.use(express.json())
// app.use(morgan("dev"))

app.use("/static/", express.static("src/static"))

// pass handle into express application
const httpServer = http.createServer(app)


app.use(cors({
  origin: (origin, callback)=>{
    callback(null, true)
  }
}))



// app.use((req, res, next)=>{
//   res.setHeader("Access-Control-Allow-Origin", "*")
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
//   next()
// })

socketInitiate(httpServer, app)

routes(app)


app.use((req, res, err)=>{
  // @ts-ignore
  res.status(500).json({message: err.message ? err.message : "Internal error"})
})


mongoose.connect(process.env.NODE_ENV === "development"
  ? "mongodb://127.0.0.1:27017/dating-web"
  : process.env.MONGODB_CONNECTION
).then(r=>{
    console.log("mongoose connected..")
  })
  .catch(ex=>{
    console.log(ex)
  })


const PORT = process.env.PORT || 1001

httpServer.listen(PORT, ()=> console.log(`server is running on port ${PORT}`) )
