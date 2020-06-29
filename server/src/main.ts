import express from 'express'
import api from './api'

const app = express()
const port = 4000

app.use('/', express.static('../front/dist'))
app.use('/api/', api)

app.listen(4000, '0.0.0.0', () => console.log(`start listen on port ${port}`))
