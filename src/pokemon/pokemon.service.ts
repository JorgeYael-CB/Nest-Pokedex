import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
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


  private handleExceptions(error:any){
    if( error.code === 11000 ){
      throw new BadRequestException(`Dupliacted key: ${JSON.stringify( error.keyValue )}`);
    }

    console.log(error);
    throw new InternalServerErrorException('Internal server error')
  }


  async create(createPokemonDto: CreatePokemonDto) {
    try {
      const pokemon = await this.pokemonModel.create({
        ...createPokemonDto,
        name: createPokemonDto.name.toLowerCase().trim(),
      });

      return pokemon;
    } catch (error: any) {
      this.handleExceptions(error);
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


  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOneBy(term);

    try {
      if( updatePokemonDto.name ){
        updatePokemonDto.name = updatePokemonDto.name.toLowerCase().trim();
      }

      await pokemon.updateOne(updatePokemonDto);
      return {...pokemon.toJSON(), updatePokemonDto};
    } catch (error) {
      this.handleExceptions(error);
    }
  }


  async remove(id: string) {
    const pokemon = await this.pokemonModel.findByIdAndDelete( id );
    if( !pokemon )
      throw new BadRequestException(`Pokemon with id: ${id} not found.`);

    return pokemon;
  }

}
