import * as monaco from 'monaco-editor';
import { fileStore, loadCachedSource } from './store';

monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    diagnosticCodesToIgnore: [2792, 4112, 2339, 2554, 2322, 2347, 2307, 2304]
});
monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    jsx: monaco.languages.typescript.JsxEmit.React
});

let currentLanguage: string | undefined = undefined;
let codeEditor: monaco.editor.IStandaloneCodeEditor | undefined = undefined;

export const setMonacoText = (fileText: string, sourceLanguage: string, sourceIndex?: number, readOnly?: boolean) => {
    codeEditor?.getModel()?.dispose();
    const model = monaco.editor.createModel(
        fileText,
        sourceLanguage,
        monaco.Uri.parse(`file:///${sourceIndex ? fileStore.sources[sourceIndex].source.name : 'data.json'}`)
    );

    if (currentLanguage !== sourceLanguage) {
        codeEditor?.dispose();
        codeEditor = monaco.editor.create(document.getElementById('code')!, {
            language: sourceLanguage,
            automaticLayout: true,
            readOnly,
            wordWrap: 'on'
        });
        if (sourceIndex != null) {
            codeEditor.onDidChangeModelContent(() => {
                fileStore.sources[sourceIndex].text = codeEditor!.getValue();
            });
        }
    }

    codeEditor!.setModel(model);
    // codeEditor!.setValue(fileText);
};

export const loadMonaco = (example: GLSPExample, index: number) => {
    loadCachedSource(example, index).then(fileText => setMonacoText(fileText, example.sources[index].language, index));
};
