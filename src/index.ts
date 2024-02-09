import express from 'express';
import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import https from 'https';
import fs from 'fs';
import { get_stat } from './router/get_stat';
import { get_weapon } from './router/get_weapon';
import { get_vehicle } from './router/get_vehicle';
import { get_playerinfo } from './router/get_playerinfo';

const privateKey = fs.readFileSync(path.resolve(__dirname, '../assets/cert/skyytor.club.key'), 'utf8');
const certificate = fs.readFileSync(path.resolve(__dirname, '../assets/cert/skyytor.club_bundle.crt'), 'utf8');
const credentials = { key: privateKey, cert: certificate };

const app = express();
const port = 443;
const httpsServer = https.createServer(credentials, app);

app.use(express.json()); // 解析 JSON 格式的请求体
app.use(express.urlencoded({ extended: false }));

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "战地 API",
      description: "暴露所有接口",
      version: "1.0.0",
      contact: {
        name: "这是contact name",
      },
    },
    servers: ["https://www.skyytor.club:443"],
  },
  apis: ["./lib/router/*.js"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/stat', get_stat);
app.use('/weapon', get_weapon);
app.use('/vehicle', get_vehicle);
app.use('/player', get_playerinfo);
app.use('/serverinfo', get_playerinfo);

app.get('/long', async (req, res) => {
  res.sendFile(path.join(__dirname, '../assets/long/2.jpg'));
});

app.get('/chai', async (req, res) => {
  res.sendFile(path.join(__dirname, '../assets/chai/4.jpg'));
});

app.get('/ding', async (req, res) => {
  res.sendFile(path.join(__dirname, '../assets/ding/47.jpg'));
});

app.get('/', async (req, res) => {
  console.log('接收到请求');
  res.sendFile(path.join(__dirname, '../service/foo.html'));
});

app.get('/image', async (req, res) => {
  console.log('接收到请求');
  res.sendFile(path.join(__dirname, '../assets/102068933.json'));
});

app.get('/capoo', async (req, res) => {
  res.sendFile(path.join(__dirname, '../assets/capoo/11.png'));
});

app.get('/acg', async (req, res) => {
  res.sendFile(path.join(__dirname, '../assets/tx.jpg'));
});



app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/stat', get_stat)
app.use('/weapon', get_weapon)
app.use('/vehicle', get_vehicle)
app.use('/player', get_playerinfo)
app.use('/serverinfo', get_playerinfo)


app.get('/long/:id', async (req, res) => {

  let pic = await fs.readdirSync(path.resolve(__dirname, '../assets/long'), 'utf8')
  res.sendFile(path.join(__dirname, '../assets/long/' + pic[Math.floor(Math.random() * pic.length)]))
})
app.get('/chai/:id', async (req, res) => {

  let pic = await fs.readdirSync(path.resolve(__dirname, '../assets/chai'), 'utf8')
  res.sendFile(path.join(__dirname, '../assets/chai/' + pic[Math.floor(Math.random() * pic.length)]))
})
app.get('/ding/:id', async (req, res) => {

  let pic = await fs.readdirSync(path.resolve(__dirname, '../assets/ding'), 'utf8')
  res.sendFile(path.join(__dirname, '../assets/ding/' + pic[Math.floor(Math.random() * pic.length)]))
})
app.get('/capoo/:id', async (req, res) => {

  let pic = await fs.readdirSync(path.resolve(__dirname, '../assets/capoo'), 'utf8')
  res.sendFile(path.join(__dirname, '../assets/capoo/' + pic[Math.floor(Math.random() * pic.length)]))
})
app.get('/wife/:id', async (req, res) => {

  let pic = await fs.readdirSync(path.resolve(__dirname, '../assets/wife'), 'utf8')
  res.sendFile(path.join(__dirname, '../assets/wife/' + pic[Math.floor(Math.random() * pic.length)]))
})


httpsServer.listen(port, () => console.log(` app listening on port ${port}!`));
