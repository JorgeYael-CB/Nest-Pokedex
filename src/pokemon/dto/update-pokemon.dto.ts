import { PartialType } from '@nestjs/mapped-types';
import { CreatePokemonDto } from './create-pokemon.dto';


// tiene las mismas condiciones con la condicion de que todas son opcionales.
export class UpdatePokemonDto extends PartialType(CreatePokemonDto) {}
