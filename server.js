import express, * as bodyParser from "express";
import router from "./router.js";
import cors from "cors";

const express = require('express');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
const server = app.listen(3001, () => {
    console.log(`Started on http://localhost:${server.address().port}`);
});

// Add CSRF protection middleware
app.use(cookieParser());
app.use(bodyParser.json());
app.use(csrf({ cookie: true }));

// Generate CSRF token and include it in every response
app.use((req, res, next) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    next();
});

app.use('', router);
