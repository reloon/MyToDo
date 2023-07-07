import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser';
import crud from './routes/crudRoute.js'
import indexRouter from './routes/indexRoute.js'
import expressLayouts from "express-ejs-layouts";
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
  await mongoose.connect(process.env.MONGO_URI).finally(console.log("connected"));
};

main().then(() => {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
})
