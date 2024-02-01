import express from 'express'
import { weapon } from './gateway'


export const get_weapon = express.Router()

// middleware that is specific to this router

// define the home page route
get_weapon.get('/', (req, res) => {
    res.send('Birds home page')
})
// define the about route
get_weapon.post('/', async (req, res) => {
    res.json(await weapon(req.body.personaId))
})

