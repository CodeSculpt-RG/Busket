export type PickedMediaKind = 'image' | 'video';

export interface PickedMediaAsset {
  uri: string;
  kind: PickedMediaKind;
  fileName?: string;
  mimeType?: string;
  width?: number;
  height?: number;
  duration?: number;
}

export interface PickMediaResult {
  asset?: PickedMediaAsset;
  error?: string;
  cancelled?: boolean;
}
