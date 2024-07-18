import { Injectable, NotFoundException } from "@nestjs/common";
import axios from "axios";
import * as unzipper from "unzipper";
import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

import { Customer } from "./entities/customer.entity";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class AppService {
	constructor(@InjectModel(Customer.name) private customerModel: Model<Customer>) {}

	@Cron("0 0 2 * * *") //Ejecutara el servicio todos los dias a las 2:00 a.m.
	async downloadFile(): Promise<void> {
		const url = "http://www2.sunat.gob.pe/padron_reducido_ruc.zip";
		const downloadFolder = path.join(__dirname, "..", "assets", "downloads"); // Ruta absoluta al directorio downloads

		try {
			const response = await axios.get(url, {
				responseType: "stream",
			});

			const filePath = path.join(downloadFolder, "padron_reducido_ruc.zip");
			const writer = fs.createWriteStream(filePath);

			response.data.pipe(writer);

			return new Promise((resolve, reject) => {
				writer.on("finish", resolve);
				writer.on("error", reject);
			});
		} catch (error) {
			throw new Error(`No se pudo descargar el archivo: ${error.message}`);
		}
	}

	@Cron("0 0 3 * * *") //Ejecutara el servicio todos los dias a las 3:00 a.m.
	async extractZip(): Promise<string> {
		try {
			const zipFilePath = path.join(__dirname, "..", "assets", "downloads", "padron_reducido_ruc.zip");
			const extractFolder = path.join(__dirname, "..", "assets", "downloads");

			// Verificamos si el archivo existe
			if (!fs.existsSync(zipFilePath)) {
				throw new NotFoundException(`El archivo no existe`);
			}

			await fs
				.createReadStream(zipFilePath)
				.pipe(unzipper.Extract({ path: extractFolder }))
				.promise();

			// Eliminar el archivo ZIP después de la extracción
			fs.unlinkSync(zipFilePath);

			return "Extracción completada";
		} catch (error) {
			throw new Error(`No se pudo extraer el archivo: ${error.message}`);
		}
	}

	@Cron("0 0 4 * * *") //Ejecutara el servicio todos los dias a las 4:00 a.m.
	async importFromFile(): Promise<void> {
		const filePath = path.join(__dirname, "..", "assets", "downloads", "padron_reducido_ruc.txt");

		const fileStream = fs.createReadStream(filePath);

		await this.customerModel.deleteMany({});

		const rl = readline.createInterface({
			input: fileStream,
			crlfDelay: Infinity,
		});

		let counter = 0;
		let isFirstLine = true;
		const bulkOperations = [];
		const batchSize = 1000000; // Tamaño del lote
		const startTime = new Date().getTime(); // Capturamos el tiempo de inicio

		for await (const line of rl) {
			if (isFirstLine) {
				isFirstLine = false;
				continue; // Skip header
			}

			const [
				ruc,
				name,
				state,
				condition,
				locate,
				typeStreet,
				nameStreet,
				zoneCode,
				zoneType,
				number,
				inside,
				lote,
				department,
				appleStreet,
				km,
			] = line.split("|");

			bulkOperations.push({
				updateOne: {
					filter: { ruc },
					update: {
						ruc,
						name,
						state,
						condition,
						locate,
						typeStreet,
						nameStreet,
						zoneCode,
						zoneType,
						number,
						inside,
						lote,
						department,
						appleStreet,
						km,
					},
					upsert: true,
				},
			});

			if (bulkOperations.length >= batchSize) {
				await this.customerModel.bulkWrite(bulkOperations);
				const endTimeBulk = new Date().getTime(); // Capturamos el tiempo de finalización
				const durationBulk = (endTimeBulk - startTime) / 1000; // Calculamos la duración en segundos
				console.log(`Records ${durationBulk} processed in  seconds with ${counter} records.`);
				bulkOperations.length = 0; // Clear batch
			}

			counter++;
		}

		if (bulkOperations.length > 0) {
			await this.customerModel.bulkWrite(bulkOperations);
		}

		const endTime = new Date().getTime(); // Capturamos el tiempo de finalización
		const duration = (endTime - startTime) / 1000; // Calculamos la duración en segundos

		console.log(`File processed in ${duration} seconds with ${counter} records.`);
	}

	async findCustomerByNumber(number: string): Promise<any> {
		const filter = number.length > 8 ? { ruc: number } : { ruc: { $regex: number, $options: "i" } };

		const customer = await this.customerModel.findOne(filter).exec();

		if (!customer) {
			throw new NotFoundException(`Customer with value ${number} not found`);
		}
		if (number.length > 8) {
			return customer;
		} else {
			return {
				dni: number,
				name: customer.name,
			};
		}
	}
}
