import React, { useState, useEffect } from 'react'
import MonacoEdotor from 'react-monaco-editor'
import { Button, Grid } from '@material-ui/core'
import api from '../api'

export default () => {
  const [mainSrc, setMainSrc] = useState()
  const [mainEditor, setMainEditor] = useState<any>()
  const [requirementsSrc, setRequirementsSrc] = useState()
  const [requirementsEditor, setRequirementsEditor] = useState<any>()
  const playProgram = async () => {
    await api.postMainPy(mainEditor?.getModel().getValue())
    await api.postRequirementsTxt(requirementsEditor?.getModel().getValue())
    alert(await api.run())
  }

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
      <Grid container direction="row-reverse" style={{ padding: 10 }}>
        <Button variant="contained" color="primary" onClick={() => playProgram()}>play</Button>
      </Grid>
    </div>
  );
}
