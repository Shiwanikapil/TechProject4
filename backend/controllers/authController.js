const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const users = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'web4assign-secret';

async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existingUser = users.find((user) => user.email === email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: users.length + 1,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    };

    users.push(newUser);

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });
    return res.status(201).json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error while registering user.' });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const existingUser = users.find((user) => user.email === email.toLowerCase());
    if (!existingUser) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: existingUser.id, email: existingUser.email }, JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ token, user: { id: existingUser.id, name: existingUser.name, email: existingUser.email } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error while logging in.' });
  }
}

module.exports = {
  registerUser,
  loginUser,
};
