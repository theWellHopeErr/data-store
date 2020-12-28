// Returns Size of JSON object in KB
const getJSONSizeInKB = (obj) => {
  let bytes = new TextEncoder().encode(JSON.stringify(obj)).length;
  return bytes / 1024;
};

// Returns Size of File in GB
const getFileSizeInGB = (FILE_PATH) => {
  const fs = require("fs");

  if (!fs.existsSync(FILE_PATH)) {
    return 0;
  }

  var stats = fs.statSync(FILE_PATH);
  var fileSizeInBytes = stats.size;
  return fileSizeInBytes / 1024 ** 9;
};

module.exports = { getJSONSizeInKB, getFileSizeInGB };
