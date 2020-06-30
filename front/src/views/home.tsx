import React, { useState, useEffect } from 'react'
import MonacoEdotor from 'react-monaco-editor'
import { Box, Button, Grid } from '@material-ui/core'
import api from '../api'
import io from 'socket.io-client'
import monaco from 'monaco-editor'

const socket = io('/')

const editorLineHeight = 20
const calcScrollTopToShowTail = (editor: monaco.editor.ICodeEditor, areaHeight: number) => {
  const scrollHeight = editor.getScrollHeight()
  const tailTop = scrollHeight - areaHeight * 2 + editorLineHeight
  return tailTop
}
const detectShowingTail = (editor: monaco.editor.ICodeEditor, areaHeight: number) => {
  const tailTop = calcScrollTopToShowTail(editor, areaHeight)
  const top = editor.getScrollTop()
  return top >= tailTop
}
const scrollToShowTail = (editor: monaco.editor.ICodeEditor, areaHeight: number) => {
  const tailTop = calcScrollTopToShowTail(editor, areaHeight)
  editor.setScrollTop(tailTop)
}

export default () => {
  const [mainSrc, setMainSrc] = useState('')
  const [requirementsSrc, setRequirementsSrc] = useState('')
  const [connected, setConnected] = useState(false)
  const [logText, setLogText] = useState('')
  const [logEditor, setLogEditor] = useState<monaco.editor.ICodeEditor>()
  const [logAreaHeight, setLogAreaHeight] = useState(0)
  const saveProgram = async () => {
    await api.postMainPy(mainSrc)
    await api.postRequirementsTxt(requirementsSrc)
  }
  const playProgram = async () => {
    await saveProgram()
    await api.run()
  }
  const stopProgram = async () => {
    await api.stop()
  }
  const loadSources = async () => {
    setMainSrc(await api.getMainPy() || '')
    setRequirementsSrc(await api.getRequitementsTxt() || '')
  }
  const handleKeyDown = (e: KeyboardEvent) => {
    const c = String.fromCharCode(e.which).toLowerCase()
    if (e.ctrlKey && c === 's') {
      saveProgram()
      e.preventDefault()
      return false
    } else if (e.ctrlKey && c === 'e') {
      playProgram()
      e.preventDefault()
      return false
    }
  }

  useEffect(() => {
    const windowHeight = window.innerHeight
    const middleContainerHeight = document.getElementById('middle-container')?.offsetHeight
    const topContainerHeight = document.getElementById('top-container')?.offsetHeight
    const bottomContainer = document.getElementById('bottom-container')
    if (bottomContainer && middleContainerHeight && topContainerHeight) {
      const h = windowHeight - topContainerHeight - middleContainerHeight
      bottomContainer.style.height = `${h}px`
      setLogAreaHeight(h)
    }
    logEditor?.layout()
    loadSources()
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

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
      const isShowingTail = logEditor && detectShowingTail(logEditor, logAreaHeight)
      setLogText(logText + data)
      if (logEditor && isShowingTail) {
        scrollToShowTail(logEditor, logAreaHeight)
      }
    })
    return () => {
      socket.removeListener('message')
    }
  }, [logText, logEditor])

  return (
    <div className="Home" style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <div id="top-container" style={{ width: '100%', height: '70%', flexFlow: 'row', display: 'flex' }}>
        <MonacoEdotor
          width='60%'
          height='100%'
          language='python'
          value={mainSrc}
          onChange={(t: string) => setMainSrc(t)}
          options={{
            automaticLayout: true,
          }}
        />
        <MonacoEdotor
          width='40%'
          height='100%'
          language='python'
          value={requirementsSrc}
          onChange={(t: string) => setRequirementsSrc(t)}
          options={{
            automaticLayout: true,
          }}
        />
      </div>
      <Grid container id="middle-container" justify='flex-end'>
        {[
          { title: 'stop', action: () => stopProgram() },
          { title: 'clear log', action: () => setLogText('') },
          { title: 'save', action: () => saveProgram() },
          { title: 'play', color: 'primary', action: () => playProgram() },
        ].map((v, i) => (
          <Grid key={i} item>
            <Box p={1} pl={0}>
              <Button
                variant="contained" color={v.color as any}
                onClick={v.action}
              >
                {v.title}
              </Button>
            </Box>
          </Grid>
        ))}
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
          editorDidMount={(editor, monaco) => {
            setLogEditor(editor)
          }}
        />
      </Box>
    </div>
  );
}
