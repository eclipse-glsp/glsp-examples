export const createPath = (example: GLSPExample, filePath: string) => {
    // TODO make host optional if in github pages
    return `${process.env.HOST_PATH}/${example.path}/${filePath}`;
};
