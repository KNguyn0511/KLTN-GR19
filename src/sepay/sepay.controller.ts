import { Controller, Post, Body, Headers, Query, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { SepayService } from './sepay.service';
import { ConfigService } from '@nestjs/config';

@Controller('sepay')
export class SepayController {
  constructor(
    private readonly sepayService: SepayService,
    private readonly configService: ConfigService,
  ) {}

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Headers('Authorization') authorization: string,
    @Query('apiKey') queryApiKey: string,
    @Body() payload: any,
  ) {
    const apiKey = this.configService.get<string>('SEPAY_API_KEY');
    
    // Validate API Key
    if (apiKey) {
      const expectedToken = `Apikey ${apiKey}`;
      const expectedBearer = `Bearer ${apiKey}`;
      
      if (authorization !== expectedToken && authorization !== expectedBearer && authorization !== apiKey && queryApiKey !== apiKey) {
        throw new UnauthorizedException('Invalid API Key');
      }
    }

    // Process the webhook payload
    await this.sepayService.processWebhook(payload);

    // Sepay requires a success response
    return { success: true };
  }
}
