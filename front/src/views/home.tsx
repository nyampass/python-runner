import React, { useState, useEffect } from 'react'
import MonacoEdotor from 'react-monaco-editor'
import { Button, Grid } from '@material-ui/core'
import api from '../api'
import io from 'socket.io-client'

const socket = io('/')
let logText = ''

export default () => {
  const [mainSrc, setMainSrc] = useState()
  const [mainEditor, setMainEditor] = useState<any>()
  const [requirementsSrc, setRequirementsSrc] = useState()
  const [requirementsEditor, setRequirementsEditor] = useState<any>()
  const playProgram = async () => {
    logText = ''
    await api.postMainPy(mainEditor?.getModel().getValue())
    await api.postRequirementsTxt(requirementsEditor?.getModel().getValue())
    await api.run()
  }
  const [connected, setConnected] = useState(false)
  const [logCount, setLogCount] = useState(0)

  socket.on('connect', () => {
    setConnected(true)
  })
  socket.on('disconnect', () => {
    setConnected(false)
  })
  socket.on('message', (data: any) => {
    console.log(data)
    logText += data
    setLogCount(logCount + 1)
  })

  useEffect(() => {
    const f = async () => {
      setMainSrc(await api.getMainPy() || '')
      setRequirementsSrc(await api.getRequitementsTxt() || '')
    }
    f()
  })

  return (
    <div className="Home" style={{ width: '100vw', height: '100vh' }}>
      <div style={{ width: '100%', height: '70%', flexFlow: 'row', display: 'flex' }}>
        <MonacoEdotor
          width='50%'
          height='100%'
          language='python'
          value={mainSrc}
          editorDidMount={(editor, monaco) => {
            setMainEditor(editor)
          }}
        />
        <MonacoEdotor
          width='50%'
          height='100%'
          language='python'
          value={requirementsSrc}
          editorDidMount={(editor, monaco) => {
            setRequirementsEditor(editor)
          }}
        />
      </div>
      <div>
        {connected ? 'connected' : 'not connected'}
      </div>
      <Grid container direction="row-reverse" style={{ padding: 10 }}>
        <Button variant="contained" color="primary" onClick={() => playProgram()}>play</Button>
      </Grid>
      <pre key={logCount}>
        {logText}
      </pre>
    </div>
  );
}
