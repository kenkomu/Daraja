const express = require('express');
const app = express();

// Increase payload size limit and timeout
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Set timeout for all requests
app.use((req, res, next) => {
  res.setTimeout(30000, () => {
    console.log('Request has timed out.');
    res.status(408).send('Request has timed out.');
  });
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Simple health check
app.get('/', (req, res) => {
  res.status(200).send({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Test endpoint
app.post('/test', (req, res) => {
  console.log('Test endpoint hit:', {
    body: req.body,
    headers: req.headers
  });
  res.status(200).json({
    status: 'success',
    receivedData: req.body,
    timestamp: new Date().toISOString()
  });
});

// Validation endpoint
app.post('/validation', (req, res) => {
  console.log('Validation request received:', {
    body: req.body,
    headers: req.headers
  });
  
  try {
    res.status(200).json({
      ResultCode: "0",
      ResultDesc: "Accepted"
    });
    console.log('Validation response sent successfully');
  } catch (error) {
    console.error('Error in validation:', error);
    res.status(200).json({
      ResultCode: "1",
      ResultDesc: `Error: ${error.message}`
    });
  }
});

// Confirmation endpoint
app.post('/confirmation', (req, res) => {
  console.log('Confirmation request received:', {
    body: req.body,
    headers: req.headers,
    timestamp: new Date().toISOString()
  });

  try {
    // Log the successful processing
    console.log('Processing confirmation request');
    
    res.status(200).json({
      ResultCode: "0",
      ResultDesc: "Success"
    });
    
    console.log('Confirmation response sent successfully');
  } catch (error) {
    console.error('Error processing confirmation:', error);
    res.status(200).json({
      ResultCode: "1",
      ResultDesc: "Internal error"
    });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    body: req.body,
    timestamp: new Date().toISOString()
  });
  
  res.status(200).json({
    ResultCode: "1",
    ResultDesc: `Error: ${err.message}`
  });
});

// Start server with proper error handling
const port = process.env.PORT || 3000;
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  console.log(`Server timestamp: ${new Date().toISOString()}`);
  console.log('Environment:', process.env.NODE_ENV);
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
});