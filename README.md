# Goal Tracker

## Description
Goal Tracker is a Node.JS/Express application for tracking personal goals.

## Useage
* Install Node.JS
* Run `npm install` to get dependencies
* Create an .env file in the root project folder with the information below
```
DB_NAME='xxx'
DB_PASSWORD='xxx'
DB_USER='xxx'
```
* Install Postgres on your server
* Run `CREATE DATABASE <DB_NAME_FROM_ENV_FILE>;` to create an empty database
* Run `npm start` to start the server
* Interact with different API calls in your browser or API tool such as Postman or Insomnia