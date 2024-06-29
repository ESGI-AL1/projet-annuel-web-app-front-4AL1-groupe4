import React, { useState, useEffect } from 'react';
import { getPrograms } from '../services/api.program'; // Assuming getPrograms is the API call function

const Pipeline = () => {
    const [programs, setPrograms] = useState([]);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [result, setResult] = useState(null);

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            const response = await getPrograms();
            const visiblePrograms = response.data;
            setPrograms(visiblePrograms);
        } catch (error) {
            console.error("Error fetching programs", error);
        }
    };

    const handleDragStart = (program) => {
        setSelectedProgram(program);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        // Handle the drop logic, initiate file upload
    };

    const handleFileChange = (e) => {
        setUploadedFile(e.target.files[0]);
    };

    const handleFileUpload = async () => {
        // Process file upload and move to step 2
        // After processing, set the result
    };

    const downloadResult = () => {
        // Logic to download the result file
    };

    return (
        <div className="container mx-auto p-4 mt-32">
            <div className="flex">
                <div className="w-1/3">
                    <div className="mb-4">
                        <input type="text" placeholder="Search programs..." className="w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                    <h2 className="text-xl font-bold mb-4">Programs</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {programs.map((program) => (
                            <div
                                key={program.id}
                                draggable
                                onDragStart={() => handleDragStart(program)}
                                className="p-4 border border-gray-300 rounded-md shadow-sm hover:shadow-md cursor-pointer"
                            >
                                <h3 className="text-lg font-semibold">{program.title}</h3>
                                <p className="text-sm">{program.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-2/3 pl-4">
                    <div className="mb-4">
                        <h2 className="text-xl font-bold mb-4">Pipeline</h2>
                        <div className="flex justify-between mb-4">
                            <span className="text-blue-500">Step 1</span>
                            <span className="text-blue-500">Step 2</span>
                            <span className="text-blue-500">Step 3</span>
                        </div>
                    </div>
                    <div className="border border-dashed border-gray-300 p-4 rounded-md h-64 flex items-center justify-center"
                         onDrop={handleDrop}
                         onDragOver={(e) => e.preventDefault()}
                    >
                        {!selectedProgram && (
                            <div className="text-center">
                                <svg className="w-12 h-12 mx-auto text-blue-500" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M3 15a4 4 0 004 4h10a4 4 0 004-4V5a4 4 0 00-4-4H7a4 4 0 00-4 4v10zm6-3l3-3 3 3m-3-3v12"></path>
                                </svg>

                                <p className="text-gray-500 mt-2">Drag and drop a program here</p>
                                <p className="text-gray-500 mt-1">or</p>
                                <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md">Browse files
                                </button>
                            </div>
                        )}
                        {selectedProgram && (
                            <div className="text-center">
                                <h3 className="text-lg font-semibold mb-2">{selectedProgram.title}</h3>
                                <input type="file" onChange={handleFileChange} className="hidden" id="file-upload" />
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    <div className="flex flex-col items-center">
                                        <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M3 15a4 4 0 004 4h10a4 4 0 004-4V5a4 4 0 00-4-4H7a4 4 0 00-4 4v10zm6-3l3-3 3 3m-3-3v12"></path>
                                        </svg>
                                        <p className="text-gray-500 mt-2">Upload file</p>
                                    </div>
                                </label>
                                {uploadedFile && (
                                    <div className="mt-2">
                                        <p>{uploadedFile.name}</p>
                                        <button onClick={handleFileUpload} className="px-4 py-2 bg-blue-500 text-white rounded-md">Upload</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    {uploadedFile && (
                        <div className="mt-4 p-4 border border-gray-300 rounded-md">
                            <h3 className="text-lg font-semibold mb-2">Result</h3>
                            {result ? (
                                <div>
                                    <p className="mb-2">{result}</p>
                                    <button onClick={downloadResult} className="px-4 py-2 bg-green-500 text-white rounded-md">Download</button>
                                </div>
                            ) : (
                                <p className="text-gray-500">Processing...</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Pipeline;
