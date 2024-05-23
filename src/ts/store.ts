import { examples as _examples } from '../examples.json';
import { createPath } from './util';

export const examples = _examples as GLSPExample[];

export const fileStore = {
    data: '',
    sources: {} as Record<number, { source: MonacoSource; text: string }>,
    serverJs: undefined as string | undefined,
    clientJs: undefined as string | undefined,
    diagramHtml: undefined as string | undefined
};

export const loadCachedSource = async (example: GLSPExample, index: number) => {
    if (fileStore.sources[index]) {
        return fileStore.sources[index].text;
    }
    const source = example.sources[index];
    return fetch(createPath(example, `${source.path}/${source.name}`))
        .then(result => result.text())
        .then(fileText => {
            const fileTextWithoutHeader = fileText.startsWith('/*') ? fileText.substring(fileText.search('import')) : fileText;
            fileStore.sources[index] = { source, text: fileTextWithoutHeader };
            return fileTextWithoutHeader;
        });
};

export const loadBundles = async (example: GLSPExample) => {
    return Promise.all([
        fetch(createPath(example, example.serverBundle))
            .then(result => result.text())
            .then(fileText => (fileStore.serverJs = fileText)),
        fetch(createPath(example, example.clientBundle))
            .then(result => result.text())
            .then(fileText => (fileStore.clientJs = fileText)),
        fetch(createPath(example, example.diagram))
            .then(result => result.text())
            .then(fileText => (fileStore.diagramHtml = fileText))
    ]);
};

export const resetStore = () => {
    fileStore.data = '';
    fileStore.sources = {};
    fileStore.serverJs = undefined;
    fileStore.clientJs = undefined;
    fileStore.diagramHtml = undefined;
};
