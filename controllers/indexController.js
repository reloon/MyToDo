
import Task from "../models/taskModel.js"

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

export default (home, addTask)