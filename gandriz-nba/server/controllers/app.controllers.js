const routes = require('./../routes/app.routes')

const express = require('express')
const router = express.Router()


router.post('/tournaments/new', routes.newTournament)
router.post('/teams/new/batch', routes.newTeam)
router.post('/referees/new/batch', routes.newReferee)
router.post('/players/new/batch', routes.newPlayer)
router.post('/games/new', routes.newGame)

router.put('/games/update/:id', routes.updateGame)

router.get('/games/:id', routes.getGame)
router.get('/tournaments/:id', routes.getTournament)
router.get('/referees/:id', routes.getReferee)
router.get('/teams/:id', routes.getTeam)
router.get('/players/:id', routes.getPlayer)


module.exports = router