import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import expressLayouts from "express-ejs-layouts";
import crud from './routes/crudRoute.js'
import indexRouter from './routes/indexRoute.js'
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
dotenv.config()


const app = express();
const PORT = 3000;

app.set("view engine", "ejs");

app.use(cors());
app.use(express.json())
app.use(expressLayouts);
app.use(bodyParser.urlencoded({extended: true,}));
app.use(express.static("public"));
app.use(crud)
app.use(indexRouter)

const main = async (req, res) => {
  await mongoose
    .connect("mongodb://relonpx:pohodeui123@ac-jjxtwfo-shard-00-00.0psqxhd.mongodb.net:27017,ac-jjxtwfo-shard-00-01.0psqxhd.mongodb.net:27017,ac-jjxtwfo-shard-00-02.0psqxhd.mongodb.net:27017/todotest?ssl=true&replicaSet=atlas-2rhk8n-shard-0&authSource=admin&retryWrites=true&w=majority").finally(console.log("connected"));
};

mongoose.set("strictQuery", true);

main().catch((error) => console.log(error));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});