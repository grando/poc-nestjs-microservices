import { 
  Controller, 
  Get, 
  Logger, 
  HttpCode, 
  HttpStatus
} from '@nestjs/common';
import { AppService } from './app.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

const SERVICE_B_URL = process.env.SERVICE_B_URL;
if (!SERVICE_B_URL) {
  console.error("FATAL ERROR: SERVICE_B_URL environment variable is not set!");
}

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService, 
    private readonly httpService: HttpService
  ) {}

  @Get('trigger')
  @HttpCode(HttpStatus.OK)
  async trigger() {
   
    this.logger.log('Received trigger GET request for Service B.');
    
    const results: { call: string; status: number; data: any }[] = [];

    const validPayload = {
      username: "user_ok",
      email: "ok@example.com"
    };

    try {
        this.logger.log(`Calling Service Back with VALID payload: ${SERVICE_B_URL}/demo/create`);

        const responseOk = await firstValueFrom(
          this.httpService.post(`${SERVICE_B_URL}/demo/create`, validPayload, {
            headers: { 'Content-Type': 'application/json' }
          })
        );

        results.push({
            call: "valid",
            status: responseOk.status,
            data: responseOk.data
        });

        this.logger.log("Service Back (Valid Payload) Response Status:", responseOk.status);
        this.logger.log("Service Back (Valid Payload) Response Data:", responseOk.data);

    } catch (errorValid: any) {
        this.logger.log("Error during Service Back call with valid payload:", errorValid.message);
    }

    const invalidPayload = {
        username: "user_ko",
        email: "ok@example"
    };

    try {
        this.logger.log(`Calling Service Back with INVALID payload: ${SERVICE_B_URL}/demo/create`);

        const responseKO = await firstValueFrom(
          this.httpService.post(`${SERVICE_B_URL}/demo/create`, invalidPayload, {
            headers: { 'Content-Type': 'application/json' }
          })
        );

        // note: The service back should return an error for invalid payloads, but we log the response anyway
        this.logger.log("Service Back (INVALID Payload) Response Status:", responseKO.status);
        this.logger.log("Service Back (INVALID Payload) Response Data:", responseKO.data);

    } catch (errorValid: any) {
        results.push({
            call: "invalid",
            status: errorValid.response ? errorValid.response.status : 500,
            data: errorValid.response ? errorValid.response.data : "No response data"
          });
        this.logger.log("Error during Service Back call with INVALID payload:", errorValid.message);
    }

    return {
      message: "Calls to Service B initiated. Check service-a logs for detailed results.",
      results: results
    };
  }
}
