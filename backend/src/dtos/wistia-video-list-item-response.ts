export class WistiaVideoListItemResponse {
  hashed_id: string;
  name: string;
  created: string; // Assuming Wistia returns an ISO string
  thumbnail: {
    url: string;
  };
  tags: { name: string }[];
  duration: number;
}
