<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# GESTIÓN CITAS-TRÁMITES CECOM SAN JUAN DE LURIGANCHO

1. Clonar proyecto e instalar las dependencias
2. `yarn install`
3. Clonar el archivo `.env.template` y renombrarlo a `.env`
4. Cambiar las variables de entorno
5. Levantar la base de datos

```
docker-compose up -d
```

6. Levantar: `yarn start:dev`

7. Ejecutar SEED con los documentos

7.1 Ejecutar los trámites con sus requisitos
```
http://localhost:3000/api/seed/section-types
```
7.2 Ejecutar el horario de los plataformistas
```
http://localhost:3000/api/seed/schedule
```
