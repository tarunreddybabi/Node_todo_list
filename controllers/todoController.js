const mysql = require("mysql2");
const dbConfig = require("../config/dbConfig");

const connection = mysql.createConnection(dbConfig);

const getAllTodos = (req, res) => {
  const { username } = req.query;
  connection.query(
    "SELECT * FROM todos WHERE username = ?",
    [username],
    (error, results) => {
      if (error) {
        return res
          .status(500)
          .json({ error: "Error fetching todos from database" });
      }
      return res.status(200).json({ todos: results });
    }
  );
};

const createTodo = (req, res) => {
  const { username, title, description, due_date } = req.body;

  const todo = { username, title, description, due_date };
  connection.query("INSERT INTO todos SET ?", todo, (error, result) => {
    if (error) {
      return res.status(500).json({ error: "Error creating todo" });
    }
    return res.status(201).json({
      message: "Todo created successfully",
      todo: { id: result.insertId, ...todo },
    });
  });
};

const updateTodo = (req, res) => {
  const { id } = req.params;
  const { title, description, due_date } = req.body;

  const updatedTodo = { title, description, due_date };
  connection.query(
    "UPDATE todos SET ? WHERE id = ?",
    [updatedTodo, id],
    (error, result) => {
      if (error) {
        return res.status(500).json({ error: "Error updating todo" });
      }
      return res.status(200).json({
        message: "Todo updated successfully",
        todo: { id, ...updatedTodo },
      });
    }
  );
};

const deleteTodo = (req, res) => {
  const { id } = req.params;

  connection.query("DELETE FROM todos WHERE id = ?", id, (error, result) => {
    if (error) {
      return res.status(500).json({ error: "Error deleting todo" });
    }
    return res
      .status(200)
      .json({ message: "Todo deleted successfully", deletedTodoId: id });
  });
};

module.exports = {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
