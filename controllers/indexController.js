import Task from "../models/taskModel.js";

export const home = async (req, res) => {
  try {
    const task = await Task.find();
    const count = await Task.countDocuments();

    res.render("home", {
      title: "MyToDo",
      layout: "layouts/main-layout",
      data: task,
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addTask = (req, res) => {
  res.render("addTask", {
    title: "MyToDo | Add Task",
    layout: "layouts/main-layout",
  });
};

export const allTask = async (req, res) => {
  try {
    const task = await Task.find();

    res.render("allTask", {
      title: "MyToDo | All Task",
      layout: "layouts/main-layout",
      data: task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const chat = (req, res) => {
  res.render("chatBot", {
    title: "Aurum | AI",
    layout: "layouts/main-layout",
    data: "",
  });
};

export default (home, addTask, allTask, chat);
