import express from "express";
import Task from '../models/taskModel.js'
import twilio from 'twilio'

const router = express.Router()
const accountSid = 'AC938c6d02017d8f7373115bd815a4400f';
const authToken = '69e1414836882adf8edb1811e6195828';
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