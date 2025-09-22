/**
 * Defines the structure for the streaming options object.
 */
export interface StreamingChatOptions {
  /**
   * Required. This callback is triggered for each data chunk (token)
   * received from the stream.
   * @param {string} token - The piece of text from the stream.
   */
  onToken: (token: string) => void;

  /**
   * Optional. This callback is triggered when the stream is successfully
   * completed by the server.
   */
  onEnd?: () => void;

  /**
   * Optional. This callback is triggered when an error occurs during
   * the stream.
   * @param {Error} error - The error object.
   */
  onError?: (error: Error) => void;
}
