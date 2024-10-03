export class WistiaVideoDetailResponse {
  hashed_id: string;
  name: string;
  created: string;
  thumbnail: { url: string };
  tags: { name: string }[]; // Tag information

  constructor(partial: Partial<WistiaVideoDetailResponse>) {
    Object.assign(this, partial);
  }
}
