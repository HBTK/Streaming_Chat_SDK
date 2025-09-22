Streaming Chat SDK (@bytemaster2704/streaming-chat-sdk)
A lightweight, modern, and easy-to-use TypeScript SDK for interacting with a backend API that uses Server-Sent Events (SSE) to stream chat responses.

This SDK handles the complexities of maintaining a connection to a streaming endpoint, allowing you to focus on building your application's user interface. It is designed for browser environments and uses the native EventSource API.

Features
🚀 Simple Interface: A clean, Promise-based API that is intuitive and easy to learn.

📡 Real-time Streaming: Built on top of EventSource to handle real-time data streams effortlessly.

Callbacks: Provides onToken, onEnd, and onError callbacks to manage the entire lifecycle of a stream.

✅ Type-Safe: Written entirely in TypeScript for excellent autocompletion and type safety.

🌐 Browser-Ready: Works out of the box in all modern browsers with no dependencies.

Installation
You can install the SDK using npm or yarn:

npm install @bytemaster2704/streaming-chat-sdk

yarn add @bytemaster2704/streaming-chat-sdk

Quick Start & Usage
Here's how to import and use the SDK in a JavaScript/TypeScript project (e.g., React, Vue, Angular).

// 1. Import the main class
import { ChatSDK } from '@bytemaster2704/streaming-chat-sdk';

// 2. Initialize the SDK with the base URL of your API
const sdk = new ChatSDK({
baseUrl: 'http://localhost:3001' // Replace with your deployed API URL
});

// 3. Define your query and get a reference to your UI element
const query = "Tell me a short story about a robot who discovers music.";
const chatOutputElement = document.getElementById('chat-output');
let fullResponse = "";

try {
// 4. Call the .stream() method with callbacks
sdk.stream(query, {
// onToken is called for each piece of data from the stream
onToken: (token) => {
fullResponse += token;
chatOutputElement.innerText = fullResponse; // Update UI in real-time
console.log("Token received:", token);
},
// onEnd is called when the server successfully closes the stream
onEnd: () => {
console.log("Stream finished!");
},
// onError is called if the connection fails or an error is sent
onError: (err) => {
console.error("Stream error:", err.message);
chatOutputElement.innerText = `Error: ${err.message}`;
}
});
} catch (err) {
// This catches synchronous errors, e.g., if the query is empty
console.error("SDK Initialization Error:", err.message);
}

Usage in a Plain HTML Website (via CDN)
You don't need a complex framework to use this SDK. You can import it directly into an HTML file from a CDN like esm.sh.

Below is a complete, self-contained example.

index.html

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat SDK Demo</title>
    <style>
      /* Basic styling for the demo */
      body { font-family: sans-serif; background: #1a1a1a; color: #fff; display: grid; place-content: center; min-height: 100vh; }
      .chat-container { width: 500px; border: 1px solid #333; padding: 20px; border-radius: 8px; background: #2a2a2a; }
      input { width: 100%; padding: 10px; border-radius: 4px; border: 1px solid #444; background: #333; color: #fff; }
      button { padding: 10px 15px; border-radius: 4px; border: none; background: #007bff; color: #fff; cursor: pointer; margin-top: 10px; }
      #output { margin-top: 15px; background: #111; padding: 10px; border-radius: 4px; min-height: 100px; white-space: pre-wrap; }
      #status { font-size: 0.8em; color: #888; height: 1.2em; }
    </style>
</head>
<body>

<div class="chat-container">
    <h1>Chat Demo</h1>
    <input type="text" id="query-input" placeholder="Ask something...">
    <button id="send-button">Send</button>
    <p id="status"></p>
    <div id="output"></div>
</div>

<script type="module">
    // Import the SDK directly from the esm.sh CDN
    import { ChatSDK } from '[https://esm.sh/@bytemaster2704/streaming-chat-sdk](https://esm.sh/@bytemaster2704/streaming-chat-sdk)';

    // Get references to DOM elements
    const queryInput = document.getElementById('query-input');
    const sendButton = document.getElementById('send-button');
    const outputDiv = document.getElementById('output');
    const statusP = document.getElementById('status');

    // IMPORTANT: Change this to your API's URL!
    const sdk = new ChatSDK({ baseUrl: 'http://localhost:3001' });

    const handleSend = () => {
        const query = queryInput.value;
        if (!query) return;

        // Reset UI
        outputDiv.innerText = '';
        statusP.innerText = 'Connecting...';
        sendButton.disabled = true;
        let fullResponse = "";

        sdk.stream(query, {
            onToken: (token) => {
                statusP.innerText = 'Streaming...';
                fullResponse += token;
                outputDiv.innerText = fullResponse;
            },
            onEnd: () => {
                statusP.innerText = 'Stream complete!';
                sendButton.disabled = false;
            },
            onError: (err) => {
                statusP.innerText = `Error: ${err.message}`;
                sendButton.disabled = false;
            }
        });
    };

    sendButton.addEventListener('click', handleSend);
</script>

</body>
</html>

❗ Important: Backend CORS Configuration
For this SDK to work, your backend server must be configured to accept requests from the website where you are using the SDK. This is a security requirement handled by CORS (Cross-Origin Resource Sharing).

If you are using Node.js with Express, you can easily configure this with the cors middleware.

1. Install cors in your backend project:

npm install cors

2. Use it in your Express app:

import express from 'express';
import cors from 'cors'; // Import

const app = express();

// Define which origins are allowed to connect
const allowedOrigins = [
'http://localhost:5500',
'[http://127.0.0.1:5500](http://127.0.0.1:5500)',
'[https://your-production-website.com](https://your-production-website.com)' // Add your deployed website URL here
];

// Setup CORS options
const corsOptions = {
origin: function (origin, callback) {
if (!origin || allowedOrigins.indexOf(origin) !== -1) {
callback(null, true);
} else {
callback(new Error('Not allowed by CORS'));
}
}
};

app.use(cors(corsOptions)); // Apply the middleware

// ... your /chat/stream route and other routes

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

License
This project is licensed under the ISC License.
