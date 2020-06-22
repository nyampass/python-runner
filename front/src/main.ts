import * as monaco from 'monaco-editor'

const container = document.getElementById("container")!
monaco.editor.create(container, {
  value: "print('nya')",
  language: 'python',
})
