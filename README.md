# Storefront backend
This repo contains the backend application for an eCommerce store front. It is a RESTful API.

The database schema and and API route information can be found in the `REQUIREMENTS.md`.

## Installation Instructions
### Dev mode
To install the app's dependencies and use the app in dev mode, run the following: 

`npm i` 

`npm run create-db` runs a script that uses db-migrate to create a new database called `udacity_storefront_backend_test` and runs the migrations to create the tables. This script assumes you have installed `postgres` on your local system and the server is running.

Final step to run project by scripts `npm run start`. API will start on `http://127.0.0.1:3000`, you can use `SampleTestAPIWithPostman.json` and import this file to Postman to test API. 
### Test mode
To install the app's dependencies and use the app in test mode, run the following:

`npm i`

Final step to run project by scripts `npm run test`.

### Running Ports
The application runs on port `3000` with database on `5432`.

### Environment variables 
To satisfy Udacity requirements, the following environment variable are needed.
```
NODE_ENV=dev

POSTGRES_HOST=127.0.0.1
POSTGRES_DB=udacity_storefront_backend
POSTGRES_TEST_DB=udacity_storefront_backend_test
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password
ENV=dev

BCRYPT_PASSWORD=udacity20230404
SALT_ROUNDS=9
TOKEN_KEY=secret
```
### Set up Database
You should install postgres database and running it in 5432 port.

### Migrate Database
Open terminal in root project and run this command `npm run create-db`
