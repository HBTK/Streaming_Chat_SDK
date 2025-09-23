import type { StreamingChatOptions } from "../interface.js";

/**
 * Handles the low-level connection to the SSE streaming endpoint.
 * This is an internal function used by the ChatSDK class.
 *
 * NOTE: This implementation uses the browser-native `EventSource` API.
 * For use in a Node.js environment, you would need to install a polyfill
 * like the 'eventsource' package.
 */
// In src/api/chat.ts

export function startChatStream(
  baseUrl: string,
  query: string,
  options: StreamingChatOptions
): EventSource {
  const { onToken, onEnd, onError } = options;
  const url = `${baseUrl}/chat/stream?q=${encodeURIComponent(query)}`;

  const eventSource = new EventSource(url);

  // This is the main listener for ALL incoming data messages from the server.
  eventSource.onmessage = (event) => {
    try {
      // 1. Parse the incoming data, which we know is a JSON string.
      const data = JSON.parse(event.data);

      // 2. Handle the message based on its 'type'.
      switch (data.type) {
        case "token":
        case "status":
          // For both regular tokens and status updates, call onToken.
          // You could handle them differently if you wanted.
          onToken(data.content);
          break;

        case "end":
          // 3. When the server sends the 'end' message, clean up and close.
          console.log("Stream ended by server.");
          if (onEnd) {
            onEnd();
          }
          eventSource.close();
          break;

        case "error":
          // Handle application-level errors sent by the server
          console.error("Server sent an error:", data.content);
          if (onError) {
            onError(new Error(data.content));
          }
          eventSource.close();
          break;
      }
    } catch (e) {
      console.error("Failed to parse incoming message:", event.data, e);
      if (onError) {
        onError(new Error("Failed to parse server message."));
      }
      eventSource.close();
    }
  };

  // This listener handles network-level errors (e.g., connection lost).
  eventSource.onerror = (errEvent: any) => {
    console.error("EventSource connection failed:", errEvent);
    // We check if the connection is already closed to avoid duplicate errors.
    if (eventSource.readyState === EventSource.CLOSED) {
      return;
    }

    if (onError) {
      onError(new Error("The streaming connection to the server was lost."));
    }
    eventSource.close();
  };

  // We no longer need the separate 'end' event listener,
  // because our onmessage handler now processes the end signal.

  return eventSource;
}
