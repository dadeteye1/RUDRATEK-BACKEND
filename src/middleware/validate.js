const { HttpError } = require("../utils/httpError");

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validate(schema) {
  return function validator(req, res, next) {
    const errors = schema(req);

    if (errors.length > 0) {
      return next(new HttpError(400, "Validation failed", errors));
    }

    return next();
  };
}

const authSchemas = {
  register(req) {
    const { email, password, name, tenantId } = req.body;
    const errors = [];

    if (!isNonEmptyString(name) || name.trim().length < 2) {
      errors.push("name must be at least 2 characters long");
    }

    if (!isNonEmptyString(email) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("email must be a valid email address");
    }

    if (!isNonEmptyString(password) || password.length < 8) {
      errors.push("password must be at least 8 characters long");
    }

    if (!isNonEmptyString(tenantId)) {
      errors.push("tenantId is required");
    }

    return errors;
  },

  login(req) {
    const { email, password } = req.body;
    const errors = [];

    if (!isNonEmptyString(email)) {
      errors.push("email is required");
    }

    if (!isNonEmptyString(password)) {
      errors.push("password is required");
    }

    return errors;
  },
};

const allowedStatuses = new Set(["pending", "active", "completed", "archived"]);

const projectSchemas = {
  create(req) {
    const { title, description, status } = req.body;
    const errors = [];

    if (!isNonEmptyString(title) || title.trim().length < 3 || title.trim().length > 120) {
      errors.push("title must be between 3 and 120 characters");
    }

    if (
      description !== undefined &&
      (typeof description !== "string" || description.trim().length > 1000)
    ) {
      errors.push("description must be a string up to 1000 characters");
    }

    if (status !== undefined && !allowedStatuses.has(status)) {
      errors.push("status must be one of pending, active, completed, archived");
    }

    return errors;
  },

  update(req) {
    const { title, description, status } = req.body;
    const errors = [];
    const providedKeys = Object.keys(req.body);

    if (providedKeys.length === 0) {
      errors.push("at least one field is required");
    }

    if (title !== undefined && (!isNonEmptyString(title) || title.trim().length < 3 || title.trim().length > 120)) {
      errors.push("title must be between 3 and 120 characters");
    }

    if (
      description !== undefined &&
      (typeof description !== "string" || description.trim().length > 1000)
    ) {
      errors.push("description must be a string up to 1000 characters");
    }

    if (status !== undefined && !allowedStatuses.has(status)) {
      errors.push("status must be one of pending, active, completed, archived");
    }

    return errors;
  },
};

module.exports = {
  validate,
  authSchemas,
  projectSchemas,
  allowedStatuses,
};
