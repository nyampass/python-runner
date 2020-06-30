import express from 'express'
import api from './api'
import http from 'http'
import socketHandler from './socketHandler'

const app = express()
const port = 4000
const server = http.createServer(app)
socketHandler.init(server)

app.use('/', express.static('../front/dist'))
app.use('/api/', api)

// app.listen(4000, '0.0.0.0', () => console.log(`start listen on port ${port}`))
server.listen(port)
