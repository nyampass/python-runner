import { ChildProcessWithoutNullStreams } from 'child_process'
import socketHandler from './socketHandler'
import { spawn } from 'child_process'

type SpawnParams = [string, string[]]
let stockedProcesses: SpawnParams[] = []
let currentProcess: ChildProcessWithoutNullStreams | undefined

const resetProcesses = (processes: SpawnParams[]) => {
  if (currentProcess) {
    stockedProcesses = []
    currentProcess.kill()
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
  socketHandler.send('Execute: ' + [params[0]].concat(params[1]).join(' ') + '\n')
  currentProcess = spawn(params[0], params[1])
  currentProcess.stdout.on('data', (data) => {
    console.log(data.toString())
    socketHandler.send(data.toString())
  })
  currentProcess.stderr.on('data', (data) => {
    console.log(data.toString())
    socketHandler.send(data.toString())
  })
  currentProcess.on('close', () => {
    currentProcess = undefined
    runNextProcess()
  })
}

export default {
  resetProcesses
}
