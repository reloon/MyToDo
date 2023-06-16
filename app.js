import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import bodyParser from 'body-parser';
import expressLayouts from "express-ejs-layouts";
import crud from './routes/crudRoute.js'
import indexRouter from './routes/indexRoute.js'
import twilio from 'twilio'
import Task from './models/taskModel.js'
import dotenv from 'dotenv'
import cron from 'node-cron'
dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.use(cors());
app.use(express.json())
app.use(expressLayouts);
app.use(bodyParser.urlencoded({extended: true,}));
app.use(express.static("public"));
app.use(crud)
app.use(indexRouter)

const main = async (req, res) => {
  await mongoose.connect(process.env.STRING_CONNECTION).finally(console.log("connected"));
};

mongoose.set("strictQuery", true);

main().catch((error) => console.log(error));

async function sendReminders() {
  try {
    const reminderList = await Task.find({});
    if (reminderList) {
      for (const reminder of reminderList) {
        if (!reminder.isReminded) {
          const now = new Date();
          if (new Date(reminder.deadLine) - now < 0) {
            await Task.findByIdAndUpdate(reminder._id, {
              isReminded: true,
            });

            const accountSid = process.env.ACCOUNT_SID;
            const authToken = process.env.AUTH_TOKEN;
            const client = twilio(accountSid, authToken);
            await client.messages.create({
              body: reminder.desc,
              from: "whatsapp:+14155238886",
              to: "whatsapp:+62895411963066",
            });
          }
        }
      }
    }
  } catch (error) {
    console.log("Error:", error);
  }

  setTimeout(sendReminders, 1000); // Call the function again after 1 second
}

sendReminders(); // Start the initial invocation


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});