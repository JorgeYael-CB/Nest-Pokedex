import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


// como se ve en la base de datos
@Schema()
export class Pokemon extends Document {

  @Prop({
    unique: true,
    index: true, // el indice sabe donde esta el elemento que buscas.
  })
  name: string;

  @Prop({
    unique: true,
    index: true,
  })
  no: number;

}


export const PokemonSchema = SchemaFactory.createForClass( Pokemon );