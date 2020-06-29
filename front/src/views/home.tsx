import React, { useState, useEffect } from 'react'
import MonacoEdotor from 'react-monaco-editor'
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
    <div className="Home" style={{ width: '100vw', height: '70vh' }}>
      <div style={{ width: '100%', height: '100%', flexFlow: 'row', display: 'flex', flexGrow: 1 }}>
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
      <div style={{ flexFlow: 'row-reverse', display: 'flex', height: '30vh' }}>
        <div
          style={{ margin: 5, padding: 15, backgroundColor: 'lightblue', borderRadius: 5 }}
          onClick={() => playProgram()}
        >
          Play
        </div>
      </div>
    </div>
  );
}
