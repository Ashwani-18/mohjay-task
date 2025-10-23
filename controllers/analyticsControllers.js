const Task = require("../models/taskModel");
const TimeLog = require("../models/timeLogModel");

exports.getUserAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    const taskStats = await Task.aggregate([
      { $match: { assignedTo: userId } },
      {
        $group: {
          _id: null,
          totalTasks: { $sum: 1 },
          completedTasks: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } }
        }
      }
    ]);

    const timeStats = await TimeLog.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: null,
          totalWorkingHours: { $sum: "$duration" },
          averageTime: { $avg: "$duration" }
        }
      }
    ]);

    res.json({
      success: true,
      analytics: {
        taskStats: taskStats[0] || { totalTasks: 0, completedTasks: 0 },
        timeStats: timeStats[0] || { totalWorkingHours: 0, averageTime: 0 }
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch analytics" });
  }
};