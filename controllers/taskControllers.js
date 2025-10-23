const Task = require("../models/taskModel");
const TimeLog = require("../models/timeLogModel");
const ProjectMember = require("../models/projectMemberModel");
const { sendPushNotification } = require("../utils/firebaseNotifications");
const sendEmail = require("../utils/sendEmail");

exports.createTask = async (req, res) => {
  try {
    const { projectId, title, description, assignedTo, deadline } = req.body;
    
    const task = await Task.create({
      title, description, projectId, assignedTo, assignedBy: req.user._id, deadline
    });

    const taskWithUser = await Task.findById(task._id).populate("assignedTo");
    const user = taskWithUser.assignedTo;

    // Send notifications
    if (user.firebaseToken) {
      await sendPushNotification(user.firebaseToken, "New Task", `You have been assigned: ${title}`);
    }
    if (user.email) {
      await sendEmail(user.email, "New Task Assigned", `Task: ${title}\nDeadline: ${deadline}`);
    }

    res.status(201).json({ message: "Task created", success: true, task: taskWithUser });
  } catch (error) {
    res.status(500).json({ message: "Unable to create task" });
  }
};

exports.getProjectTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId })
      .populate("assignedTo", "name email")
      .populate("assignedBy", "name email");

    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch tasks" });
  }
};