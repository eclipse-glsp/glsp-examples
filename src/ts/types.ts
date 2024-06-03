type GLSPExample = {
    id: string;
    name: string;
    diagram: string;
    sourceModelType: string;
    path: string;
    serverBundle: string;
    clientBundle: string;
    sources: MonacoSource[];
};

type MonacoSource = {
    name: string;
    path: string;
    language: string;
    side: SourceSide;
    ignoreForCompilation?: boolean;
};

type SourceSide = 'client' | 'server' | 'data';

type ViewSelectionSection = 'DATA' | 'SOURCES';
