import { ChildProcessWithoutNullStreams } from 'child_process'
import socketHandler from './socketHandler'
import { spawn } from 'child_process'

type SpawnParams = [string, string[]]
let stockedProcesses: SpawnParams[] = []
let currentProcess: ChildProcessWithoutNullStreams | undefined

const killCurrentProcess = () => {
  if (currentProcess && !currentProcess.killed) {
    currentProcess.kill('SIGINT')
  }
}

const resetProcesses = (processes: SpawnParams[]) => {
  if (currentProcess) {
    stockedProcesses = []
    killCurrentProcess()
  }
  stockedProcesses = processes
  runNextProcess()
}

const runNextProcess = () => {
  console.log('run next process')
  const params = stockedProcesses.shift()
  if (!params) {
    console.log('finished')
    socketHandler.send('Finished processes\n')
    return
  }
  killCurrentProcess()
  socketHandler.send('Execute: ' + [params[0]].concat(params[1]).join(' ') + '\n')
  currentProcess = spawn(params[0], params[1])
  currentProcess.stdout.on('data', (data) => {
    socketHandler.send(data.toString())
  })
  currentProcess.stderr.on('data', (data) => {
    socketHandler.send(data.toString())
  })
  currentProcess.on('close', () => {
    runNextProcess()
  })
}

export default {
  resetProcesses
}
