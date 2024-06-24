const express = require('express');
const morgan = require('morgan');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');

const PORT = 3005;

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

// Configure CORS middleware
app.use(cors({
  origin: true, // Update with your specific origin
  credentials: true
}));

// Define your routes here
// const authRoutes = require('./network');

const appStart = () => {
  try {
    app.listen(PORT, () => {
      console.log(`Listener micro-auth: ${PORT}`);
    });
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
};

appStart();
