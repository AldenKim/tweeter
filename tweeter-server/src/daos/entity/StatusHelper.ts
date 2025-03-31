export class StatusHelper {
  handle: string;
  timestamp: number;
  post: string;

  constructor(
    handle: string,
    timestamp: number,
    post: string,
  ) {
    this.handle = handle;
    this.timestamp = timestamp;
    this.post = post;
  }
}