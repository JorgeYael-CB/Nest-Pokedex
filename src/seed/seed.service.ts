import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke.response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';



@Injectable()
export class SeedService {

  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,
    private readonly httpAdapter: AxiosAdapter,
  ){}


  async executeSeed(){
    const data = await this.httpAdapter.get<PokeResponse>(`https://pokeapi.co/api/v2/pokemon?limit=650&offset=0`);
    const pokemonToInsert: {name:string, no:number}[] = [];

    // Borramos los elementos previos
    await this.pokemonModel.deleteMany(); // delete * from pokemon

    data.results.forEach( ({name, url}) => {
      const segments = url.split('/');
      const no:number = +segments[ segments.length - 2 ];

      pokemonToInsert.push({name, no});
    });

    // Insertamos todas
    await this.pokemonModel.insertMany(pokemonToInsert); // insert into pokemons (name, no)

    return 'SEED executed';
  };

};
