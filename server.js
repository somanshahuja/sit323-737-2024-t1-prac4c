const express = require('express');
const app = express();
const res = require("express/lib/response");
const winston = require('winston');
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'calculate-service' },
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
  });
  
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple(),
    }));
  }

const add = (n1, n2) => n1 + n2;
const sub = (n1, n2) => n1 - n2;
const multiply = (n1, n2) => n1 * n2;
const divide = (n1, n2) => n1 / n2;
const exponentiation = (n1, n2) => Math.pow(n1, n2);
const squareRoot = (n) => Math.sqrt(n);
const modulo = (n1, n2) => n1 % n2;

app.get("/add", (req, res) => handleOperation(req, res, add));
app.get("/sub", (req, res) => handleOperation(req, res, sub));
app.get("/multiply", (req, res) => handleOperation(req, res, multiply));
app.get("/divide", (req, res) => handleOperation(req, res, divide));
app.get("/exponentiation", (req, res) => handleOperation(req, res, exponentiation));
app.get("/square-root", (req, res) => handleSquareRoot(req, res));
app.get("/modulo", (req, res) => handleOperation(req, res, modulo));

const handleOperation = (req, res, operation) => {
    try {
        const n1 = parseFloat(req.query.n1);
        const n2 = parseFloat(req.query.n2);
        if (isNaN(n1) || isNaN(n2)) {
            logger.error("Invalid input");
            throw new Error("Invalid input");
        }
        logger.info(`Parameters ${n1} and ${n2} received`);
        const result = operation(n1, n2);
        res.status(200).json({ statuscode: 200, data: result });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ statuscode: 500, msg: error.toString() });
    }
};

const handleSquareRoot = (req, res) => {
    try {
        const n = parseFloat(req.query.n);
        if (isNaN(n)) {
            logger.error("Invalid input");
            throw new Error("Invalid input");
        }
        logger.info(`Parameter ${n} received for square root`);
        const result = squareRoot(n);
        res.status(200).json({ statuscode: 200, data: result });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ statuscode: 500, msg: error.toString() });
    }
};

const port = 3040;
app.listen(port, () => {
    console.log("Server is listening on port " + port);
});

app.get('/',function(req,res) {
    res.render('index.html');
});
