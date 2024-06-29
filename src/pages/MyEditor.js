import React, { useState, useRef } from 'react';
import { saveAs } from 'file-saver';
import { Editor } from '@monaco-editor/react';
import { createProgram } from '../services/api.program';
import { PiRocketLaunchLight } from 'react-icons/pi';
import { CiExport } from 'react-icons/ci';
import { CgCompressLeft } from 'react-icons/cg';
import { AiOutlineExpandAlt } from 'react-icons/ai';
import { VscRunAll } from "react-icons/vsc";
import { CiSquareChevDown } from 'react-icons/ci';
import { MdOutlineCloudDone } from 'react-icons/md';
import { FcCancel } from 'react-icons/fc';
import { IoMdAttach } from "react-icons/io";

const MyEditor = () => {
    const [code, setCode] = useState('// Place your code here');
    const [language, setLanguage] = useState('javascript');
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [result, setResult] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef(null);

    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
        setCode('// Place your code here');
    };

    const handleExport = () => {
        const fileName = prompt('Enter file name:');
        if (fileName) {
            let extension = '';
            switch (language) {
                case 'javascript':
                    extension = 'js';
                    break;
                case 'python':
                    extension = 'py';
                    break;
                case 'java':
                    extension = 'java';
                    break;
                default:
                    extension = 'txt';
            }
            const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
            saveAs(blob, `${fileName}.${extension}`);
        }
    };

    const handleFullScreenToggle = () => {
        setIsFullScreen(!isFullScreen);
    };

    const handleDeploy = () => {
        setIsModalOpen(true);
    };

    const handleConfirm = async () => {
        setIsModalOpen(false);
        const formData = new FormData();
        const file = new Blob([code], { type: 'text/plain' });
        let extension = '';
        switch (language) {
            case 'javascript':
                extension = 'js';
                break;
            case 'python':
                extension = 'py';
                break;
            case 'java':
                extension = 'java';
                break;
            default:
                extension = 'txt';
        }
        formData.append('file', file, `program.${extension}`);
        formData.append('title', title);
        formData.append('description', description);

        try {
            const response = await createProgram(formData);
            setResult(response.data.result); // Assuming the API returns the result in this format
        } catch (error) {
            console.error('Error deploying program:', error);
            setResult('Error deploying program.');
        }
    };

    const handleFileIconClick = () => {
        fileInputRef.current.click();
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = (e) => {
                setCode(e.target.result);
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className={`pt-36 flex flex-col items-center justify-center ${isFullScreen ? 'p-0' : 'px-4'} transition-all duration-300`}>
            {/* Navbar */}
            <div className="flex items-center justify-between bg-gray-800 text-white px-4 py-6 w-full" style={{ height: '40px' }}>
                <select
                    value={language}
                    onChange={handleLanguageChange}
                    className="bg-gray-700 text-white px-2 py-1 rounded focus:outline-none"
                >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                </select>
                <div className="flex items-center gap gap-4">
                    <VscRunAll
                        title="Execute"
                        className="text-2xl cursor-pointer hover:text-gray-400 ml-4"
                    />
                    <PiRocketLaunchLight
                        title="Deploy"
                        onClick={handleDeploy}
                        className="text-2xl cursor-pointer hover:text-gray-400 ml-4"
                    />
                    <CiExport
                        title="Export"
                        onClick={handleExport}
                        className="text-2xl cursor-pointer hover:text-gray-400 ml-4"
                    />
                    <div className="relative border border-white rounded-md flex items-center ml-4">
                        <IoMdAttach className="text-2xl text-white absolute left-2" />
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            className="bg-white text-white pl-10 pr-8 py-1 rounded focus:outline-none opacity-0 absolute left-0 w-full border-white"
                        />
                        <input
                            type="text"
                            className="bg-gray-800 text-white pl-10 pr-8 py-1 rounded focus:outline-none border-white"
                            readOnly
                            value={fileName}
                            placeholder="Select file"
                        />
                        <CiSquareChevDown
                            className="text-2xl text-white absolute right-2 cursor-pointer"
                            onClick={handleFileIconClick}
                        />
                    </div>
                    {isFullScreen ? (
                        <CgCompressLeft
                            title="Exit Fullscreen"
                            onClick={handleFullScreenToggle}
                            className="text-2xl cursor-pointer hover:text-gray-400 ml-4"
                        />
                    ) : (
                        <AiOutlineExpandAlt
                            title="Enter Fullscreen"
                            onClick={handleFullScreenToggle}
                            className="text-2xl cursor-pointer hover:text-gray-400 ml-4"
                        />
                    )}
                </div>
            </div>
            <div className="flex flex-row items-start justify-center w-full">
                <Editor
                    width="100%"
                    height="75vh"
                    language={language}
                    theme="vs-dark"
                    value={code}
                    onChange={(newCode) => setCode(newCode)}
                />
            </div>
            <div className="w-full bg-gray-800 text-white px-8 py-8 mb-2">
                <h2 className="text-lg font-bold">Result:</h2>
                <pre>{result}</pre>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
                    <div className="bg-gray-800 text-white rounded-lg p-8 w-1/3">
                        <h2 className="text-2xl mb-4">Deploy Program</h2>
                        <input
                            type="text"
                            placeholder="Title"
                            className="w-full p-2 mb-4 bg-gray-900 border border-gray-700 rounded"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            className="w-full p-2 mb-4 bg-gray-900 border border-gray-700 rounded"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex items-center px-4 py-2 bg-red-600 rounded hover:bg-red-700"
                            >
                                <FcCancel className="mr-2" /> Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="flex items-center px-4 py-2 bg-green-600 rounded hover:bg-green-700"
                            >
                                <MdOutlineCloudDone className="mr-2" /> Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyEditor;
