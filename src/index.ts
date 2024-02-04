import express from 'express';
import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { get_stat } from './router/get_stat';
import { get_weapon } from './router/get_weapon';
import { get_vehicle } from './router/get_vehicle';
import { get_playerinfo } from './router/get_playerinfo';
import { refresh } from './refresh';

const app = express();
const port = 2789;
app.use(express.json()) // 解析 JSON 格式的请求体
app.use(express.urlencoded({ extended: false }))

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "战地 API",
      description: "暴露所有接口",
      version: "1.0.0",
      contact: {
        name: "这是contact name",
      },
      servers: ["http://localhost:5000"],
    },
  },

  apis: ["./lib/router/*.js"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/stat', get_stat)
app.use('/weapon', get_weapon)
app.use('/vehicle', get_vehicle)
app.use('/player', get_playerinfo)
app.use('/serverinfo', get_playerinfo)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../assets/long.jpg'))
})

app.listen(port, () => console.log(` app listening on http://localhost:${port} !`));


refresh()
