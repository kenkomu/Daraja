const unirest = require('unirest');

function generateAccessToken() {
  return new Promise((resolve, reject) => {
    console.log('Generating access token...');
    
    unirest('GET', 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials')
      .headers({
        'Authorization': 'Basic UTFLRWdhU0VKU2VGeDVIdmgwTTFIckdjMkJlM3RzdGZRUVhzd0huQUpWSnJaQWFKOkFPMDJaa3ZBejNhM0hBQUhub2RMaEN4ZFp1bFR5bUtGNEc3U0diUnpBcXgxaFFKbXJwenFSVWRMYXR3V3JQN2E='
      })
      .send()
      .end(res => {
        if (res.error) {
          console.error('Error generating access token:', res.error);
          reject(res.error);
          return;
        }
        
        try {
          const result = JSON.parse(res.raw_body);
          console.log('Access token generated successfully');
          resolve(result.access_token);
        } catch (error) {
          console.error('Error parsing access token response:', error);
          reject(error);
        }
      });
  });
}

function registerURLs(accessToken) {
  return new Promise((resolve, reject) => {
    if (!accessToken) {
      reject(new Error('Access token is required'));
      return;
    }

    console.log('Registering URLs...');
    
    // Update URLs to production
    const PROD_URL = 'https://daraja-production-1379.up.railway.app';
    
    unirest('POST', 'https://sandbox.safaricom.co.ke/mpesa/c2b/v2/registerurl')
      .headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      })
      .send(JSON.stringify({
        "ShortCode": "174379",
        "ResponseType": "Completed",
        "ConfirmationURL": `${PROD_URL}/confirmation`,
        "ValidationURL": `${PROD_URL}/validation`
      }))
      .end(res => {
        if (res.error) {
          const errorBody = typeof res.body === 'string' ? JSON.parse(res.body) : res.body;
          console.error('URL registration error:', {
            error: res.error,
            body: errorBody
          });
          reject(new Error(`Registration failed: ${errorBody.errorMessage || 'Unknown error'}`));
          return;
        }
        
        try {
          const responseBody = typeof res.raw_body === 'string'
            ? JSON.parse(res.raw_body)
            : res.raw_body;
          console.log('URL registration successful:', responseBody);
          resolve(responseBody);
        } catch (error) {
          console.error('Error parsing registration response:', {
            error: error,
            raw_body: res.raw_body
          });
          reject(error);
        }
      });
  });
}

function simulateC2B(accessToken) {
  return new Promise((resolve, reject) => {
    if (!accessToken) {
      reject(new Error('Access token is required'));
      return;
    }

    console.log('Simulating C2B transaction...');
    
    unirest('POST', 'https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate')
      .headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      })
      .send(JSON.stringify({
        "ShortCode": "174379",
        "CommandID": "CustomerPayBillOnline",
        "Amount": "100",
        "Msisdn": "254708374149",
        "BillRefNumber": "test001"
      }))
      .end(res => {
        if (res.error) {
          const errorBody = typeof res.body === 'string' ? JSON.parse(res.body) : res.body;
          console.error('Simulation error:', {
            error: res.error,
            body: errorBody
          });
          reject(new Error(`Simulation failed: ${errorBody.errorMessage || 'Unknown error'}`));
          return;
        }
        
        try {
          const responseBody = typeof res.raw_body === 'string'
            ? JSON.parse(res.raw_body)
            : res.raw_body;
          console.log('Simulation successful:', responseBody);
          resolve(responseBody);
        } catch (error) {
          console.error('Error parsing simulation response:', {
            error: error,
            raw_body: res.raw_body
          });
          reject(error);
        }
      });
  });
}

module.exports = {
  generateAccessToken,
  registerURLs,
  simulateC2B
};