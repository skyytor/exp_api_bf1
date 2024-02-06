import express from 'express'
import { stat } from './gateway'

export const get_stat = express.Router()
get_stat.use(express.json()) // 解析 JSON 格式的请求体
get_stat.use(express.urlencoded({ extended: false }))
// middleware that is specific to this router

// define the home page route
get_stat.post('/', async (req, res) => {
    let result = await stat(req.body.personaId)
    res.json(result)
})



// define the about route
get_stat.get('/', (req, res) => {
    res.send('About birds')
})
