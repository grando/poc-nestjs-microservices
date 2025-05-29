import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema({ collection: 'demoData', timestamps: true })
export class DemoData {
    @Prop({ required: true })
    username: string;

    @Prop({ required: true })
    email: string;
}

export type DemoDataDocument = DemoData & Document;
export const DemoDataSchema = SchemaFactory.createForClass(DemoData);
