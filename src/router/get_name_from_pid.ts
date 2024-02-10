import express from 'express'
import { get_personaId, playerinfo } from './gateway'
import { stat } from './gateway'

export const get_name_from_pid = express.Router()
get_name_from_pid.use(express.json()) // 解析 JSON 格式的请求体
get_name_from_pid.use(express.urlencoded({ extended: false }))
// middleware that is specific to this router




get_name_from_pid.post('/', async (req, res) => {
    let info: any = req.query
    let result = await playerinfo([info.personaId])
    res.json(result)
})
// define the about route

