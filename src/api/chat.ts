import type { StreamingChatOptions } from "../interface.js";

/**
 * Handles the low-level connection to the SSE streaming endpoint.
 * This is an internal function used by the ChatSDK class.
 *
 * NOTE: This implementation uses the browser-native `EventSource` API.
 * For use in a Node.js environment, you would need to install a polyfill
 * like the 'eventsource' package.
 */
export function startChatStream(
  baseUrl: string,
  query: string,
  options: StreamingChatOptions
): EventSource {
  const { onToken, onEnd, onError } = options;
  const url = `${baseUrl}/chat/stream?q=${encodeURIComponent(query)}`;

  const eventSource = new EventSource(url);

  // Listener for the main data messages
  eventSource.onmessage = (event) => {
    const token = event.data;
    onToken(token);
  };

  // Listener for the custom 'end' event from the server
  eventSource.addEventListener("end", () => {
    console.log("Stream ended by server.");
    if (onEnd) {
      onEnd();
    }
    eventSource.close();
  });

  // Listener for any errors
  eventSource.onerror = (errEvent: any) => {
    console.error("EventSource failed:", errEvent);
    const errorMessage = errEvent.data
      ? errEvent.data
      : "An unknown streaming error occurred.";
    if (onError) {
      onError(new Error(errorMessage));
    }
    eventSource.close();
  };

  return eventSource;
}
