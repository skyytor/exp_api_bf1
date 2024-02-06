import express from 'express';
import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import fs from 'fs/promises'
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

app.get('/long/:id', async (req, res) => {

    let pic = await fs.readdir(path.resolve(__dirname, '../assets/long'), 'utf8')
    res.sendFile(path.join(__dirname, '../assets/long/' + pic[Math.floor(Math.random() * pic.length)]))
})
app.get('/chai/:id', async (req, res) => {

    let pic = await fs.readdir(path.resolve(__dirname, '../assets/chai'), 'utf8')
    res.sendFile(path.join(__dirname, '../assets/chai/' + pic[Math.floor(Math.random() *  pic.length)]))
})
app.get('/ding/:id', async (req, res) => {

    let pic = await fs.readdir(path.resolve(__dirname, '../assets/ding'), 'utf8')
    res.sendFile(path.join(__dirname, '../assets/ding/' + pic[Math.floor(Math.random() *  pic.length)]))
})
app.get('/capoo/:id', async (req, res) => {

    let pic = await fs.readdir(path.resolve(__dirname, '../assets/capoo'), 'utf8')
    res.sendFile(path.join(__dirname, '../assets/capoo/' + pic[Math.floor(Math.random() *  pic.length)]))
})
app.get('/wife/:id', async (req, res) => {

    let pic = await fs.readdir(path.resolve(__dirname, '../assets/wife'), 'utf8')
    res.sendFile(path.join(__dirname, '../assets/wife/' + pic[Math.floor(Math.random() *  pic.length)]))
})


app.listen(port, () => console.log(` app listening on port ${port}!`));