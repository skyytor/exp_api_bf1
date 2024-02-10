import express from 'express'
import { playerinfo } from './gateway'
import { stat } from './gateway'

export const get_playerinfo = express.Router()
get_playerinfo.use(express.json()) // 解析 JSON 格式的请求体
get_playerinfo.use(express.urlencoded({ extended: false }))
// middleware that is specific to this router

// define the home page route
get_playerinfo.post('/', async (req, res) => {
    let result = await playerinfo(req.body.personaIds)
    res.json(result)
})

