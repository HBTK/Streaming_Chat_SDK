# 📦 Streaming Chat SDK

[![npm version](https://img.shields.io/npm/v/@bytemaster2704/streaming-chat-sdk)](https://www.npmjs.com/package/@bytemaster2704/streaming-chat-sdk)  
A lightweight, TypeScript-friendly SDK for connecting to **streaming chat APIs** using **Server-Sent Events (SSE)**.  
Perfect for building real-time AI assistants, chatbots, or any application requiring live streamed responses.

---

## 🚀 Features

- ⚡ **Streaming support** via SSE (real-time tokens as they arrive)
- 🛠️ **TypeScript types included** for zero-guesswork development
- 🔌 **Works in browser and Node.js** (with an SSE polyfill in Node)
- 🔍 Easy to configure and extend

---

## 📥 Installation

```bash
npm install @bytemaster2704/streaming-chat-sdk
```

If you’re using Node.js (not the browser), install an SSE polyfill:

```bash
npm install eventsource
```

---

## 🛠️ Quick Start

```ts
import { ChatSDK } from "@bytemaster2704/streaming-chat-sdk";

const sdk = new ChatSDK({
  baseUrl: "https://your-chat-api.com", // defaults to http://localhost:3000
});

sdk.stream("Hello, world!", {
  onToken: (token) => {
    process.stdout.write(token); // stream tokens in real-time
  },
  onEnd: () => {
    console.log("\n✅ Stream ended by server.");
  },
  onError: (err) => {
    console.error("❌ Error:", err.message);
  },
});
```

---

## 📖 API Reference

### **Class: `ChatSDK`**

#### **Constructor**

```ts
new ChatSDK(options?: { baseUrl?: string })
```

- `baseUrl` (string) – The root URL of your chat API.  
  Defaults to `http://localhost:3000`.

---

#### **Method: `stream`**

```ts
sdk.stream(query: string, options: StreamingChatOptions): EventSource
```

Starts a streaming chat session with the server.

- **Parameters**
  - `query` _(string)_ – The prompt or question to send.
  - `options` _(StreamingChatOptions)_ – Callbacks for handling stream events.

- **Returns**
  - `EventSource` – The underlying SSE connection.

---

### **Interface: `StreamingChatOptions`**

```ts
interface StreamingChatOptions {
  onToken: (token: string) => void; // required
  onEnd?: () => void; // optional
  onError?: (error: Error) => void; // optional
}
```

- `onToken` – Fired whenever the server streams a new token.
- `onEnd` – Fired when the stream is completed.
- `onError` – Fired if a network or server error occurs.

---

## 💡 Common Use Cases

### ✅ Building an AI Chatbot

Display tokens as they arrive for a natural typing effect.

### ✅ Real-time Status Updates

Use the `status` event type to stream progress updates from the server.

### ✅ Long-running Tasks

Stream results chunk by chunk instead of waiting for the full response.

---

## 🐛 Troubleshooting

### 1. **`EventSource is not defined` (Node.js only)**

Node.js doesn’t ship with `EventSource`. Install a polyfill:

```bash
npm install eventsource
```

Then, at the top of your app:

```ts
import EventSource from "eventsource";
(global as any).EventSource = EventSource;
```

---

### 2. **`Failed to parse server message`**

Make sure your server sends **JSON-encoded messages** in this format:

```json
{ "type": "token", "content": "Hello" }
{ "type": "end" }
{ "type": "error", "content": "Something went wrong" }
```

---

### 3. **`Stream never ends`**

Your server must send an `"end"` message. Otherwise, the connection stays open indefinitely.

---

## 🧪 Development

Clone and build locally:

```bash
git clone https://github.com/bytemaster2704/streaming-chat-sdk.git
cd streaming-chat-sdk
npm install
npm run build
```

---

## 📜 License

[ISC](./LICENSE) © Hanumant Kakde
