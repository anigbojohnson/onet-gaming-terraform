const User = require('../models/User');
const bcrypt = require('bcryptjs');


exports.signup = async (req, res) => {

  const { email, password, name } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser =  await User.create({ email, password: hashedPassword, name } );
    // Send JSON back to frontend
    res.status(201).json({ message: 'Signup successful, please login', user: newUser });
  } catch (err) {

       // Handle unique constraint (duplicate email)
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Email already exists, please use another one' });
    }

    // Handle validation errors (like empty fields, wrong formats)
    if (err.name === 'SequelizeValidationError') {
      const messages = err.errors.map(e => e.message); // collect all validation messages
      return res.status(400).json({ message: messages.join('***') });
    }

    // General fallback error
    res.status(500).json({ message: 'Something went wrong. Please try again later.' });
  }
};



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input quickly
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Save session
    req.session.user = { id: user.id, name: user.name,email: user.email };


      req.session.save(err => {
      if (err) {
          console.log('Session save error:', err);
          return res.status(500).json({ message: 'Session error' });
      }
      res.json({ message: 'Login successful', user});
      });

  } catch (err) {
    res.status(500).json({ message: "Server error, please try again later" });
  }
};


exports.currentUser = async (req, res) =>{

    if (req.session.user) {
              res.json({ user: req.session.user });
    } else {
        res.status(401).json({ message: 'Not logged in' });
    }
};


exports.logoutUser = async (req, res) => {
  console.log(req.session)
  req.session.destroy(err => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).send("Could not log out.");
    }

    // Clear the cookie
    res.clearCookie('connect.sid');  
   return res.status(200).json("");

  });
}

