const fs = require('fs');
// const Koa = require('koa');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
// const koaStatic = require('koa-static');
const request = require('./util/request');
const cache = require('apicache').middleware;

const app = express();
const resolve = file => path.resolve(__dirname, file);

// CORS
app.use((req, res, next) => {
  if (req.path !== '/' && !req.path.includes('.')) {
    res.header({
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Origin': req.headers.origin || '*',
      'Access-Control-Allow-Headers': 'X-Requested-With',
      'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
      'Content-Type': 'application/json; charset=utf-8',
    });
  }
  next();
});

// cookie parser
app.use((req, res, next) => {
  (req.cookies = {}),
    (req.headers.cookie || '').split(/\s*;\s*/).forEach(pair => {
      console.log('pair', pair);
      let crack = pair.indexOf('=');
      if (crack < 1 || crack == pair.length - 1) return;
      req.cookies[decodeURIComponent(pair.slice(0, crack)).trim()] =
        decodeURIComponent(pair.slice(crack + 1)).trim();
    });
  next();
});

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// cache
app.use(cache('2 minutes', (req, res) => res.statusCode === 200));

// 开放dist目录
// app.use(koaStatic(resolve('../dist/client')));
app.use(express.static(resolve('../dist/client')));

// router
const special = {
  'daily_signin.js': '/daily_signin',
  'fm_trash.js': '/fm_trash',
  'personal_fm.js': '/personal_fm',
};

fs.readdirSync(path.join(__dirname, './module'))
  .reverse()
  .forEach(file => {
    if (!/\.js$/i.test(file)) return;
    let route =
      file in special
        ? special[file]
        : '/' + file.replace(/\.js$/i, '').replace(/_/g, '/');
    let question = require(path.join(__dirname, './module', file));

    app.use(route, (req, res) => {
      let query = Object.assign({}, req.query, req.body, {
        cookie: req.cookies,
      });
      question(query, request)
        .then(answer => {
          console.log('[OK]', decodeURIComponent(req.originalUrl));
          res.append('Set-Cookie', answer.cookie);
          res.status(answer.status).send(answer.body);
        })
        .catch(answer => {
          console.log('[ERR]', decodeURIComponent(req.originalUrl));
          if (answer.body.code == '301') answer.body.msg = '需要登录';
          res.append('Set-Cookie', answer.cookie);
          res.status(answer.status).send(answer.body);
        });
    });
  });

const port = process.env.PORT || 3000;

app.server = app.listen(port, () => {
  console.log(`server running @ http://localhost:${port}`);
});

module.exports = app;
