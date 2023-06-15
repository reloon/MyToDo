import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import bodyParser from 'body-parser';
import expressLayouts from "express-ejs-layouts";
import crud from './routes/crudRoute.js'
import indexRouter from './routes/indexRoute.js'
import twilio from 'twilio'
import Task from './models/taskModel.js'

const app = express();
const port = 3001;

app.set("view engine", "ejs");

app.use(cors());
app.use(express.json())
app.use(expressLayouts);
app.use(bodyParser.urlencoded({extended: true,}));
app.use(express.static("public"));
app.use(crud)
app.use(indexRouter)

const main = async (req, res) => {
  await mongoose.connect("mongodb://relonpx:pohodeui123@ac-jjxtwfo-shard-00-00.0psqxhd.mongodb.net:27017,ac-jjxtwfo-shard-00-01.0psqxhd.mongodb.net:27017,ac-jjxtwfo-shard-00-02.0psqxhd.mongodb.net:27017/todotest?ssl=true&replicaSet=atlas-2rhk8n-shard-0&authSource=admin&retryWrites=true&w=majority").finally(console.log("connected"));
};

mongoose.set("strictQuery", true);

main().catch((error) => console.log(error));

setInterval(async () => {
  try {
    const reminderList = await Task.find({}).exec();
    if (reminderList) {
      for (const reminder of reminderList) {
        if (!reminder.isReminded) {
          const now = new Date()
          if (new Date(reminder.deadLine) - now < 0) {
            await Task.findByIdAndUpdate(reminder._id, {
              isReminded: true,
            }).exec();
            const accountSid = 'AC938c6d02017d8f7373115bd815a4400f';
            const authToken = "5b3af9f3bd9dee43e6fcddd92364aadd";
            const client = twilio(accountSid, authToken);
            await client.messages.create({
              body: reminder.desc,
              from: "whatsapp:+14155238886",
              to: "whatsapp:+62895411963066"
            });
          }
        }
      }
    }
  } catch (error) {
    console.log("Error:", error);
  }
}, 1000);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});