import { CompilerOptions, JsxEmit, ModuleKind, ModuleResolutionKind, ScriptTarget, transpileModule } from 'typescript';
import { fileStore } from './store';
import { replaceIframeSrc } from './modelViewer';

const compilerOptions: CompilerOptions = {
    skipLibCheck: true,
    declaration: true,
    declarationMap: true,
    noImplicitAny: true,
    noImplicitThis: true,
    strictNullChecks: true,
    noImplicitOverride: true,
    noEmitOnError: false,
    noUnusedLocals: true,
    noImplicitReturns: true,
    strict: true,
    incremental: true,
    strictPropertyInitialization: false,
    experimentalDecorators: true,
    emitDecoratorMetadata: true,
    downlevelIteration: true,
    resolveJsonModule: true,
    module: ModuleKind.CommonJS,
    moduleResolution: ModuleResolutionKind.NodeNext,
    target: ScriptTarget.ES2017,
    jsx: JsxEmit.React,
    reactNamespace: 'JSX',
    lib: ['ES2017', 'dom'],
    sourceMap: false,
    types: ['node', 'reflect-metadata']
};

const searchImports = (subModuleString: string, markString: string): [number, number] => {
    const importStartPos = subModuleString.search(`\n.*${markString}`) + 1;
    const importEndPos = subModuleString.substring(importStartPos).search('\n');
    if (importStartPos === 0) {
        return [0, importEndPos];
    }
    return [importStartPos, searchImports(subModuleString.substring(importEndPos), markString)[1] + importEndPos];
};

const compileSide = (side: SourceSide) => {
    let moduleString = side === 'client' ? fileStore.clientJs! : fileStore.serverJs!;

    Object.values(fileStore.sources)
        .filter(source => !source.source.ignoreForCompilation)
        .filter(source => source.source.side === side)
        .forEach(source => {
            const jsCode = transpileModule(source.text, { compilerOptions }).outputText;

            const subModulePrePos = moduleString.search(`${source.source.name.replace(/\.tsx?/g, '.js')}":`);
            const moduleStringSubstr = moduleString.substring(subModulePrePos);
            const subModuleStartPos = moduleStringSubstr.search('"use strict";') + subModulePrePos;
            const subModuleEndPos = moduleStringSubstr.search('/\\*\\*\\*/ \\}\\)') + subModulePrePos;

            const subModuleStr = moduleString.substring(subModuleStartPos, subModuleEndPos);

            const moduleImportPos = searchImports(subModuleStr, '__webpack_require__');
            const compiledImportPos = searchImports(jsCode, 'require');

            const jsCodeWithImports =
                jsCode.slice(0, compiledImportPos[0]) +
                subModuleStr.substring(moduleImportPos[0], moduleImportPos[1]) +
                jsCode.slice(compiledImportPos[1]);

            moduleString = moduleString.slice(0, subModuleStartPos) + jsCodeWithImports + moduleString.slice(subModuleEndPos);
        });

    const blob = new Blob([moduleString], { type: 'application/javascript' });
    return URL.createObjectURL(blob);
};

const compileData = () => {
    const data = Object.values(fileStore.sources).find(source => source.source.side === 'data');
    if (!data) {
        return undefined;
    }
    const blob = new Blob([data.text], { type: 'application/json' });
    return URL.createObjectURL(blob);
};

export const compileSources = () => {
    const serverBlobURL = compileSide('server');
    const clientBlobURL = compileSide('client');
    const dataBlobURL = compileData();

    let diagramHtml = fileStore.diagramHtml!;
    diagramHtml =
        diagramHtml.slice(0, diagramHtml.search('/\\*\\* OVERWRITE SERVER URL START \\*\\*/')) +
        '"' +
        serverBlobURL +
        '"' +
        diagramHtml.slice(diagramHtml.search('/\\*\\* OVERWRITE SERVER URL END \\*\\*/'));

    diagramHtml =
        diagramHtml.slice(0, diagramHtml.search('/\\*\\* OVERWRITE CLIENT URL START \\*\\*/')) +
        '"' +
        clientBlobURL +
        '"' +
        diagramHtml.slice(diagramHtml.search('/\\*\\* OVERWRITE CLIENT URL END \\*\\*/'));

    if (dataBlobURL) {
        diagramHtml =
            diagramHtml.slice(0, diagramHtml.search('/\\*\\* OVERWRITE DATA URL START \\*\\*/')) +
            '"' +
            dataBlobURL +
            '"' +
            diagramHtml.slice(diagramHtml.search('/\\*\\* OVERWRITE DATA URL END \\*\\*/'));
    }

    const diagramHtmlBlob = new Blob([diagramHtml], { type: 'text/html' });
    const diagramHtmlBlobURL = URL.createObjectURL(diagramHtmlBlob);

    replaceIframeSrc(diagramHtmlBlobURL);
};
