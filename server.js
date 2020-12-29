const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotEnv = require("dotenv");
const fs = require("fs");

const { getFileSizeInGB, getJSONSizeInKB } = require("./helpers");

// Initialising variables
const app = express();
dotEnv.config();
app.use(bodyParser.json());
var objectConstructor = {}.constructor;
var stringConstructor = "".constructor;
const FILE_PATH = `${process.env.DATA_STORE_PATH}/data-store.json`;
const PORT = process.env.PORT || 8080;

// Morgan log configuration
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

//Endpoint for POST /create
//To append key-value pair to data-store file
/*******************************
  req.body Format
  {
    key: string,
    value: JSON object,
    ttl: integer, // optional
  }
********************************/
app.post("/create", (req, res) => {
  const { key, value, ttl } = req.body;

  if (!key || !value) {
    res.status(400).send({
      message: "Bad Request Body.",
    });
    return;
  }

  // Check whether key is a string
  if (key.constructor !== stringConstructor) {
    res.status(400).send({
      message: "Key should be a string.",
    });
    return;
  }

  // Check for key length (<= 32 characters)
  if (key.length > 32) {
    res.status(400).send({
      message: "Key String is too long (>32 characters).",
    });
    return;
  }

  // Check whether value is an JSON object
  if (value.constructor !== objectConstructor) {
    res.status(400).send({
      message: "Value object should be an JSON object.",
    });
    return;
  }

  // Check whether ttl is an integer
  if (!ttl ^ isNaN(parseInt(ttl))) {
    res.status(400).send({
      message: "ttl should be an integer.",
    });
    return;
  }

  // Check for value size (<= 16KB)
  if (getJSONSizeInKB(value) > 16) {
    res.status(400).send({
      message: "Value object is too big (>16KB).",
    });
    return;
  }

  // Check for file size (<= 1GB)
  if (getFileSizeInGB(FILE_PATH) > 1) {
    res.status(400).send({
      message: "Data Store size exceeded 1GB.",
    });
    return;
  }

  var data = {};
  if (fs.existsSync(FILE_PATH)) {
    data = require(FILE_PATH);
    if (data.hasOwnProperty(key)) {
      res.status(400).send({
        message: "Key already exists",
      });
      return;
    }
  }
  data[key] = {
    value,
    ttl: ttl * 1000,
    createdAt: Date.now(),
  };

  fs.writeFile(FILE_PATH, JSON.stringify(data), (e) => {
    if (e) {
      return console.log(e);
    }
    res.status(201).send({
      message: `Data Appended in Data Store`,
    });
  });
});

//Endpoint for GET /read
//To read value stored in that key
/*******************************
  Format: GET /read?key=string
********************************/
app.get("/read", (req, res) => {
  const { key } = req.query;

  if (!key) {
    res.status(400).send({
      message: "Bad Request Query Param.",
    });
    return;
  }

  if (fs.existsSync(FILE_PATH)) {
    const data = require(FILE_PATH);
    if (data.hasOwnProperty(key)) {
      const { value, ttl, createdAt } = data[key];
      //Check if value is expired or not
      if ((ttl === null) ^ (Date.now() - createdAt < ttl)) {
        res.status(200).send({
          key,
          value,
        });
        return;
      } else {
        res.status(401).send({
          message: "Key expired",
        });
        return;
      }
    }
  }
  res.status(404).send({
    message: "Key not found",
  });
});

//Endpoint for DELETE /delete
//To delete a key-value pair from data-store
/*******************************
  req.body Format
  {
    key: string,
  }
********************************/
app.delete("/delete", (req, res) => {
  const { key } = req.body;

  if (!key) {
    res.status(400).send({
      message: "Bad Request Body.",
    });
    return;
  }

  if (fs.existsSync(FILE_PATH)) {
    const data = require(FILE_PATH);
    if (data.hasOwnProperty(key)) {
      const { value, ttl, createdAt } = data[key];
      //Check if value is expired or not
      if ((ttl === null) ^ (Date.now() - createdAt < ttl)) {
        delete data[key];
        fs.writeFile(FILE_PATH, JSON.stringify(data), (e) => {
          if (e) {
            return console.log(e);
          }
          res.status(201).send({
            message: `Data Removed from Data Store`,
          });
        });
        return;
      }
    }
  }
  res.status(404).send({
    message: "Key not found",
  });
});

// Listening at PORT
app.listen(PORT, () => {
  console.log(`Listening at PORT: ${PORT}`);
});
