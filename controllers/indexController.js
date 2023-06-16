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

  setInterval(async () => {
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
  }, 1000);

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

export default (home, addTask, allTask)