import React, { useState, useContext, useEffect } from 'react';
import { FaTimes, FaFileAlt, FaPlus, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { UserContext } from '../contexts/UserContext';
import { createPipeline, getPrograms } from '../services/api.program';
import fileIcons from '../utils/fileIcons';

const Pipeline = () => {
    const { user } = useContext(UserContext);
    const [programs, setPrograms] = useState([]);
    const [filteredPrograms, setFilteredPrograms] = useState([]);
    const [selectedPrograms, setSelectedPrograms] = useState([]);
    const [inputFile, setInputFile] = useState(null);
    const [fileError, setFileError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
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
            console.error("Error fetching programs", error);
        }
    };

    const handleDragStart = (program) => {
        return JSON.stringify(program);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const program = JSON.parse(e.dataTransfer.getData('program'));

        if (selectedPrograms.length === 0) {
            setSelectedPrograms([program]);
            setFileError(null);
        } else {
            const lastProgram = selectedPrograms[selectedPrograms.length - 1];
            if (lastProgram.output_type === program.input_type) {
                setSelectedPrograms([...selectedPrograms, program]);
                setFileError(null);
            } else {
                setFileError(`The output of the previous program does not match the input of ${program.title}`);
            }
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const program = selectedPrograms[0];
            const fileExtension = '.'+file.name.split('.').pop();

            if (fileExtension === program.input_type) {
                setInputFile(file);
                setFileError(null);
            } else {
                setFileError(`The selected file does not match the required input type (${program.input_type})`);
            }
        }
    };

    const handleHomeClick = () => {
        navigate("/home");
    };

    const handleSubmit = async () => {
        if (inputFile && selectedPrograms.length > 0) {
            const formData = new FormData();
            formData.append('input_file', inputFile);
            formData.append('programs', JSON.stringify(selectedPrograms.map(prog => prog.name)));

            try {
                await createPipeline(formData);
                Swal.fire({
                    icon: 'success',
                    title: 'Pipeline Created',
                    text: 'Your pipeline has been successfully created!',
                });
            } catch (error) {
                console.error("Error creating pipeline", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'There was an error creating your pipeline. Please try again later.',
                });
            }
        } else {
            if (!inputFile) {
                setFileError('Please select a file to upload');
            }
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
    };

    return (
        <div className="min-h-screen flex mt-32 flex-col items-center justify-center bg-gray-100 p-4">
            <div className="relative bg-white rounded-lg shadow-lg p-8 flex flex-col w-full max-w-6xl overflow-y-hidden">
                <div className="flex justify-between items-center w-full mb-8">
                    <h2 className="text-2xl font-bold">Programs</h2>
                    <input
                        type="text"
                        placeholder="Search programs..."
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
                                    draggable
                                    onDragStart={(e) => e.dataTransfer.setData('program', handleDragStart(program))}
                                    className={`p-4 border border-gray-300 rounded-md shadow-sm hover:shadow-md cursor-pointer ${
                                        !inputFile && selectedPrograms.length > 0 ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                    onDragOver={(e) => {
                                        if (!inputFile && selectedPrograms.length > 0) {
                                            e.preventDefault();
                                        }
                                    }}
                                >
                                    <h3 className="text-lg font-semibold">{program.title}</h3>
                                    <p className="text-sm">Input: {program.input_type}</p>
                                    <p className="text-sm">Output: {program.output_type}</p>
                                    <p className="text-sm">{program.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="w-full flex items-center justify-between space-x-4 mt-8 mb-8">
                    <div className="flex items-center space-x-4">
                        {selectedPrograms.map((program, index) => (
                            <div className="flex flex-row items-center space-x-4">
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
                    className="border border-dashed border-gray-300 p-4 rounded-md h-64 flex items-center justify-center"
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                >
                    <div className="text-center">
                        {selectedPrograms.length === 0 ? (
                            <p className="text-gray-500">Drag and drop a program here</p>
                        ) : (
                            <div className="flex flex-col items-center">
                                {selectedPrograms.length > 0 && !inputFile && (
                                    <input type="file" onChange={handleFileChange} className="mt-4"/>
                                )}
                                <p className="text-gray-500 mt-4">Drag and drop more programs to continue the pipeline</p>
                            </div>
                        )}
                    </div>
                </div>
                {fileError && <p className="text-red-500 text-sm mt-2">{fileError}</p>}
                <button
                    onClick={handleSubmit}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Valider
                </button>
            </div>
        </div>
    );
};

export default Pipeline;
