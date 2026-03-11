const {
  listProjectsForUser,
  getProjectForUser,
  createProjectForUser,
  updateProjectForUser,
  deleteProjectForUser,
} = require("../services/projectService");

async function listProjects(req, res) {
  const projects = await listProjectsForUser(req.user);
  res.status(200).json({ projects });
}

async function getProject(req, res) {
  const project = await getProjectForUser(req.params.projectId, req.user);
  res.status(200).json({ project });
}

async function createProject(req, res) {
  const project = await createProjectForUser(req.body, req.user);
  res.status(201).json({ project });
}

async function updateProject(req, res) {
  const project = await updateProjectForUser(req.params.projectId, req.body, req.user);
  res.status(200).json({ project });
}

async function deleteProject(req, res) {
  await deleteProjectForUser(req.params.projectId, req.user);
  res.status(204).send();
}

module.exports = {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
};
