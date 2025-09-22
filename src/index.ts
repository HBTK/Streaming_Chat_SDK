import { startChatStream } from "./api/chat.js";
import type { StreamingChatOptions } from "./interface.js";

/**
 * The main class for the Streaming Chat SDK.
 * Provides a simple interface to connect to your chat API.
 */
export class ChatSDK {
  private baseUrl: string;

  /**
   * Initializes the SDK.
   * @param {object} [options] - Configuration options.
   * @param {string} [options.baseUrl] - The base URL of your chat API.
   */
  constructor(options?: { baseUrl: string }) {
    this.baseUrl = options?.baseUrl || "http://localhost:3000"; // Default or from config
    console.log(`SDK initialized for base URL: ${this.baseUrl}`);
  }

  /**
   * Starts a new chat stream.
   *
   * @param {string} query - The question or prompt to send to the chat agent.
   * @param {StreamingChatOptions} options - An object containing the callback functions
   * for handling stream events (`onToken`, `onEnd`, `onError`).
   * @returns {EventSource} The EventSource instance, allowing you to manually close the
   * connection with `.close()` if needed.
   */
  public stream(query: string, options: StreamingChatOptions): EventSource {
    if (!query) {
      throw new Error("Query cannot be empty.");
    }
    if (!options || typeof options.onToken !== "function") {
      throw new Error("The 'onToken' callback is a required option.");
    }

    return startChatStream(this.baseUrl, query, options);
  }
}
