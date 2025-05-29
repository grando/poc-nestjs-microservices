import { Controller, Logger } from '@nestjs/common';
import { CreateDemoDto } from './dto/create-demo.dto';
import { Response } from 'express';
import { 
    Post, 
    Body, 
    HttpCode, 
    HttpStatus,
    Res
} from '@nestjs/common';
import { DemoService } from './demo.service';


@Controller('demo')
export class DemoController {
    private readonly logger = new Logger(DemoController.name);

    constructor(private readonly demoService: DemoService) {}

    @Post('create')
    @HttpCode(HttpStatus.OK)
    async create(
        @Body() createDemoDto: CreateDemoDto,
        @Res() res: Response
    ) {

        this.logger.log('Validation OK. Will save a new document on db with the following data: ', createDemoDto);

        const savedData = await this.demoService.create(createDemoDto);

        const responseBody = {
            statusCode: HttpStatus.CREATED,
            message: 'Item created successfully.',
            data: {
                id: savedData._id,
                username: savedData.username,
                email: savedData.email,
                //createdAt: savedData.createdAt,
                //updatedAt: savedData.updatedAt,
            },
        };

      // Invia la risposta: status 201, header Location, e corpo JSON
        return res.status(HttpStatus.CREATED)
         .json(responseBody);
    } cath(error) {
        this.logger.error('Error while creating demo data', error);
        throw error;        
    }


}