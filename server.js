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

// Validation endpoint
app.post('/validation', (req, res) => {
  try {
    // Log the full validation request
    console.log('\n=== Validation Request ===');
    console.log({
      TransactionType: req.body.TransactionType,
      TransID: req.body.TransID,
      TransTime: req.body.TransTime,
      TransAmount: req.body.TransAmount,
      BusinessShortCode: req.body.BusinessShortCode,
      BillRefNumber: req.body.BillRefNumber,
      InvoiceNumber: req.body.InvoiceNumber,
      OrgAccountBalance: req.body.OrgAccountBalance,
      ThirdPartyTransID: req.body.ThirdPartyTransID,
      MSISDN: req.body.MSISDN,
      FirstName: req.body.FirstName,
      MiddleName: req.body.MiddleName,
      LastName: req.body.LastName
    });

    // Validate the transaction (you can add your validation logic here)
    const isValid = true; // Replace with your validation logic

    if (isValid) {
      res.status(200).json({
        ResultCode: "0",
        ResultDesc: "Accepted"
      });
    } else {
      res.status(200).json({
        ResultCode: "C2B00011",
        ResultDesc: "Rejected"
      });
    }
  } catch (error) {
    console.error('Validation Error:', error);
    res.status(200).json({
      ResultCode: "C2B00016",
      ResultDesc: "Other Error"
    });
  }
});

// Confirmation endpoint
app.post('/confirmation', (req, res) => {
  try {
    // Log the full confirmation request
    console.log('\n=== Confirmation Request ===');
    console.log({
      TransactionType: req.body.TransactionType,
      TransID: req.body.TransID,
      TransTime: req.body.TransTime,
      TransAmount: req.body.TransAmount,
      BusinessShortCode: req.body.BusinessShortCode,
      BillRefNumber: req.body.BillRefNumber,
      InvoiceNumber: req.body.InvoiceNumber,
      OrgAccountBalance: req.body.OrgAccountBalance,
      ThirdPartyTransID: req.body.ThirdPartyTransID,
      MSISDN: req.body.MSISDN,
      FirstName: req.body.FirstName,
      MiddleName: req.body.MiddleName,
      LastName: req.body.LastName
    });

    res.status(200).json({
      ResultCode: "0",
      ResultDesc: "Success"
    });
  } catch (error) {
    console.error('Confirmation Error:', error);
    res.status(200).json({
      ResultCode: "1",
      ResultDesc: "Internal Error"
    });
  }
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
});

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  console.log('Waiting for M-Pesa callbacks...');
  console.log('Endpoints:');
  console.log(`- Validation URL: ${process.env.NGROK_URL}/validation`);
  console.log(`- Confirmation URL: ${process.env.NGROK_URL}/confirmation`);
});