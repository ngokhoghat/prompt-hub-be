import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
@Injectable()
export class AuthService {
  constructor(private httpService: HttpService) { }

  async validateUser(token: string) {
    this.httpService.axiosRef.defaults.headers["Authorization"] = token;
    const response = await lastValueFrom(this.httpService.get(process.env.AUTH_VERIFY_USER_URL || ""));
    return response?.data?.data;
  }
}