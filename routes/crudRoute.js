import express from "express";
import Task from "../models/taskModel.js";
import twilio from "twilio";
import Pusher from "pusher";
import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = twilio(accountSid, authToken);

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

router.post("/message", async (req, res) => {
  const message = req.body.message;
  const pusher = new Pusher({
    appId: "1621933",
    key: "f64eba4bedbfc2d41f25",
    secret: "345149ccfad76e549cd1",
    cluster: "ap1",
    useTLS: true,
  });
  const configuration = new Configuration({ apiKey: process.env.API_KEY });
  const openai = new OpenAIApi(configuration);

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: message,
      temperature: 0,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 256,
    });

    const assistantMessage = completion.data.choices[0].text;
    const response = { text: assistantMessage };

    pusher.trigger("chatBot", "message", response);
    res.send(message);
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
    }
  }
});

export default router;
