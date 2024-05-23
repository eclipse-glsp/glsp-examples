type GLSPExample = {
    id: string;
    name: string;
    diagram: string;
    path: string;
    serverBundle: string;
    clientBundle: string;
    sources: MonacoSource[];
    sourceModelType: string;
};

type MonacoSource = {
    name: string;
    path: string;
    language: string;
    side: SourceSide;
};

type SourceSide = 'client' | 'server';

type ViewSelectionSection = 'DATA' | 'SOURCES';
