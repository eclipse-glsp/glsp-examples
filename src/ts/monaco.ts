import * as monaco from 'monaco-editor';
import { fileStore, loadCachedSource } from './store';

monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    diagnosticCodesToIgnore: [2792]
});

let currentLanguage: string | undefined = undefined;
let codeEditor: monaco.editor.IStandaloneCodeEditor | undefined = undefined;

export const setMonacoText = (fileText: string, sourceLanguage: string, sourceIndex?: number) => {
    if (currentLanguage !== sourceLanguage) {
        codeEditor?.dispose();
        codeEditor = monaco.editor.create(document.getElementById('code')!, {
            language: sourceLanguage,
            automaticLayout: true,
            readOnly: sourceLanguage !== 'typescript',
            wordWrap: 'on'
        });
        if (sourceIndex != null) {
            codeEditor.onDidChangeModelContent(() => {
                fileStore.sources[sourceIndex].text = codeEditor!.getValue();
            });
        }
    }

    codeEditor!.setValue(fileText);
};
export const loadMonaco = (source: MonacoSource, index: number) => {
    loadCachedSource(source, index).then(fileText => setMonacoText(fileText, source.language, index));
};
