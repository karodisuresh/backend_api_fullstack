// routes/tasks.js

const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const { route } = require("./auth");

router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

// Create a new task
router.post("/tasks", async (req, res) => {
  try {
    const { title, description, status } = req.body;

    // Check if title and status are provided
    if (!title || !status) {
      return res
        .status(400)
        .json({ message: "Title and status are required." });
    }

    // Create a new task
    const newTask = new Task({
      title,
      description,
      status,
    });

    // Save task to the database
    await newTask.save();

    // Send back the created task as a response
    return res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(500).json({ message: "Failed to create task" });
  }
});

// Update task by ID
router.put("/tasks/:taskId", async (req, res) => {
  const { taskId } = req.params;
  const { title, description, status } = req.body;

  try {
    // Find the task by ID and update its fields
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { title, description, status },
      { new: true, runValidators: true } // Return the updated document and run validators
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete a task
// routes/task.js
router.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task" });
  }
});

module.exports = router;
