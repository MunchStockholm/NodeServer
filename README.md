# Graffiti Wall API

This project provides a simple RESTful API for managing Artwork objects in a MongoDB database.

## Prerequisites

To run this project, you will need:
- Node.js (v14 or newer)
- npm (comes with Node.js)
- MongoDB

## Getting started

Clone the repository and install dependencies:
```
git clone https://github.com/MunchStockholm/NodeServer
npm install
```

## Environment variables

The API uses environment variables to configure the MongoDB connection string.

Create a .env file in the root directory of your project. Add environment-specific variables on new lines in the form of NAME=VALUE. For example:
```
MONGO_USER=<my_mongodb_user>
MONGO_PASSWORD=<my_mongodb_password>
PORT=3001
CORS_ORIGIN="http://localhost:3000/"
```

Replace my_mongodb_user and my_mongodb_password with your actual MongoDB username and password.

## Running the server

To start the server, run the following command:
`npm run dev`

The server will start on localhost at port 3001.

## API Endpoints
- GET /: Retrieve all ArtWork objects.
- GET /:id: Retrieve a single ArtWork object by ID.
- POST /: Create a new ArtWork object.
- PUT /:id: Update an existing ArtWork object.
- DELETE /:id: Delete an ArtWork object.

## Build with
- Node.js
- Express.js
- MongoDB
- dotenv
- morgan
- body-parser

## Author
Caroline Vannebo & Tara Vinje