export const createPath = (example: GLSPExample, filePath: string) => {
    // TODO make host optional if in github pages
    return `http://localhost:8000/${example.path}/${filePath}`;
};
