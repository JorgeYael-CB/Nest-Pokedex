<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo

1. Clonar el repositorio
2. Ejecutar
```
npm i
```
3. Tener Nest CLI instalado
```
npm i -g @nestjs/cli
```

4. Levantar la base de datos usando Docker
```
docker-compose up -d
```

5. Reconstruir la base de datos con la semilla
```
localhost:3000/api/v2/seed
```

6. renombrar el archivo .env.template a .env y agregar las variables de entorno
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/example-db
DEFAULT_LIMIT=5
```


## Stack usado
* TypeScript
* MongoDB
* Nestjs