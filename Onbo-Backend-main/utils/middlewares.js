const express = require('express');

const setupMiddlewares = (app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};

module.exports = setupMiddlewares;
