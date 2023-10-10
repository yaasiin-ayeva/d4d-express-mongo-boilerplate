# d4d-express-mongo-boilerplate

Dev4Diversity Express API Boilerplate is aserver side element to handle apis. Runs with MongoDB database, Use Mongoose, Passport authentication & Custom seeders.

# Steps to run this project:

1. Run :

```bash
npm install
```

2. Setup your environment configurations after creating an .env file at the root of the project with :

```bash
cp .env.example .env
```

3. Finally Run :

```bash
npm run dev
```

## Project structure

This project's architecture is based on this rest api boilerplate https://github.com/yaasiin-ayeva/d4d-express-mongo-boilerplate

You can check the link above for more information.

| Location              | Content                                            |
| --------------------- | -------------------------------------------------- |
| `/src/config`         | DB, Passport, Loggers & environment Configurations |
| `/src/controllers`    | Controllers functions for routes                   |
| `/src/middlewares`    | Middlewares for controllers                        |
| `/src/models`         | Project Models written with Mongoose schema        |
| `/src/models/plugins` | Plugins for mongoose models                        |
| `/src/services`       | Tier services for project                          |
| `/src/routes`         | Contains Routes for each version of the API        |
| `/src/seeders`        | Seeders for some models                            |
| `/src/utils`          | Exported Utils functions                           |
| `/src/validation`     | Endpoints & Mongoose validators & helpers          |
| `/src/index.ts`       | API Entry Point with server configurations         |

Please kindly respect this project architecture in your code maintenance and update documentation in case of any changes.

## IMPORTANT

Check `/postman` folder to get exported postman collection

[link-author]: https://github.com/yaasiin-ayeva

## TODO

- [ ] Write Unit tests
