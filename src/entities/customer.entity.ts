import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class Customer extends Document {
	@Prop({ trim: true, index: true })
	ruc: string;

	@Prop({ trim: true, index: true })
	name: string;

	@Prop({ trim: true })
	state: string;

	@Prop({ trim: true })
	condition: string;

	@Prop({ trim: true })
	locate: string;

	@Prop({ trim: true })
	typeStreet: string;

	@Prop({ trim: true })
	nameStreet: string;

	@Prop({ trim: true })
	zoneCode: string;

	@Prop({ trim: true })
	zoneType: string;

	@Prop({ trim: true })
	number: string;

	@Prop({ trim: true })
	inside: string;

	@Prop({ trim: true })
	lote: string;

	@Prop({ trim: true })
	department: string;

	@Prop({ trim: true })
	appleStreet: string;

	@Prop({ trim: true })
	km: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

CustomerSchema.methods.toJSON = function () {
	const { __v, password, isTfaEabled, tfaSecret, ...record } = this.toObject();

	return record;
};

/** Excluimos los campos que no deseamos mostrar */
CustomerSchema.methods.toJSON = function () {
	const { __v, _id, updatedAt, createdAt, ...record } = this.toObject();
	return record;
};
