import * as monaco from 'monaco-editor';

let currentLanguage: string | undefined = undefined;
let codeEditor: monaco.editor.IStandaloneCodeEditor | undefined = undefined;

export const setMonacoText = (fileText: string, sourceLanguage: string) => {
    if (currentLanguage !== sourceLanguage) {
        codeEditor?.dispose();
        codeEditor = monaco.editor.create(document.getElementById('code')!, {
            language: sourceLanguage,
            automaticLayout: true,
            readOnly: true,
            wordWrap: 'on'
        });
    }

    codeEditor!.setValue(fileText);
};
export const loadMonaco = (source: MonacoSource) => {
    // TODO make host optional if in github pages
    fetch(`http://localhost:8000/${source.path}/${source.name}`)
        .then(result => result.text())
        .then(fileText => setMonacoText(fileText, source.language));
};
