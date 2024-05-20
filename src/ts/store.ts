import { examples as _examples } from '../examples.json';

export const examples = _examples as GLSPExample[];

export const fileStore = {
    data: '',
    sources: {} as Record<number, { source: MonacoSource; text: string }>,
    serverJs: undefined as string | undefined,
    clientJs: undefined as string | undefined
};

export const loadCachedSource = async (source: MonacoSource, index: number) => {
    if (fileStore.sources[index]) {
        return fileStore.sources[index].text;
    }
    // TODO make host optional if in github pages
    return fetch(`http://localhost:8000/${source.path}/${source.name}`)
        .then(result => result.text())
        .then(fileText => {
            const fileTextWithoutHeader = fileText.startsWith('/*') ? fileText.substring(fileText.search('import')) : fileText;
            fileStore.sources[index] = { source, text: fileTextWithoutHeader };
            return fileTextWithoutHeader;
        });
};

export const loadBundles = async () => {
    return Promise.all([
        fetch('http://localhost:8000/tasklist-glsp-server.js')
            .then(result => result.text())
            .then(fileText => (fileStore.serverJs = fileText)),
        fetch('http://localhost:8000/tasklist-glsp-client.js')
            .then(result => result.text())
            .then(fileText => (fileStore.clientJs = fileText))
    ]);
};
