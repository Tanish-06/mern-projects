// Handles requests to routes that don't exist
const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404);
  next(error); // passes control to errorHandler below
};

// Centralized error handler — catches errors from anywhere in the app
const errorHandler = (err, req, res, next) => {
  // If status was already set (e.g. 400/404), keep it. Otherwise default to 500.
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Handle a specific Mongoose error: invalid ObjectId format (e.g. bad :id in URL)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found (invalid ID)';
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };