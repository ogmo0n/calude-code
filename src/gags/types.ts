export interface GagResult {
  forwardPrompt?: string;
}

export interface GagProps {
  onDone: (r?: GagResult) => void;
}
