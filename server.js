const express = require('express');
const cors = require('cors');
const compression = require('compression');
const app = express();

// Add essential middleware
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint - keep this simple and fast
app.get('/', (_, res) => {
    res.send('OK');
});

// Simplified validation endpoint
app.post('/validation', (req, res) => {
    try {
        // Log request
        console.log('Validation Request:', new Date().toISOString());
        
        // Send immediate response
        res.status(200).json({
            ResultCode: "0",
            ResultDesc: "Accepted"
        });
        
        // Log request details after response
        console.log('Validation Details:', req.body);
    } catch (error) {
        console.error('Validation Error:', error);
        res.status(200).json({
            ResultCode: "1",
            ResultDesc: "Server Error"
        });
    }
});

// Simplified confirmation endpoint
app.post('/confirmation', (req, res) => {
    try {
        // Log request
        console.log('Confirmation Request:', new Date().toISOString());
        
        // Send immediate response
        res.status(200).json({
            ResultCode: "0",
            ResultDesc: "Success"
        });
        
        // Log request details after response
        console.log('Confirmation Details:', req.body);
    } catch (error) {
        console.error('Confirmation Error:', error);
        res.status(200).json({
            ResultCode: "1",
            ResultDesc: "Server Error"
        });
    }
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(200).json({
        ResultCode: "1",
        ResultDesc: "Server Error"
    });
});

// Start server
const port = process.env.PORT || 3000;
const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});

// Set timeout
server.timeout = 30000;