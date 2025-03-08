const { generateAccessToken, registerURLs, simulateC2B } = require('./functions');

async function initialize() {
  try {
    console.log('Starting initialization...');
    console.log('Timestamp:', new Date().toISOString());
   
    
    // Generate access token and also display the access token, register URLs, and simulate C2B transaction in sequence
    // Use try-catch blocks to handle any errors that may occur during the process
    console.log('Generating access token...');
    const token = await generateAccessToken();
    console.log('Token generated successfully');
    
    console.log('Access token:', token);
    console.log('Registering URLs...');
    await registerURLs(token);
    console.log('URLs registered successfully');
    
    console.log('Simulating C2B transaction...');
    const result = await simulateC2B(token);
    console.log('Simulation completed:', result);
    
    console.log('Initialization completed successfully');
  } catch (error) {
    console.error('Initialization failed:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }
}

// Execute initialization
initialize();