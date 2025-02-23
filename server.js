const express = require('express');
const app = express();

// Basic middleware only
app.use(express.json());

// Simple health check
app.get('/', (req, res) => {
    res.status(200).send('OK');
});

// Simple validation endpoint
app.post('/validation', (req, res) => {
    res.status(200).json({
        ResultCode: "0",
        ResultDesc: "Accepted"
    });
});

// Simple confirmation endpoint
app.post('/confirmation', (req, res) => {
    res.status(200).json({
        ResultCode: "0",
        ResultDesc: "Success"
    });
});

// Basic error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(200).json({
        ResultCode: "1",
        ResultDesc: "Error"
    });
});

// Start server with proper error handling
const port = process.env.PORT || 3000;
const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
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