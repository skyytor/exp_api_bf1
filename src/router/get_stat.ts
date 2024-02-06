import express from 'express'
import { stat } from './gateway'

export const get_stat = express.Router()
get_stat.use(express.json()) // 解析 JSON 格式的请求体
get_stat.use(express.urlencoded({ extended: false }))
// middleware that is specific to this router

// define the home page route


/**
 * @swagger
 * /stat:
 *   post:
 *     description: Get users by name
 *     parameters:
 *       - name: personaId
 *         in: query
 *         description: Name of the user
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A successful response
 */


// define the about route
get_stat.get('/', (req, res) => {
    res.send('About birds')
})
get_stat.post('/', async (req, res) => {
    console.log(req.query)
    let info:any = req.query
    console.log()
    let result = await stat(info.personaId)
    res.json(result)
})