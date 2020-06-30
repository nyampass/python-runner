import socketIo from 'socket.io'
import http from 'http'

let io: socketIo.Server

const init = (server: http.Server) => {
  io = socketIo(server, { serveClient: false })
  io.on('connection', () => {
    console.log('connected')
  })
}

export const send = (data: string) => {
  io.send(data)
}

export default {
  init,
  send,
}
