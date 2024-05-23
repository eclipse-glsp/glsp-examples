import { examples, resetStore } from './store';
import { compileSources } from './sourceCompiler';
import { loadBundles } from './store';
import { loadExample } from './sourceViewer';
import { replaceIframeSrc } from './modelViewer';
import { createPath } from './util';

const setExample = (example: GLSPExample) => {
    resetStore();
    loadBundles(example);
    loadExample(example);
    replaceIframeSrc(createPath(example, example.diagram));
};

const exampleSelect = document.getElementById('example-select')!;
let currentExample = 0;
examples.forEach((example, i) => {
    const option = document.createElement('option');
    option.value = i.toString();
    option.innerHTML = example.name;

    exampleSelect.appendChild(option);
});
exampleSelect.onchange = e => {
    const selectedExample = Number((e.target as HTMLSelectElement).value);
    currentExample = selectedExample;
    setExample(examples[selectedExample]);
};

const compileButton = document.getElementById('compile-button')!;
compileButton.onclick = compileSources;

const resetButton = document.getElementById('reset-button')!;
resetButton.onclick = () => setExample(examples[currentExample]);

export const onStart = () => {
    setExample(examples[0]);
};
