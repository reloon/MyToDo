import mongoose from 'mongoose'

const Task = mongoose.Schema(
  {
    task: String,
    desc: String,
    deadLine: String
  }
)

export default mongoose.model('task', Task)