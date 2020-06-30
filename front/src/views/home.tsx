import React, { useState, useEffect } from 'react'
import MonacoEdotor from 'react-monaco-editor'
import { Box, Button, Grid } from '@material-ui/core'
import api from '../api'
import io from 'socket.io-client'

const socket = io('/')

export default () => {
  const [mainSrc, setMainSrc] = useState()
  const [mainEditor, setMainEditor] = useState<any>()
  const [requirementsSrc, setRequirementsSrc] = useState()
  const [requirementsEditor, setRequirementsEditor] = useState<any>()
  const playProgram = async () => {
    await api.postMainPy(mainEditor?.getModel().getValue())
    await api.postRequirementsTxt(requirementsEditor?.getModel().getValue())
    await api.run()
  }
  const [connected, setConnected] = useState(false)
  const [logText, setLogText] = useState('')

  useEffect(() => {
    socket.on('connect', () => {
      setConnected(true)
    })
    socket.on('disconnect', () => {
      setConnected(false)
    })
    return () => {
      socket.removeListener('connect')
      socket.removeListener('disconnect')
    }
  }, [connected])
  useEffect(() => {
    socket.on('message', (data: any) => {
      setLogText(logText + data)
    })
    return () => {
      socket.removeListener('message')
    }
  }, [logText])

  useEffect(() => {
    const windowHeight = window.innerHeight
    const middleContainerHeight = document.getElementById('middle-container')?.offsetHeight
    const topContainerHeight = document.getElementById('top-container')?.offsetHeight
    const bottomContainer = document.getElementById('bottom-container')
    if (bottomContainer && middleContainerHeight && topContainerHeight) {
      bottomContainer.style.height = `${windowHeight - topContainerHeight - middleContainerHeight}px`
    }
    const f = async () => {
      setMainSrc(await api.getMainPy() || '')
      setRequirementsSrc(await api.getRequitementsTxt() || '')
    }
    f()
  }, [])

  return (
    <div className="Home" style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <div id="top-container" style={{ width: '100%', height: '70%', flexFlow: 'row', display: 'flex' }}>
        <MonacoEdotor
          width='60%'
          height='100%'
          language='python'
          value={mainSrc}
          editorDidMount={(editor, monaco) => {
            setMainEditor(editor)
          }}
          options={{
            automaticLayout: true,
          }}
        />
        <MonacoEdotor
          width='40%'
          height='100%'
          language='python'
          value={requirementsSrc}
          editorDidMount={(editor, monaco) => {
            setRequirementsEditor(editor)
          }}
          options={{
            automaticLayout: true,
          }}
        />
      </div>
      <Grid container id="middle-container" justify='flex-end'>
        <Grid item>
          <Box p={1}>
            <Button
              variant="contained" color="default"
              onClick={() => setLogText('')}
            >
              Clear log
            </Button>
            <Button
              variant="contained" color="primary"
              onClick={() => playProgram()}
            >
              play
          </Button>
          </Box>
        </Grid>
      </Grid>
      <Box id="bottom-container">
        <MonacoEdotor
          width='100%'
          height='100%'
          language='none'
          value={logText}
          options={{
            readOnly: true,
            automaticLayout: true,
          }}
        />
      </Box>
    </div>
  );
}