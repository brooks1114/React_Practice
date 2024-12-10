import * as fs from 'fs';
import * as path from 'path';

interface FileStructure {
    name: string;
    type: 'folder' | 'file';
    children?: FileStructure[];
    classes?: Array<{
        name: string;
        comment: string;
        functions: Array<{
            name: string;
            comment: string;
        }>;
    }>;
}

const extractCommentsAndFunctions = (fileContent: string) => {
    const classRegex = /\/\*\*(.*?)\*\/\s*class\s+(\w+)/gs;
    const functionRegex = /\/\*\*(.*?)\*\/\s*(?:async\s+)?(?:public|private|protected)?\s*(\w+)\s*\(.*?\)/gs;

    const classes = [...fileContent.matchAll(classRegex)].map(match => ({
        name: match[2],
        comment: match[1].trim(),
        functions: [...fileContent.matchAll(functionRegex)]
            .filter(funcMatch => funcMatch.index! > match.index! && funcMatch.index! < (match.index! + match[0].length))
            .map(funcMatch => ({
                name: funcMatch[2],
                comment: funcMatch[1].trim(),
            })),
    }));

    return classes;
};

const buildFileStructure = (dirPath: string): FileStructure[] => {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    return entries.map(entry => {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
            return {
                name: entry.name,
                type: 'folder',
                children: buildFileStructure(fullPath),
            };
        } else if (entry.name.endsWith('.ts')) {
            const fileContent = fs.readFileSync(fullPath, 'utf-8');
            const classes = extractCommentsAndFunctions(fileContent);
            return {
                name: entry.name,
                type: 'file',
                classes: classes,
            };
        }
        return { name: entry.name, type: 'file' };
    });
};

const main = () => {
    const projectPath = path.resolve('./src'); // Change this to your project path
    const structure = buildFileStructure(projectPath);
    const outputPath = path.resolve('./documentation.json');

    fs.writeFileSync(outputPath, JSON.stringify(structure, null, 2));
    console.log(`Documentation JSON created at: ${outputPath}`);
};

main();
