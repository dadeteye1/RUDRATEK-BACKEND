const { randomUUID } = require("crypto");

const { readStore, updateStore } = require("../utils/fileDb");
const { HttpError } = require("../utils/httpError");

function sanitizeProject(project) {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    status: project.status,
    ownerId: project.ownerId,
    tenantId: project.tenantId,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}

async function listProjectsForUser(user) {
  const state = await readStore();
  return state.projects
    .filter((project) => project.ownerId === user.sub && project.tenantId === user.tenantId)
    .map(sanitizeProject);
}

async function getProjectForUser(projectId, user) {
  const state = await readStore();
  const project = state.projects.find((entry) => entry.id === projectId);

  if (!project || project.ownerId !== user.sub || project.tenantId !== user.tenantId) {
    throw new HttpError(404, "Project not found");
  }

  return sanitizeProject(project);
}

async function createProjectForUser(payload, user) {
  const now = new Date().toISOString();
  let createdProject;

  await updateStore(async (state) => {
    createdProject = {
      id: randomUUID(),
      title: payload.title.trim(),
      description: payload.description ? payload.description.trim() : "",
      status: payload.status || "pending",
      ownerId: user.sub,
      tenantId: user.tenantId,
      createdAt: now,
      updatedAt: now,
    };

    state.projects.push(createdProject);
    return state;
  });

  return sanitizeProject(createdProject);
}

async function updateProjectForUser(projectId, payload, user) {
  let updatedProject;

  await updateStore(async (state) => {
    const project = state.projects.find((entry) => entry.id === projectId);

    if (!project || project.ownerId !== user.sub || project.tenantId !== user.tenantId) {
      throw new HttpError(404, "Project not found");
    }

    if (payload.title !== undefined) {
      project.title = payload.title.trim();
    }

    if (payload.description !== undefined) {
      project.description = payload.description.trim();
    }

    if (payload.status !== undefined) {
      project.status = payload.status;
    }

    project.updatedAt = new Date().toISOString();
    updatedProject = { ...project };
    return state;
  });

  return sanitizeProject(updatedProject);
}

async function deleteProjectForUser(projectId, user) {
  await updateStore(async (state) => {
    const index = state.projects.findIndex((entry) => entry.id === projectId);

    if (index === -1) {
      throw new HttpError(404, "Project not found");
    }

    const project = state.projects[index];

    if (project.ownerId !== user.sub || project.tenantId !== user.tenantId) {
      throw new HttpError(404, "Project not found");
    }

    state.projects.splice(index, 1);
    return state;
  });
}

module.exports = {
  listProjectsForUser,
  getProjectForUser,
  createProjectForUser,
  updateProjectForUser,
  deleteProjectForUser,
};
