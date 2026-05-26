export interface DownloadRequest {
  url: string;
  quality: string;
  format?: 'mp3' | 'mp4';
}
