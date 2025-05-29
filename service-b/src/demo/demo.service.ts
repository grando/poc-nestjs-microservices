import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateDemoDto } from "./dto/create-demo.dto";
import { DemoData, DemoDataDocument } from "./schemas/demo-data.schema";


@Injectable()
export class DemoService {
    private readonly logger = new Logger(DemoService.name);

    constructor(
        @InjectModel('DemoData') private demoDateModel: Model<DemoDataDocument>
    ) {}

    async create(createDemoDto: CreateDemoDto): Promise<DemoDataDocument> {
        try {
            this.logger.log('Saving new demo data', createDemoDto);

            // map the DTO to the schema model
            const toSave = new this.demoDateModel(createDemoDto);

            // save the data to the database
            const savedData = await toSave.save();
            this.logger.log('Demo data saved successfully', savedData);

            return savedData;
        } catch (error) {

            // this exception is thrown and the error will formatted according the RFC guidelines
            throw new InternalServerErrorException(
                {
                    type: 'InternalServerError',
                    title: 'Failed to save demo data in the database',
                    detail: 'An error occurred while saving demo data',
                    originalMessage: error.message,
                }
            );
        }
    }
}