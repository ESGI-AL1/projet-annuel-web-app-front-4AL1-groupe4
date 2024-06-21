import React, { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';

const FilePreview = ({ fileUrl }) => {
    const [content, setContent] = useState('');

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
        };
        loadFileContent();
    }, [fileUrl]);

    return (
        <div className="mt-4">
            <div className="border rounded p-2 text-gray-500">
                <p>File Preview:</p>
                <div className="mt-2">
                    <Editor
                        height="60vh"
                        language=""
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
