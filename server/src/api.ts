import express from 'express'
import fs from 'fs'
import path from 'path'
import processHandler from './processHandler'

const fileDir = './files'
const mainPath = path.join(fileDir, 'main.py')
const requirementsPath = path.join(fileDir, 'requirements.txt')

const sendFileIfExists = (res: express.Response, filePath: string, options?: { default?: string }) => {
  if (!fs.existsSync(filePath)) {
    res.send(options?.default)
  } else {
    res.send(fs.readFileSync(filePath))
  }
}
const saveToFile = (filePath: string, body: string) => {
  const dirPath = path.dirname(filePath)
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
  fs.writeFileSync(filePath, body)
}

export default express.Router()
  .use(express.json())
  .get('/main.py', (req, res) => {
    sendFileIfExists(res, mainPath, { default: "print('hello')" })
  })
  .post('/main.py', (req, res) => {
    saveToFile(mainPath, req.body.body)
    res.sendStatus(200)
  })
  .get('/requirements.txt', (req, res) => {
    sendFileIfExists(res, requirementsPath)
  })
  .post('/requirements.txt', (req, res) => {
    saveToFile(requirementsPath, req.body.body)
    res.sendStatus(200)
  })
  .get('/run', (req, res) => {
    processHandler.resetProcesses([
      ['pip3', ['install', '-r', `${__dirname}/../${requirementsPath}`]],
      ['python3', [`${__dirname}/../${mainPath}`]],
    ])
    res.sendStatus(200)
  })
