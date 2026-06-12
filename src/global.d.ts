export {};

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        switchInlineQuery: (query: string, chat_types: string[]) => void;
      };
    };
  }
}