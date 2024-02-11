import express from 'express'
import { serverinfo } from './gateway'

export const get_serverinfo = express.Router()
get_serverinfo.use(express.json()) // 解析 JSON 格式的请求体
get_serverinfo.use(express.urlencoded({ extended: false }))
// middleware that is specific to this router

// define the home page route
get_serverinfo.post('/', async (req, res) => {
    let info: any = req.query
    
    let result = await serverinfo(info.serverName)
res.json(result)
})
