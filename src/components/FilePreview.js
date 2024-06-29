import React, { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';

const languageMap = {
    'js': 'javascript',
    'ts': 'typescript',
    'py': 'python',
    'java': 'java',
    'cpp': 'cpp',
    'html': 'html',
    'css': 'css',
    'json': 'json',
    'md': 'markdown',
    // ajoutez d'autres langages et leurs extensions ici
};

const FilePreview = ({ fileUrl, height = '20vh' }) => {
    const [content, setContent] = useState('');
    const [language, setLanguage] = useState('');

    const fetchFileContent = async (fileUrl) => {
        try {
            const response = await fetch(fileUrl);
            const text = await response.text();
            return text;
        } catch (error) {
            console.error("Error fetching file content", error);
            return "Unable to load file content.";
        }
    };

    useEffect(() => {
        const loadFileContent = async () => {
            const fileContent = await fetchFileContent(fileUrl);
            setContent(fileContent);

            const extension = fileUrl.split('.').pop();
            const detectedLanguage = languageMap[extension] || 'plaintext';
            setLanguage(detectedLanguage);
        };
        loadFileContent();
    }, [fileUrl]);

    return (
        <div className="mt-4">
            <div className="border rounded p-2 text-gray-500">
                <p>File Preview:</p>
                <div className="mt-2">
                    <Editor
                        height={height} // Utiliser la hauteur définie ou une valeur par défaut
                        language={language}
                        theme="vs-dark"
                        value={content}
                        options={{
                            readOnly: true,
                            automaticLayout: true,
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default FilePreview;
