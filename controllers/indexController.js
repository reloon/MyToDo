import Task from "../models/taskModel.js"
import { Configuration, OpenAIApi } from "openai";

export const home = async (req, res) => {
  try {
    const task = await Task.find()
    const count = await Task.countDocuments()

    res.render('home', {
      title: 'MyToDo',
      layout: 'layouts/main-layout',
      data: task,
      total: count
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const addTask = (req, res) => {
  res.render("addTask", {
    title: "Add Task",
    layout: "layouts/main-layout",
  });
};

export const allTask = async (req, res) => {
  try {
    const task = await Task.find();

    res.render("allTask", {
      title: "All Task",
      layout: "layouts/main-layout",
      data: task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// export const chat = async (req, res) => {
//   const configuration = new Configuration({ apiKey: "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" });
//   const openai = new OpenAIApi(configuration);
//   const ask = req.body.ask;
//   console.log(ask);
//   try {
//     const completion = await openai.createCompletion({
//       model: "text-davinci-003",
//       prompt: ask,
//       max_tokens: 236,
//       stop: ["Human:", "AI:", "Human:", "AI:"],
//     });

//     res.render("chatBot", {
//       title: "Chat Bot",
//       layout: "layouts/main-layout",
//       data: completion.data.choices[0].text,
//     });
//   } catch (error) {
//     if (error.response) {
//       console.error(error.response.status, error.response.data);
//       res.status(error.response.status).json(error.response.data);
//     } else {
//       console.error(`Error with OpenAI API request: ${error.message}`);
//       res.status(500).json({
//         error: {
//           message: "An error occurred during your request.",
//         },
//       });
//     }
//   }
// };

export const chat = (req, res) => {
  res.render("chatBot", {
    title: "Add Task",
    layout: "layouts/main-layout",
    data:''
  });
};

export default (home, addTask, allTask, chat)