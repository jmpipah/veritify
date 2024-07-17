import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./database/database.module";
import { environments } from "./settings/environments";
import config from "./settings/config";
import { ConfigModule } from "@nestjs/config";
import * as Joi from "joi";
import { MongooseModule } from "@nestjs/mongoose";
import { Customer, CustomerSchema } from "./entities/customer.entity";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
	imports: [
		ScheduleModule.forRoot(),
		ConfigModule.forRoot({
			envFilePath: environments[process.env.NODE_ENV ?? "prod"],
			load: [config],
			isGlobal: true,
			validationSchema: Joi.object({
				DATABASE_NAME: Joi.string().required(),
				DATABASE_PORT: Joi.number().required(),
			}),
		}),
		MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }]),
		DatabaseModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
