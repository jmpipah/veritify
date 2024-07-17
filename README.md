<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Padrón Reducido SUNAT

Este proyecto en NestJS descarga, descomprime e importa toda la data del padrón reducido de SUNAT, permitiendo la consulta o búsqueda de RUC o DNI.

## Requisitos

- Node.js (>= 14.x)
- Docker
- MongoDB (opcional si se usa Docker para MongoDB)

## Instalación

1. Clona el repositorio (Si les pide un token me confirman y les paso):

   ```bash
   git clone https://github.com/jmpipah/veritify.git
   cd padron-reducido-sunat
   ```

2. Instala las dependencias (solo si lo usaras localmente o tambien puedes usarlo en docker):

   ```bash
   npm install
   ```

3. Configura las variables de entorno. Crea un archivo `.prod.env` en la raíz del proyecto y agrega las siguientes variables:

   ```env
    DB_CONNECTION=mongodb
    DB_USERNAME=admin
    DB_PASSWORD=AdminAdmin
    HOST_NAME=127.0.0.1
    DATABASE_NAME=veritify
    DATABASE_PORT=27017
    PARAMS=readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false
    PORT=5000
    HOST=localhost
   ```

## Uso con Docker

1. Asegúrate de que no tienes una instancia de MongoDB corriendo en el puerto `27017` en tu máquina local. Si tienes MongoDB instalado localmente, puedes detener el servicio o cambiar el puerto en el archivo `docker-compose.yml`.

2. Inicia los servicios con Docker Compose:

   ```bash
   docker-compose up -d
   ```

   Esto levantará tanto la aplicación NestJS como MongoDB. MongoDB estará disponible en el puerto `27017`.

## Endpoints

### Buscar por número (RUC o DNI)

- **URL:** `/search/:number`
- **Método:** `GET`
- **Parámetros URL:**
  - `number` (string): El número de RUC o DNI a buscar.
- **Ejemplo de solicitud:**

  ```bash
  curl http://localhost:5000/search/10441054209
  ```

## Desarrollo

Para contribuir a este proyecto:

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature-nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -am 'Añadir nueva funcionalidad'`).
4. Sube tus cambios (`git push origin feature-nueva-funcionalidad`).
5. Abre un Pull Request.

## Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.
