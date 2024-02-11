import express from 'express';
import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import https from 'https';
import fs from 'fs/promises';
import { get_stat } from './router/get_stat';
import { get_weapon } from './router/get_weapon';
import { get_vehicle } from './router/get_vehicle';
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

  app.get('/', async (req, res) => {
    console.log('接收到请求');
    res.sendFile(path.join(__dirname, '../service/foo.html'));
  });

  app.use('/stat', get_stat)
  app.use('/weapon', get_weapon)
  app.use('/vehicle', get_vehicle)
  app.use('/serverinfo', get_serverinfo)
  app.use('/get_pid_from_name', get_pid_from_name)
  app.use('/get_name_from_pid', get_name_from_pid)
  app.use('/get_server_details', get_server_details)
  httpsServer.listen(port, () => console.log(` app listening on port ${port}!`));
})();
