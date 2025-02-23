const { generateAccessToken, registerURLs, simulateC2B } = require('./functions');

async function initialize() {
  try {
    console.log('Generating access token...');
    const token = await generateAccessToken();
    console.log('Token generated successfully');
    
    console.log('Registering URLs...');
    await registerURLs(token);
    console.log('URLs registered successfully');

    console.log('Simulating C2B transaction...');
    const result = await simulateC2B(token);
    console.log('Simulation completed:', result);
  } catch (error) {
    console.error('Initialization failed:', error.message);
  }
}

initialize();