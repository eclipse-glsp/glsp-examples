import { examples, fileStore } from './store';
import { loadMonaco, setMonacoText } from './monaco';

const currentExample = examples[0];

const fileSelect = document.getElementById('file-select')!;
let currentSelectedSource = 0;
currentExample.sources.forEach((source, i) => {
    const option = document.createElement('option');
    option.value = i.toString();
    option.innerHTML = source.name;

    fileSelect.appendChild(option);
});
fileSelect.onchange = e => {
    const selectedSource = Number((e.target as HTMLSelectElement).value);
    currentSelectedSource = selectedSource;
    loadMonaco(currentExample.sources[selectedSource]);
};

export let currentView: ViewSelectionSection = 'DATA';
export const viewDataButton = document.getElementById('view-data-button')!;
const viewSourcesButton = document.getElementById('view-sources-button')!;

viewDataButton.onclick = () => {
    viewDataButton.setAttribute('selected', '');
    viewSourcesButton.removeAttribute('selected');
    fileSelect.setAttribute('disabled', '');
    setMonacoText(fileStore.data, 'json');
    currentView = 'DATA';
    viewDataButton.innerText = 'Data';
};

viewSourcesButton.onclick = () => {
    viewDataButton.removeAttribute('selected');
    viewSourcesButton.setAttribute('selected', '');
    fileSelect.removeAttribute('disabled');
    loadMonaco(currentExample.sources[currentSelectedSource]);
    currentView = 'SOURCES';
};
