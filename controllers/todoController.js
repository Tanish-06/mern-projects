const Todo = require('../models/Todo');

// @desc    Get all todos
// @route   GET /api/todos
const getTodos = async (req, res, next) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new todo
// @route   POST /api/todos
const createTodo = async (req, res, next) => {
  try {
    const { text } = req.body;
    const todo = await Todo.create({ text });
    res.status(201).json(todo);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a todo
// @route   PUT /api/todos/:id
const updateTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      res.status(404);
      throw new Error('Todo not found');
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedTodo);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
const deleteTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      res.status(404);
      throw new Error('Todo not found');
    }

    await Todo.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Todo deleted', id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};