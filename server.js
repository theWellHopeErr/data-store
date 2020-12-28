const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotEnv = require("dotenv");

const app = express();
dotEnv.config();
app.use(bodyParser.json());
const PORT = process.env.PORT || 8080;

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

app.listen(PORT, () => {
  console.log(`Listening at PORT: ${PORT}`);
});
