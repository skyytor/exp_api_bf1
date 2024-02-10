import express from 'express'
import { getServerDetails, playerinfo } from './gateway'
import { stat } from './gateway'

export const get_server_details = express.Router()
get_server_details.use(express.json()) // 解析 JSON 格式的请求体
get_server_details.use(express.urlencoded({ extended: false }))
// middleware that is specific to this router

// define the home page route
get_server_details.post('/', async (req, res) => {
    let info:any =req.query
    let result = await getServerDetails(info.gameId)
    console.log(result)
    
    res.json(result)
})

