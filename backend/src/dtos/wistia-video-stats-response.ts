export class WistiaVideoStatsResponse {
  plays: number;

  constructor(partial: Partial<WistiaVideoStatsResponse>) {
    Object.assign(this, partial);
  }
}
