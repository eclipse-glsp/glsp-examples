import { fileStore } from './store';
import { loadMonaco, setMonacoText } from './monaco';

let currentSelectedSource = 0;

export let currentView: ViewSelectionSection = 'DATA';
export const viewDataButton = document.getElementById('view-data-button')!;
const viewSourcesButton = document.getElementById('view-sources-button')!;

export const loadExample = (example: GLSPExample) => {
    const fileSelect = document.getElementById('file-select')!;
    fileSelect.replaceChildren();

    example.sources.forEach((source, i) => {
        const option = document.createElement('option');
        option.value = i.toString();
        option.innerHTML = `${source.side[0].toUpperCase()}${source.side.substring(1)} - ${source.name}`;

        fileSelect.appendChild(option);
    });
    fileSelect.onchange = e => {
        const selectedSource = Number((e.target as HTMLSelectElement).value);
        currentSelectedSource = selectedSource;
        loadMonaco(example, selectedSource);
    };

    currentView = 'DATA';
    viewDataButton.setAttribute('selected', '');
    viewSourcesButton.removeAttribute('selected');
    fileSelect.setAttribute('disabled', '');
    viewDataButton.innerText = 'Data';

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
        loadMonaco(example, currentSelectedSource);
        currentView = 'SOURCES';
    };
};
