import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { MongooseModuleOptions, MongooseOptionsFactory } from "@nestjs/mongoose";
import config from "src/settings/config";

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
	constructor(
		@Inject(config.KEY)
		private readonly configService: ConfigType<typeof config>,
	) {}

	async createMongooseOptions(): Promise<MongooseModuleOptions> {
		const { connection, hostname, user, password, port, params, dbname } = this.configService.mongo;

		return {
			uri: `${connection}://${hostname}:${port}/${dbname}?${params}`,
		};
	}
}
