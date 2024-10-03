// types/wistia.d.ts
declare global {
  interface Window {
    Wistia: {
      embed: (hashedId: string, options?: Record<string, any>) => any;
    };
  }
}

export {};
