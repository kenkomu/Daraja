# Daraja M-Pesa Integration

This project implements Safaricom's M-Pesa C2B (Customer to Business) API integration using Node.js. It handles payment validation, confirmation, and simulation using the Safaricom sandbox environment.

## Features

- Access token generation
- URL registration for validation and confirmation
- C2B transaction simulation
- Payment validation and confirmation handling
- Ngrok integration for local development

## Prerequisites

- Node.js (>=14.0.0)
- npm
- ngrok
- Safaricom Developer Account
- M-Pesa Sandbox Credentials

## Installation

1. Clone the repository:

```git clone git@github.com:kenkomu/Daraja.git```

2. Start ngrok (in a separate terminal):

``` ngrok http 3000```

3. Second terminal: Update .env and start server

```echo "NGROK_URL=<your_ngrok_url" > .env```

```node server.js```

4. Third terminal: Run the initialization

```node index.js```