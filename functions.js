const unirest = require('unirest');
require('dotenv').config();

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

    const NGROK_URL = process.env.NGROK_URL;
    if (!NGROK_URL) {
      reject(new Error('NGROK_URL environment variable is not set'));
      return;
    }

    console.log('Using NGROK URL:', NGROK_URL);
    
    // Changed to v1 endpoint and updated request format
    unirest('POST', 'https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl')
      .headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      })
      .send({
        ShortCode: "174379",
        ResponseType: "Completed",
        ConfirmationURL: `${NGROK_URL}/confirmation`,
        ValidationURL: `${NGROK_URL}/validation`
      })
      .end(res => {
        if (res.error) {
          // Handle specific error codes
          if (res.status === 500 && res.body?.errorCode === '500.003.1001') {
            console.log('Retrying URL registration...');
            // Wait 2 seconds and retry
            setTimeout(() => {
              this.registerURLs(accessToken)
                .then(resolve)
                .catch(reject);
            }, 2000);
            return;
          }

          const errorBody = typeof res.body === 'string' ? JSON.parse(res.body) : res.body;
          console.error('URL registration error:', {
            error: res.error,
            body: errorBody,
            url: NGROK_URL
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
          console.error('Error parsing registration response:', error);
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
    
    const requestBody = {
      ShortCode: "174379",
      CommandID: "CustomerPayBillOnline",
      Amount: "100",
      Msisdn: "254708374149",
      BillRefNumber: "test001"
    };

    console.log('Simulation request:', requestBody);

    unirest('POST', 'https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate')
      .headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      })
      .send(requestBody)  // Send plain object, unirest will handle JSON stringification
      .end(res => {
        // Check if response exists
        if (!res) {
          console.error('No response received');
          reject(new Error('No response received'));
          return;
        }

        // Log full response for debugging
        console.log('Raw response:', res.raw_body);
        console.log('Response status:', res.status);

        if (res.error) {
          console.error('Response error:', {
            status: res.status,
            body: res.body,
            error: res.error
          });

          // Handle specific error cases
          if (res.status === 500) {
            reject(new Error('Server error: The simulation request failed. Please verify your parameters.'));
            return;
          }

          reject(new Error(`Simulation failed: ${res.error.message || 'Unknown error'}`));
          return;
        }
        
        try {
          const responseBody = typeof res.raw_body === 'string' 
            ? JSON.parse(res.raw_body) 
            : res.raw_body;

          console.log('Simulation response:', responseBody);
          resolve(responseBody);
        } catch (error) {
          console.error('Parse error:', error);
          reject(new Error('Failed to parse simulation response'));
        }
      });
  });
}

module.exports = {
  generateAccessToken,
  registerURLs,
  simulateC2B
};