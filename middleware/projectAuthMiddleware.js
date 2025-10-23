const ProjectMember = require("../models/projectMemberModel");

exports.authorizeProjectRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const projectId = req.params.projectId;
      const userId = req.user._id;

      const projectMember = await ProjectMember.findOne({ projectId, userId });
      if (!projectMember)
        return res.status(403).json({ message: "Not project member" });

      if (!allowedRoles.includes(projectMember.role)) {
        return res.status(403).json({ message: "Insufficient role" });
      }

      req.projectRole = projectMember.role;
      next();
    } catch (error) {
      res.status(500).json({ message: "Authorization error" });
    }
  };
};
