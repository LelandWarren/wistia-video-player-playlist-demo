import axios, { AxiosInstance } from "axios";

export class ApiService {
  private static instance: ApiService;
  public http: AxiosInstance;

  private constructor() {
    this.http = axios.create({
      baseURL: process.env.VUE_APP_API_BASE_URL || "http://localhost:3000",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }
}
