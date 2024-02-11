import express from 'express';
import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import https from 'https';
import fs from 'fs/promises';
import { get_stat } from './router/get_stat';
import { get_weapon } from './router/get_weapon';
import { get_vehicle } from './router/get_vehicle';
import { get_playerinfo } from './router/get_playerinfo';
import { get_pid_from_name } from './router/get_pid_from_name';
import { get_name_from_pid } from './router/get_name_from_pid';
import { refresh } from './refresh';
import { get_serverinfo } from './router/get_serverinfo';
import { get_server_details } from './router/get_server_details';

(async () => {
  await refresh();
  const privateKey = await fs.readFile(path.resolve(__dirname, '../assets/cert/skyytor.club.key'), 'utf8');
  const certificate = await fs.readFile(path.resolve(__dirname, '../assets/cert/skyytor.club_bundle.crt'), 'utf8');
  const credentials = { key: privateKey, cert: certificate };

  const app = express();
  const port = 443;
  const httpsServer = https.createServer(credentials, app);

  app.use(express.json()); // 解析 JSON 格式的请求体
  app.use(express.urlencoded({ extended: false }));

  const swaggerDocument = JSON.parse(await fs.readFile(path.resolve(__dirname, '../assets/config/swagger_config.json'), 'utf8'));

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use('/stat', get_stat);
  app.use('/weapon', get_weapon);
  app.use('/vehicle', get_vehicle);
  app.use('/player', get_playerinfo);
  app.use('/serverinfo', get_serverinfo);
  app.use('/get_server_details',get_server_details)

  app.get('/', async (req, res) => {
    console.log('接收到请求');
    res.sendFile(path.join(__dirname, '../service/foo.html'));
  });

  app.use('/stat', get_stat)
  app.use('/weapon', get_weapon)
  app.use('/vehicle', get_vehicle)
  app.use('/player', get_playerinfo)
  app.use('/serverinfo', get_playerinfo)
  app.use('/get_pid_from_name', get_pid_from_name)
  app.use('/get_name_from_pid', get_name_from_pid)

  app.get('/long/:id', async (req, res) => {
    let pic = await fs.readdir(path.resolve(__dirname, '../assets/long'), 'utf8')
    res.sendFile(path.join(__dirname, '../assets/long/' + pic[Math.floor(Math.random() * pic.length)]))
  })
  app.get('/chai/:id', async (req, res) => {
    let pic = await fs.readdir(path.resolve(__dirname, '../assets/chai'), 'utf8')
    res.sendFile(path.join(__dirname, '../assets/chai/' + pic[Math.floor(Math.random() * pic.length)]))
  })
  app.get('/ding/:id', async (req, res) => {
    let pic = await fs.readdir(path.resolve(__dirname, '../assets/ding'), 'utf8')
    res.sendFile(path.join(__dirname, '../assets/ding/' + pic[Math.floor(Math.random() * pic.length)]))
  })
  app.get('/capoo/:id', async (req, res) => {
    let pic = await fs.readdir(path.resolve(__dirname, '../assets/capoo'), 'utf8')
    res.sendFile(path.join(__dirname, '../assets/capoo/' + pic[Math.floor(Math.random() * pic.length)]))
  })
  app.get('/wife/:id', async (req, res) => {
    let pic = await fs.readdir(path.resolve(__dirname, '../assets/wife'), 'utf8')
    res.sendFile(path.join(__dirname, '../assets/wife/' + pic[Math.floor(Math.random() * pic.length)]))
  })

  httpsServer.listen(port, () => console.log(` app listening on port ${port}!`));
})();
