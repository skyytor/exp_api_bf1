import express from 'express'
import { weapon } from './gateway'


export const get_weapon = express.Router()

// middleware that is specific to this router

// define the about route
get_weapon.post('/', async (req, res) => {
    res.json(await weapon(req.body.personaId))
})

