const express = require("express");

const {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const { authenticate } = require("../middleware/authenticate");
const { asyncHandler } = require("../middleware/asyncHandler");
const { validate, projectSchemas } = require("../middleware/validate");

const router = express.Router();

router.use(authenticate);

router.get("/", asyncHandler(listProjects));
router.get("/:projectId", asyncHandler(getProject));
router.post("/", validate(projectSchemas.create), asyncHandler(createProject));
router.patch("/:projectId", validate(projectSchemas.update), asyncHandler(updateProject));
router.delete("/:projectId", asyncHandler(deleteProject));

module.exports = router;
