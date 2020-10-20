## Minha Receita API
- [Overview](#overview)
- [Requirements](#requirements)
- [Installation](#installation)
- [Tests](#tests)
- [Run server](#run-server)

## Overview

API built on Node.JS. It's RESTful API for a Web Application.

## Requirements

- **[Node.js](https://www.nodejs.org/)** (supported versions: 10.x.x)
- **[MYSQL](https://www.mysql.com/)**

## Installation

### MySQL Configuration
1. create "minhareceitaAPI" database
2. create "minhareceitaAPI_TEST" databse

### Env variables
1. create `.env` file like `.env.example`
2. change in this file settings for a authentication to locally database

### Install all dependencies
```bash
$ npm install 
```

## Tests
you can run tests for
```bash
$ npm run test
```

## Run server
```bash
$ npm start
```
