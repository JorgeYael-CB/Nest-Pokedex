import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, Query } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';



@Injectable()
export class PokemonService {

  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,
  ){};


  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      const pokemon = await this.pokemonModel.create( createPokemonDto );
      return pokemon;

    } catch (error) {
      this.handleExceptions(error);
    }
  };


  findAll( paginationDto: PaginationDto ) {
    return this.pokemonModel.find()
      .limit( paginationDto.limit ?? 10 )
      .skip( paginationDto.offset ?? 0 )
      .sort({
        no: 1,
      })
      .select('-__v');
  };


  async findOne(term: string) {
    let pokemon:Pokemon;

    if( +term ){
      pokemon = await this.pokemonModel.findOne({no: term});
    };

    // Mongo ID
    if( !pokemon && isValidObjectId(term) ){
      pokemon = await this.pokemonModel.findById(term);
    };

    // Name
    if( !pokemon ){
      pokemon = await this.pokemonModel.findOne({name: term.trim().toLowerCase()});
    };

    if( !pokemon )
      throw new NotFoundException(`Pokemon '${term}' not found`);

    return pokemon;
  };


  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      const pokemon = await this.findOne(term);

      if( updatePokemonDto.name ){
        updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
      };

      await pokemon.updateOne( updatePokemonDto, {new: true});
      return {...pokemon.toJSON(), ...updatePokemonDto};

    } catch (error) {
      this.handleExceptions(error);
    }
  };


  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();
    const result = await this.pokemonModel.findByIdAndDelete(id);

    if( !result ){
      throw new BadRequestException(`Pokemon with id: '${id}' not found`);
    };

    return result;
  };


  private handleExceptions( error:any ){
      if( error.code && error.code === 11000 ){
        throw new BadRequestException(`Pokemon already exists: '${JSON.stringify(error.keyValue)}'`);
      };

      throw new InternalServerErrorException(`Oops! Can't updated Pokemon - Check server logs`);
  };
};