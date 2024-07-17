import { Controller, Get, Param, Query } from "@nestjs/common";
import { AppService } from "./app.service";
import { Customer } from "./entities/customer.entity";

@Controller("padron")
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get("download")
	async downloadPadron(): Promise<string> {
		await this.appService.downloadFile();

		return "Descarga completada";
	}

	@Get("extract")
	async extractPadron(): Promise<string> {
		return await this.appService.extractZip();
	}

	@Get("import")
	async import(): Promise<string> {
		await this.appService.importFromFile();
		return "Registros importados con exíto";
	}

	@Get("search/:number")
	async getCustomerByRuc(@Param("number") number: string): Promise<any> {
		return this.appService.findCustomerByNumber(number);
	}
}
