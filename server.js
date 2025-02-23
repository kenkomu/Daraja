const express = require('express');
const app = express();
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log('\n--------------------');
    console.log('New Request:', new Date().toISOString());
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('--------------------\n');
    next();
});

// Validation URL endpoint
app.post('/validation', (req, res) => {
    console.log('\n=== Validation Request ===');
    console.log('Transaction Type:', req.body.TransactionType);
    console.log('Transaction ID:', req.body.TransID);
    console.log('Transaction Time:', req.body.TransTime);
    console.log('Transaction Amount:', req.body.TransAmount);
    console.log('Business ShortCode:', req.body.BusinessShortCode);
    console.log('Bill Reference:', req.body.BillRefNumber);
    console.log('MSISDN:', req.body.MSISDN);
    console.log('========================\n');

    res.json({
        "ResultCode": "0",
        "ResultDesc": "Accepted"
    });
});

// Confirmation URL endpoint
app.post('/confirmation', (req, res) => {
    console.log('\n=== Confirmation Request ===');
    console.log('Transaction Type:', req.body.TransactionType);
    console.log('Transaction ID:', req.body.TransID);
    console.log('Transaction Time:', req.body.TransTime);
    console.log('Transaction Amount:', req.body.TransAmount);
    console.log('Business ShortCode:', req.body.BusinessShortCode);
    console.log('Bill Reference:', req.body.BillRefNumber);
    console.log('Invoice Number:', req.body.InvoiceNumber);
    console.log('Org Account Balance:', req.body.OrgAccountBalance);
    console.log('Third Party ID:', req.body.ThirdPartyTransID);
    console.log('MSISDN:', req.body.MSISDN);
    console.log('First Name:', req.body.FirstName);
    console.log('Middle Name:', req.body.MiddleName);
    console.log('Last Name:', req.body.LastName);
    console.log('==========================\n');

    res.json({
        "ResultCode": "0",
        "ResultDesc": "Success"
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log('Waiting for M-Pesa callbacks...');
});