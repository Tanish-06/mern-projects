require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const todoRoutes = require('./routes/todoRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const dns = require("dns");

// Agar iski zarurat nahi hai to hata do.
// Agar rakhna hai to 0.0.0.1 valid DNS nahi hai.
dns.setServers(["1.1.1.1"]);
connectDB();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());

// Todo routes
app.use('/api/todos', todoRoutes);

// Serve frontend build in production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendPath));

  app.get('/*splat', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});