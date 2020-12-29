# data-store

A key-value data store that supports Create, Read and Delete with thread-safe functionalities.

## Tech Stack Used

Library: `Node`, `Express`

## Documentation

### Quick Start

Clone the Repo: `git clone https://github.com/theWellHopeErr/data-store.git`

Change Directory: `cd data-store`

### Install Dependencies

Using npm: `npm i`

### Setup env

Create .env file with following

    - PORT=3000
    - DATA_STORE_PATH=.

`DATA_STORE_PATH` is the path for the `data-store.json` file.

### Run App

Run App: `npm start`

## Endpoints

### POST `/create`

To append key-value pair to data-store file

`{ key: string, value: JSON, ttl: integer }`

`ttl` is optional


### GET `/read`

To read value stored in that key

Format: `GET /read?key=string`


### DELETE `/delete`

To delete a key-value pair from ata-store
`{ key: string }`
