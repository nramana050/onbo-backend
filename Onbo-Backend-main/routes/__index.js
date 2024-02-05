const { Router } = require('express');
const fs = require('fs');
const router = new Router();

fs.readdirSync(__dirname)
  .filter((file) => file.indexOf('.') !== 0 && file !== '__index.js' && file.slice(-3) === '.js')
  .forEach((file) => {
    const routesFile = require(`./${file}`);
    router.use(routesFile);
  });

module.exports = router;
