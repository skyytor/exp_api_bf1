import express from 'express'
import { vehicle } from './gateway'

export const get_vehicle = express.Router()
get_vehicle.use(express.json()) // 解析 JSON 格式的请求体
get_vehicle.use(express.urlencoded({ extended: false }))
// middleware that is specific to this router

// define the home page route
get_vehicle.post('/', async (req, res) => {
    res.json(await vehicle(req.body.personaId))
})
// define the about route
get_vehicle.get('/', (req, res) => {
    res.send('About birds')
})
