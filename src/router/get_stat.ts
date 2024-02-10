import express from 'express'
import { get_personaId, stat } from './gateway'

export const get_stat = express.Router()
get_stat.use(express.json()) // 解析 JSON 格式的请求体
get_stat.use(express.urlencoded({ extended: false }))
// middleware that is specific to this router


get_stat.post('/', async (req, res) => {
    console.log(req.query)
    let info: any = req.query
    /* console.log()
    let result = await get_personaId(info.id)
    res.json(result) */
    await get_personaId(info.name).then(async (result) => {
        res.json(await stat(result[0].personaId))
    })
})