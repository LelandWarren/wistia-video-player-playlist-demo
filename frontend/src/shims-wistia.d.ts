interface WistiaVideo {
  play: () => void;
  bind: (event: string, callback: () => void) => void;
  unbind: (event: string) => void;
  replaceWith: (hashedId: string, options: { transition: string }) => void;
}

interface WistiaConfig {
  id: string;
  options?: any;
  onReady?: (video: WistiaVideo) => void;
}

interface WistiaQueue extends Array<WistiaConfig> {
  push: (config: WistiaConfig) => void;
}

interface Window {
  _wq: WistiaQueue;
}
