const Project = require("../models/projectModel");
const ProjectMember = require("../models/projectMemberModel");


exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = await Project.create({ name, description, createdBy: req.user._id });

    await ProjectMember.create({ projectId: project._id, userId: req.user._id, role: "admin" });

    res.status(201).json({ message: "Project created", success: true, project });
  } catch (error) {
    res.status(500).json({ message: "Unable to create project" });
  }
};

exports.getUserProjects = async (req, res) => {
  try {
    const projectMembers = await ProjectMember.find({ userId: req.user._id }).populate("projectId");
    const projects = projectMembers.map(member => ({
      ...member.projectId.toObject(),
      userRole: member.role
    }));

    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch projects" });
  }
};