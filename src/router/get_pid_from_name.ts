import express from 'express'
import { get_personaId, playerinfo } from './gateway'
import { stat } from './gateway'

export const get_pid_from_name = express.Router()
get_pid_from_name.use(express.json()) // 解析 JSON 格式的请求体
get_pid_from_name.use(express.urlencoded({ extended: false }))
// middleware that is specific to this router

get_pid_from_name.post('/', async (req, res) => {
    let info: any = req.query
    let result = await get_personaId(info.gameId)
    res.json(result)
})
// define the about route

