import express from 'express';
import path from 'path';
import { get_stat } from './router/get_stat';
import { get_weapon } from './router/get_weapon';
import { get_vehicle } from './router/get_vehicle';
import { get_playerinfo } from './router/get_playerinfo';

const app = express();
const port = 2789;
app.use(express.json()) // 解析 JSON 格式的请求体
app.use(express.urlencoded({ extended: false }))


app.use('/stat', get_stat)
app.use('/weapon', get_weapon)
app.use('/vehicle', get_vehicle)
app.use('/player',get_playerinfo)
app.use('/serverinfo', get_playerinfo)

app.get('/', (req, res) => {
    
    res.sendFile(path.join(__dirname, '../assets/long.jpg'))
})
app.listen(port, () => console.log(` app listening on port ${port}!`));