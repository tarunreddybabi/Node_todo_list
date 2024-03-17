const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2");
const dbConfig = require("../config/dbConfig");

const connection = mysql.createConnection(dbConfig);

const register = (req, res) => {
  const { username, email, password } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ error:err });
    }

    const user = { username, email, password: hashedPassword };
    connection.query("INSERT INTO users SET ?", user, (error, results) => {
      if (error) {
        return res.status(500).json({ error: error });
      }
      return res.status(201).json({ message: "User registered successfully" });
    });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  connection.query(
    "SELECT * FROM users WHERE email = ?",
    email,
    (error, results) => {
      if (error || results.length === 0) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const user = results[0];

      bcrypt.compare(password, user.password, (err, result) => {
        if (err || !result) {
          return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign(
          { userId: user.id, email: user.email },
          process.env.JWT_SECRET || "fallback_secret_value",
          { expiresIn: "1h" }
        );

        res.status(200).json({ token });
      });
    }
  );
};

module.exports = {
  register,
  login,
};
