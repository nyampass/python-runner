import monaco from 'monaco-editor'

monaco.editor.create(document.getElementById("container")!, {
  value: "print('nya')",
  language: 'python',
})
