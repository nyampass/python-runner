import React from 'react'
import MonacoEdotor from 'react-monaco-editor'

export default () => {
  const editorDidMount = (editor: any, monaco: any) => {

  }
  return (
    <div className="Home" style={{ width: '100vw', height: '100vh' }}>
      <MonacoEdotor
        width='100%'
        height='100%'
        value={"print('nya')"}
        language='python'
        editorDidMount={editorDidMount}
      />
    </div>
  );
}
