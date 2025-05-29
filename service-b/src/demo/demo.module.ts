import { Module } from '@nestjs/common';
import { DemoController } from './demo.controller';
import { DemoService } from './demo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DemoDataSchema } from './schemas/demo-data.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'DemoData', schema: DemoDataSchema }
        ]),
    ],    
    controllers: [DemoController],
    providers: [DemoService],
})

export class DemoModule {}
