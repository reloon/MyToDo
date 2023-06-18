import express from "express";
import Task from '../models/taskModel.js'
import twilio from 'twilio'
import dotenv from "dotenv";
dotenv.config();

const router = express.Router()
const accountSid = process.env.ACCOUNT_SID
const authToken = process.env.AUTH_TOKEN
const client = twilio(accountSid, authToken)

router.post("/add", (req, res) => {
  const { task, desc, deadline } = req.body;

  const taskData = {
    task: task,
    desc: desc,
    deadLine: deadline,
  };

  const tasks = new Task(taskData);

  tasks
    .save()
    .then(() => {
      console.log("Task added:", taskData);
      res.redirect("/");
    })
    .catch((error) => {
      console.log("Error saving task:", error);
      res.status(500).send("Error saving task.");
    });

  const twilioMessage = `Hello Reloon, there is a new ${task} assignment => *${desc}*.
Must be collected before ${deadline}`;
  client.messages
    .create({
      body: twilioMessage,
      from: "whatsapp:+14155238886",
      to: "whatsapp:+62895411963066",
    })
    .then((message) => console.log("Twilio message sent:", message.sid))
    .catch((error) => console.log("Error sending Twilio message:", error));
});


router.get("/delete/:id", (req, res) => {
  const id = req.params.id;
  Task.deleteOne({ _id: id })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      res.json({ message: "error" });
    });
});


export default router