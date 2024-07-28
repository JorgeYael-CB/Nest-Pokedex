import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name) // para que se puedan injectar modelos
    private readonly pokemonModel: Model<Pokemon>,
  ){}


  async create(createPokemonDto: CreatePokemonDto) {
    try {
      const pokemon = await this.pokemonModel.create({
        ...createPokemonDto,
        name: createPokemonDto.name.toLowerCase().trim(),
      });

      return pokemon;
    } catch (error: any) {
      if( error.code === 11000 ){
        throw new BadRequestException(`Pokemon exists in db ${JSON.stringify( error.keyValue )}`);
      }

      console.log(error);
      throw new InternalServerErrorException(`Can't create Pokemon.`);
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOneBy(term: string) {
    let pokemon: Pokemon;

    if( !isNaN(+term) ){
      pokemon = await this.pokemonModel.findOne({no: term});
    }

    // Mongo ID
    if( !pokemon && isValidObjectId(term) ){
      pokemon = await this.pokemonModel.findById(term);
    }

    // Name
    if( !pokemon ){
      pokemon = await this.pokemonModel.findOne({name: term});
    }

    if( !pokemon ) throw new NotFoundException(`Pokemon with id, name or no: ${term} not found.`);
    return pokemon;
  }

  update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return `This action updates a #${id} pokemon`;
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
