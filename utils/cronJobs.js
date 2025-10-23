const cron = require('node-cron');
const Task = require('../models/taskModel');
const { sendPushNotification } = require('./firebaseNotifications');
const sendEmail = require('./sendEmail');

// Check deadlines every minute
cron.schedule('* * * * *', async () => {
  try {
    const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);
    
    const upcomingTasks = await Task.find({
      deadline: { $lte: oneHourFromNow, $gte: new Date() },
      status: { $in: ['pending', 'in-progress'] }
    }).populate('assignedTo');

    for (const task of upcomingTasks) {
      const user = task.assignedTo;
      
      if (user.firebaseToken) {
        await sendPushNotification(user.firebaseToken, 
          "Deadline Approaching", 
          `Task "${task.title}" due soon`
        );
      }

      if (user.email) {
        await sendEmail(user.email, 
          "Task Deadline Reminder", 
          `Your task "${task.title}" is due soon`
        );
      }
    }
  } catch (error) {
    console.error('Cron job error:', error);
  }
});