import React, { useState, useRef, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { saveAs } from 'file-saver';
import { Editor } from '@monaco-editor/react';
import { createProgram, updateProgram, runProgram } from '../services/api.program';
import { PiRocketLaunchLight } from 'react-icons/pi';
import { CiExport } from 'react-icons/ci';
import { CgCompressLeft } from 'react-icons/cg';
import { AiOutlineExpandAlt } from 'react-icons/ai';
import { VscRunAll } from "react-icons/vsc";
import { CiSquareChevDown } from 'react-icons/ci';
import { MdOutlineCloudDone } from 'react-icons/md';
import { FcCancel } from 'react-icons/fc';
import { IoMdAttach } from "react-icons/io";
import { BsCloudDownload } from 'react-icons/bs';
import { UserContext } from "../contexts/UserContext";
import { useTranslation } from 'react-i18next';

const MyEditor = () => {
    const location = useLocation();
    const program = location.state?.program || null;
    const { user } = useContext(UserContext);
    const { t } = useTranslation();
    const [code, setCode] = useState(program ? '' : '// Place your code here');
    const [language, setLanguage] = useState('javascript');
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [result, setResult] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState(program ? program.title : '');
    const [description, setDescription] = useState(program ? program.description : '');
    const [fileName, setFileName] = useState('');
    const [inputFileType, setInputFileType] = useState(program ? program.input_type : '.txt');
    const [outputFileType, setOutputFileType] = useState(program ? program.output_type : '.txt');
    const [isVisible, setIsVisible] = useState(program ? program.isVisible : true);
    const [fileUrl, setFileUrl] = useState(null);
    const [fileDownloadName, setFileDownloadName] = useState(null);
    const fileInputRef = useRef(null);

    const fileTypes = ['.txt', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.csv', '.json', '.xml', '.html', '.js', '.py', '.java', '.png', '.jpg', '.jpeg', '.gif'];
    const languages = [
        { label: "JavaScript", value: "javascript" },
        { label: "Python", value: "python" },
        { label: "Java", value: "java" },
        { label: "C", value: "c" },
        { label: "C++", value: "cpp" },
        { label: "C#", value: "csharp" },
        { label: "Go", value: "go" },
        { label: "HTML", value: "html" },
        { label: "CSS", value: "css" },
        { label: "Ruby", value: "ruby" },
        { label: "PHP", value: "php" },
        { label: "Swift", value: "swift" },
        { label: "Kotlin", value: "kotlin" },
        { label: "R", value: "r" },
        { label: "TypeScript", value: "typescript" },
        { label: "Rust", value: "rust" },
        { label: "SQL", value: "sql" },
        { label: "Perl", value: "perl" },
        { label: "Scala", value: "scala" },
        { label: "Shell", value: "shell" },
    ];

    useEffect(() => {
        if (program && program.file) {
            fetchFileContent(program.file);
            const fileExtension = getFileExtension(program.file);
            setLanguageFromExtension(fileExtension);
        }
    }, [program]);

    const fetchFileContent = async (fileUrl) => {
        try {
            const response = await fetch(fileUrl);
            const text = await response.text();
            setCode(text);
        } catch (error) {
            console.error(t('error_fetching_file'), error);
        }
    };

    const getFileExtension = (filename) => {
        return filename.split('.').pop();
    };

    const setLanguageFromExtension = (extension) => {
        const languageMap = {
            'js': 'javascript',
            'py': 'python',
            'java': 'java',
            'c': 'c',
            'cpp': 'cpp',
            'cs': 'csharp',
            'go': 'go',
            'html': 'html',
            'css': 'css',
            'rb': 'ruby',
            'php': 'php',
            'swift': 'swift',
            'kt': 'kotlin',
            'r': 'r',
            'ts': 'typescript',
            'rs': 'rust',
            'sql': 'sql',
            'pl': 'perl',
            'scala': 'scala',
            'sh': 'shell'
        };
        setLanguage(languageMap[extension] || 'text');
    };

    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
        setCode('// Place your code here');
    };

    const handleExport = () => {
        const fileName = prompt(t('enter_file_name'));
        if (fileName) {
            const extensionMap = {
                'javascript': 'js',
                'python': 'py',
                'java': 'java',
                'c': 'c',
                'cpp': 'cpp',
                'csharp': 'cs',
                'go': 'go',
                'html': 'html',
                'css': 'css',
                'ruby': 'rb',
                'php': 'php',
                'swift': 'swift',
                'kotlin': 'kt',
                'r': 'r',
                'typescript': 'ts',
                'rust': 'rs',
                'sql': 'sql',
                'perl': 'pl',
                'scala': 'scala',
                'shell': 'sh'
            };
            const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
            saveAs(blob, `${fileName}.${extensionMap[language] || 'txt'}`);
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
        const extensionMap = {
            'javascript': 'js',
            'python': 'py',
            'java': 'java',
            'c': 'c',
            'cpp': 'cpp',
            'csharp': 'cs',
            'go': 'go',
            'html': 'html',
            'css': 'css',
            'ruby': 'rb',
            'php': 'php',
            'swift': 'swift',
            'kotlin': 'kt',
            'r': 'r',
            'typescript': 'ts',
            'rust': 'rs',
            'sql': 'sql',
            'perl': 'pl',
            'scala': 'scala',
            'shell': 'sh'
        };
        formData.append('file', file, `program.${extensionMap[language] || 'txt'}`);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('input_type', inputFileType);
        formData.append('output_type', outputFileType);
        formData.append('isVisible', isVisible);

        try {
            if (program) {
                await updateProgram(program.id, formData);
            } else {
                await createProgram(formData);
            }
            setResult(t('program_deployed_success'));
        } catch (error) {
            console.error(t('error_deploying_program'), error);
            setResult(t('program_deploy_error'));
        }
    };

    const handleFileIconClick = () => {
        fileInputRef.current.click();
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
        }
    };

    const handleRun = async () => {
        if (!fileName) {
            setResult(t('select_file_before_run'));
            return;
        }

        const formData = new FormData();
        const scriptFile = new Blob([code], { type: 'text/plain' });
        const inputFile = fileInputRef.current.files[0];

        const extensionMap = {
            'javascript': 'js',
            'python': 'py',
            'java': 'java',
            'c': 'c',
            'cpp': 'cpp',
            'csharp': 'cs',
            'go': 'go',
            'html': 'html',
            'css': 'css',
            'ruby': 'rb',
            'php': 'php',
            'swift': 'swift',
            'kotlin': 'kt',
            'r': 'r',
            'typescript': 'ts',
            'rust': 'rs',
            'sql': 'sql',
            'perl': 'pl',
            'scala': 'scala',
            'shell': 'sh'
        };

        formData.append('script_file', scriptFile, `script.${extensionMap[language] || 'txt'}`);
        formData.append('input_file', inputFile);

        try {
            const response = await runProgram(formData);
            const fileUrl = response.data.file_url;
            setFileUrl(fileUrl);
            setFileDownloadName(fileUrl.split('/').pop());
            setResult(t('program_executed_success'));
        } catch (error) {
            console.error(t('error_executing_program'), error);
            setResult(`${t('program_execute_error')}: ${error.response?.data?.error || error.message}`);
        }
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileDownloadName;
        link.click();
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
                    {languages.map(lang => (
                        <option key={lang.value} value={lang.value}>{lang.label}</option>
                    ))}
                </select>
                <div className="flex items-center gap-4">
                    <VscRunAll
                        title={t('run')}
                        onClick={handleRun}
                        className="text-2xl cursor-pointer hover:text-gray-400 ml-4"
                    />
                    <PiRocketLaunchLight
                        title={t('deploy')}
                        onClick={handleDeploy}
                        className="text-2xl cursor-pointer hover:text-gray-400 ml-4"
                    />
                    <CiExport
                        title={t('export')}
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
                            placeholder={t('select_file')}
                        />
                        <CiSquareChevDown
                            className="text-2xl text-white absolute right-2 cursor-pointer"
                            onClick={handleFileIconClick}
                        />
                    </div>
                    {fileUrl && (
                        <div className="flex items-center">
                            <BsCloudDownload
                                title={t('download_file')}
                                onClick={handleDownload}
                                className="text-2xl cursor-pointer hover:text-gray-400 ml-4"
                            />
                            <span className="ml-2">{fileDownloadName}</span>
                        </div>
                    )}
                    {isFullScreen ? (
                        <CgCompressLeft
                            title={t('exit_fullscreen')}
                            onClick={handleFullScreenToggle}
                            className="text-2xl cursor-pointer hover:text-gray-400 ml-4"
                        />
                    ) : (
                        <AiOutlineExpandAlt
                            title={t('enter_fullscreen')}
                            onClick={handleFullScreenToggle}
                            className="text-2xl cursor-pointer hover:text-gray-400 ml-4"
                        />
                    )}
                </div>
            </div>
            <div className="flex flex-row items-start justify-center w-full">
                <Editor
                    width="100%"
                    height="60vh"
                    language={language}
                    theme="vs-dark"
                    value={code}
                    onChange={(newCode) => setCode(newCode)}
                />
            </div>
            <div className="w-full bg-gray-800 text-white px-8 py-8 mb-2">
                <h2 className="text-lg font-bold">{t('result')}:</h2>
                <pre>{result}</pre>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
                    <div className="bg-gray-800 text-white rounded-lg p-8 w-11/12 md:w-1/2 lg:w-1/3">
                        <h2 className="text-2xl mb-4">{t('deploy_program')}</h2>
                        <input
                            type="text"
                            placeholder={t('title')}
                            className="w-full p-2 mb-4 bg-gray-900 border border-gray-700 rounded"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder={t('description')}
                            className="w-full p-2 mb-4 bg-gray-900 border border-gray-700 rounded"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <label className="block mb-2">{t('input_file_type')}</label>
                        <select
                            value={inputFileType}
                            onChange={(e) => setInputFileType(e.target.value)}
                            className="w-full p-2 mb-4 bg-gray-900 border border-gray-700 rounded"
                        >
                            {fileTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        <label className="block mb-2">{t('output_file_type')}</label>
                        <select
                            value={outputFileType}
                            onChange={(e) => setOutputFileType(e.target.value)}
                            className="w-full p-2 mb-4 bg-gray-900 border border-gray-700 rounded"
                        >
                            {fileTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex items-center px-4 py-2 bg-red-600 rounded hover:bg-red-700"
                            >
                                <FcCancel className="mr-2" /> {t('cancel')}
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="flex items-center px-4 py-2 bg-green-600 rounded hover:bg-green-700"
                            >
                                <MdOutlineCloudDone className="mr-2" /> {t('confirm')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyEditor;
