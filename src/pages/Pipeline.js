import React, { useState, useContext, useEffect } from 'react';
import { FaTimes, FaFileAlt, FaPlus, FaTrash } from 'react-icons/fa';
import { BsCloudDownload } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { UserContext } from '../contexts/UserContext';
import { createPipeline, getPrograms } from '../services/api.program';
import fileIcons from '../utils/fileIcons';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const Pipeline = () => {
    const { t } = useTranslation();
    const { user } = useContext(UserContext);
    const [programs, setPrograms] = useState([]);
    const [filteredPrograms, setFilteredPrograms] = useState([]);
    const [selectedPrograms, setSelectedPrograms] = useState([]);
    const [inputFile, setInputFile] = useState(null);
    const [fileError, setFileError] = useState(null);
    const [executionError, setExecutionError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [fileUrls, setFileUrls] = useState([]); // Nouveau state pour les URLs des fichiers
    const [fileContents, setFileContents] = useState([]); // Nouveau state pour les contenus des fichiers
    const navigate = useNavigate();

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            const response = await getPrograms();
            setPrograms(response.data);
            setFilteredPrograms(response.data);
        } catch (error) {
            console.error(t('error_fetching_programs'), error);
        }
    };

    const handleDragStart = (program) => {
        return JSON.stringify(program);
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        const program = JSON.parse(e.dataTransfer.getData('program'));

        if (selectedPrograms.length === 0) {
            setSelectedPrograms([program]);
            setFileError(null);
            setExecutionError(null);
        } else {
            const lastProgram = selectedPrograms[selectedPrograms.length - 1];
            if (lastProgram.output_type === program.input_type) {
                setSelectedPrograms([...selectedPrograms, program]);
                setFileError(null);
                setExecutionError(null);
            } else {
                setFileError(t('file_error_output_mismatch', { title: program.title }));
            }
        }

        if (inputFile) {
            await submitPipeline([...selectedPrograms, program], inputFile);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const program = selectedPrograms[0];
            const fileExtension = '.' + file.name.split('.').pop();

            if (fileExtension === program.input_type) {
                setInputFile(file);
                setFileError(null);
                await submitPipeline([program], file); // Submit the pipeline automatically
            } else {
                setFileError(t('file_error_input_mismatch', { inputType: program.input_type }));
            }
        }
    };

    const handleHomeClick = () => {
        navigate("/home");
    };

    const fetchFileContent = async (url) => {
        try {
            const response = await axios.get(url, { responseType: 'blob' });
            const fileType = response.data.type;

            const fileReader = new FileReader();
            fileReader.onload = () => {
                const content = fileReader.result;
                if (fileType === 'application/pdf') {
                    setFileContents((prevContents) => [...prevContents, { content: 'PDF content cannot be displayed directly. Download the file to view.', url }]);
                } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                    setFileContents((prevContents) => [...prevContents, { content: 'Word content cannot be displayed directly. Download the file to view.', url }]);
                } else {
                    setFileContents((prevContents) => [...prevContents, { content, url }]);
                }
            };

            if (fileType === 'application/pdf' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                fileReader.readAsArrayBuffer(response.data);
            } else {
                fileReader.readAsText(response.data);
            }
        } catch (error) {
            console.error('Error fetching file content:', error);
        }
    };

    const submitPipeline = async (programs, file) => {
        const formData = new FormData();
        formData.append('input_file', file);
        formData.append('programs', JSON.stringify(programs.map(prog => prog.file.split('/').pop())));

        try {
            const response = await createPipeline(formData);
            if (response && response.data && response.data.files_url) {
                const newFileUrls = Object.values(response.data.files_url);
                setFileUrls(newFileUrls);
                setExecutionError(null);
                Swal.fire({
                    icon: 'success',
                    title: t('pipeline_created_title'),
                    text: t('pipeline_created_text'),
                });

                for (const url of newFileUrls) {
                    await fetchFileContent(url);
                }
            } else {
                throw new Error(t('error_creating_pipeline'));
            }
        } catch (error) {
            console.error(t('error_creating_pipeline'), error);
            setExecutionError(error.response?.data?.error || error.message);
            Swal.fire({
                icon: 'error',
                title: t('error_title'),
                text: t('pipeline_error_text'),
            });
        }
    };

    const handleSearchChange = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = programs.filter((program) =>
            program.title.toLowerCase().includes(term)
        );
        setFilteredPrograms(filtered);
    };

    const handleReset = () => {
        setSelectedPrograms([]);
        setInputFile(null);
        setFileError(null);
        setFileUrls([]); // Reset les URLs des fichiers
        setFileContents([]); // Reset les contenus des fichiers
        setExecutionError(null);
    };

    const handleDownload = (fileUrl) => {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileUrl.split('/').pop();
        link.click();
    };

    return (
        <div className="min-h-screen flex mt-32 flex-col items-center justify-center bg-gray-100 p-4">
            <div className="relative bg-white rounded-lg shadow-lg p-8 flex flex-col w-full max-w-6xl overflow-y-hidden">
                <div className="flex justify-between items-center w-full mb-8">
                    <h2 className="text-2xl font-bold">{t('programs')}</h2>
                    <input
                        type="text"
                        placeholder={t('search_programs')}
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="p-2 border border-gray-300 rounded-md w-96"
                    />
                    <button
                        onClick={handleHomeClick}
                        className="flex items-center justify-center w-7 h-7 bg-blue-500 text-white rounded-full hover:bg-red-700 transition duration-200"
                    >
                        <FaTimes className="text-xl" />
                    </button>
                </div>
                <div className="overflow-y-auto max-h-72 w-full">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {filteredPrograms.map((program) => (
                                <div
                                    key={program.id}
                                    draggable={selectedPrograms.length === 0 || (selectedPrograms.length > 0 && inputFile !== null)}
                                    onDragStart={(e) => e.dataTransfer.setData('program', handleDragStart(program))}
                                    className={`p-4 border border-gray-300 rounded-md shadow-sm hover:shadow-md cursor-pointer ${
                                        (!inputFile && selectedPrograms.length > 0) || fileError ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                    onDragOver={(e) => {
                                        if ((!inputFile && selectedPrograms.length > 0) || fileError) {
                                            e.preventDefault();
                                        }
                                    }}
                                >
                                    <h3 className="text-lg font-semibold">{program.title}</h3>
                                    <p className="text-sm">{t('input')}: {program.input_type}</p>
                                    <p className="text-sm">{t('output')}: {program.output_type}</p>
                                    <p className="text-sm">{program.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="w-full flex items-center justify-between space-x-4 mt-8 mb-8">
                    <div className="flex items-center space-x-4">
                        {selectedPrograms.map((program, index) => (
                            <div className="flex flex-row items-center space-x-4" key={index}>
                                <div className="flex flex-col items-center">
                                    {fileIcons[program.input_type] || <FaFileAlt className="text-4xl"/>}
                                    <span className="text-lg font-semibold">{program.title}</span>
                                </div>
                                {index === 0 && inputFile && (
                                    <>
                                        <FaPlus className="text-xl text-blue-500"/>
                                        <div className="flex flex-col items-center">
                                            {fileIcons[inputFile.name.split('.').pop()] ||
                                                <FaFileAlt className="text-4xl"/>}
                                            <span className="text-sm">{inputFile.name}</span>
                                        </div>
                                    </>
                                )}
                                {fileUrls[index] && (
                                    <>
                                        <FaPlus className="text-xl text-blue-500"/>
                                        <div className="flex flex-col items-center">
                                            <BsCloudDownload
                                                title={t('download_file')}
                                                onClick={() => handleDownload(fileUrls[index])}
                                                className="text-2xl cursor-pointer hover:text-gray-400"
                                            />
                                            <span className="text-sm">{fileUrls[index].split('/').pop()}</span>
                                        </div>
                                    </>
                                )}
                                {index < selectedPrograms.length - 1 && (
                                    <div className="flex items-center justify-center">
                                        <span className="text-blue-500 text-2xl">------></span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {selectedPrograms.length > 0 && (
                        <button onClick={handleReset} className="text-red-500 hover:text-red-700">
                            <FaTrash className="text-xl" />
                        </button>
                    )}
                </div>
                <div
                    className="border border-dashed border-gray-300 p-4 rounded-md h-64 flex flex-col items-center justify-center"
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                >
                    {executionError ? (
                        <p className="text-red-500">{executionError}</p>
                    ) : selectedPrograms.length === 0 ? (
                        <p className="text-gray-500">{t('drag_and_drop')}</p>
                    ) : (
                        <div className="flex flex-col items-center">
                            {selectedPrograms.length > 0 && !inputFile && (
                                <input type="file" onChange={handleFileChange} className="mt-4"/>
                            )}
                            {fileContents.map((file, index) => (
                                <div key={index} className="mt-4 p-2 border border-gray-300 rounded-md bg-gray-50 w-full">
                                    <h4 className="text-lg font-semibold">Contenu du fichier:</h4>
                                    <p className="text-gray-700 whitespace-pre-line">{file.content}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {fileError && <p className="text-red-500 text-sm mt-2">{fileError}</p>}
            </div>
        </div>
    );
};

export default Pipeline;
