import * as monaco from 'monaco-editor';
import { examples } from './examples.json';

const activeModelFrame = document.createElement('iframe');
activeModelFrame.width = '100%';
activeModelFrame.height = '100%';
activeModelFrame.src = 'http://localhost:8000/diagram.html';
activeModelFrame.style.border = '0';
activeModelFrame.style.display = 'block';

document.getElementById('model')!.appendChild(activeModelFrame);

let currentLanguage: string | undefined = undefined;
let codeEditor: monaco.editor.IStandaloneCodeEditor | undefined = undefined;
const loadMonaco = (source: { name: string; path: string; language: string }) => {
    if (currentLanguage !== source.language) {
        codeEditor?.dispose();
        codeEditor = monaco.editor.create(document.getElementById('code')!, {
            language: source.language,
            automaticLayout: true,
            readOnly: true,
            wordWrap: 'on'
        });
    }

    fetch(`http://localhost:8000/${source.path}/${source.name}`)
        .then(result => result.text())
        .then(fileText => codeEditor!.setValue(fileText));
};

const currentExample = examples[0];

const tabsContainer = document.getElementById('tabs')!;
const tabs: HTMLDivElement[] = [];
currentExample.sources.forEach(source => {
    const tab = document.createElement('div');
    tab.classList.add('tab');
    tab.innerText = source.name;

    tab.addEventListener('click', () => {
        tabs.forEach(t => t.setAttribute('selected', 'false'));
        tab.setAttribute('selected', 'true');
        loadMonaco(source);
    });

    tabsContainer.appendChild(tab);
    tabs.push(tab);
});
tabs[0].click();
