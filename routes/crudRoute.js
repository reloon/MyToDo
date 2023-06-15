import express from "express";
import Task from '../models/taskModel.js'

const router = express.Router()

router.post('/add', (req, res) => {
  const body = req.body

  const task = new Task({
    task: body.task,
    desc: body.desc,
    deadLine: body.deadline,
    isReminded: false
  })
  task.save().then(() => {
    console.log(req.body)
    res.redirect('/')
  })
})

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