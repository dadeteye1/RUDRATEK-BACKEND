const { registerUser, loginUser } = require("../services/authService");

async function register(req, res) {
  const result = await registerUser(req.body);
  res.status(201).json(result);
}

async function login(req, res) {
  const result = await loginUser(req.body);
  res.status(200).json(result);
}

module.exports = {
  register,
  login,
};
