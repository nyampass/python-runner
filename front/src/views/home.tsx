import React, { useState } from 'react'
import MonacoEdotor from 'react-monaco-editor'

export default () => {
  const [mainSrc, setMainSrc] = useState("import datetime from datetime\n\nprint('nya')\nprint(datetime.now().strftime('%H:%M:%S'))")
  const [requirementsSrc, setRequirementsSrc] = useState("datetime")
  const playProgram = () => {
    alert('todo')
  }
  return (
    <div className="Home" style={{ width: '100vw', height: '70vh' }}>
      <div style={{ width: '100%', height: '100%', flexFlow: 'row', display: 'flex', flexGrow: 1 }}>
        <MonacoEdotor
          width='50%'
          height='100%'
          value={mainSrc}
          language='python'
        />
        <MonacoEdotor
          width='50%'
          height='100%'
          value={requirementsSrc}
          language='python'
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
