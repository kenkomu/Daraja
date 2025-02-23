const unirest = require('unirest');

function generateAccessToken() {
    return new Promise((resolve, reject) => {
        unirest('GET', 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials')
            .headers({ 'Authorization': 'Basic UTFLRWdhU0VKU2VGeDVIdmgwTTFIckdjMkJlM3RzdGZRUVhzd0huQUpWSnJaQWFKOkFPMDJaa3ZBejNhM0hBQUhub2RMaEN4ZFp1bFR5bUtGNEc3U0diUnpBcXgxaFFKbXJwenFSVWRMYXR3V3JQN2E=' })
            .send()
            .end(res => {
                if (res.error) {
                    reject(res.error);
                    return;
                }
                const result = JSON.parse(res.raw_body);
                resolve(result.access_token);
            });
    });
}

function registerURLs(accessToken) {
    return new Promise((resolve, reject) => {
      if (!accessToken) {
        reject(new Error('Access token is required'));
        return;
      }
      
      // Get the ngrok URL from environment variable or configure it directly
      const NGROK_URL = process.env.NGROK_URL || 'https://5c4f-105-163-0-46.ngrok-free.app';
      
      unirest('POST', 'https://sandbox.safaricom.co.ke/mpesa/c2b/v2/registerurl')
        .headers({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        })
        .send(JSON.stringify({
          "ShortCode": "174379",
          "ResponseType": "Completed",
          "ConfirmationURL": `${NGROK_URL}/confirmation`,
          "ValidationURL": `${NGROK_URL}/validation`
        }))
        .end(res => {
          if (res.error) {
            const errorBody = typeof res.body === 'string' ? JSON.parse(res.body) : res.body;
            console.error('Full response:', errorBody);
            reject(new Error(`Registration failed: ${errorBody.errorMessage || 'Unknown error'}`));
            return;
          }
          
          try {
            const responseBody = typeof res.raw_body === 'string' 
              ? JSON.parse(res.raw_body) 
              : res.raw_body;
            console.log('Registration response:', responseBody);
            resolve(responseBody);
          } catch (error) {
            console.error('Raw response:', res.raw_body);
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
                    console.error('Simulation error:', errorBody);
                    reject(new Error(`Simulation failed: ${errorBody.errorMessage || 'Unknown error'}`));
                    return;
                }
                
                try {
                    const responseBody = typeof res.raw_body === 'string' 
                        ? JSON.parse(res.raw_body) 
                        : res.raw_body;
                    console.log('Simulation response:', responseBody);
                    resolve(responseBody);
                } catch (error) {
                    console.error('Raw response:', res.raw_body);
                    reject(error);
                }
            });
    });
}

// Export functions for other modules to use
module.exports = {
    generateAccessToken,
    registerURLs,
    simulateC2B
};