const express = require('express');
const promClient = require('prom-client');
const fs = require('fs');
const winston = require('winston');

const app = express();
const port = 3001;
winston.addColors({
  info: 'green',
  error: 'red',
  warn: 'yellow'
});
// Winston Logger
const logFile = '/app/app.log';
const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: logFile })
  ]
});

// Prometheus metric
const counter = new promClient.Counter({
  name: 'my_requests_total',
  help: 'Total number of requests'
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  logger.info('Request to /');
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

// Simple route
app.get('/', (req, res) => {
  counter.inc();
  logger.info('Request to /');
  res.send('Hello World!');
});

app.listen(port, () => {
  logger.info(`App running on port ${port}`);
});
