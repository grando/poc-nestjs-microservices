import { Controller, Logger } from '@nestjs/common';
import { CreateDemoDto } from './dto/create-demo-dto';
import { receiveMessageOnPort } from 'worker_threads';
import { Post, Body, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('demo')
export class DemoController {
    private readonly logger = new Logger(DemoController.name);

    @Post('create')
    @HttpCode(HttpStatus.OK)
    async create(@Body() createDemoDto: CreateDemoDto) {

        this.logger.log('Creating a new demo entry', createDemoDto);
        
        return {
            status: 'success',
            message: 'Demo entry created successfully',
            receivedData: createDemoDto,
        }
    }


}