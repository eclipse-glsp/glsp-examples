import { fileStore } from './store';
import { setMonacoText } from './monaco';
import { currentView, viewDataButton } from './sourceViewer';

const activeModelFrame = document.createElement('iframe');
activeModelFrame.width = '100%';
activeModelFrame.height = '100%';
// TODO make host optional if in github pages
activeModelFrame.src = 'http://localhost:8000/diagram.html';
activeModelFrame.style.border = '0';
activeModelFrame.style.display = 'block';

document.getElementById('model')!.appendChild(activeModelFrame);

window.addEventListener('message', ({ data }) => {
    if (data.type === 'MODEL_FILE') {
        fileStore.data = data.data;
        if (currentView === 'DATA') {
            setMonacoText(data.data, 'json');
        } else {
            viewDataButton.innerText = 'Data*';
        }
    }
});
