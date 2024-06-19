import React, { useState, useEffect } from 'react';
import { FaEllipsisV, FaEdit, FaTrash, FaShareSquare } from 'react-icons/fa';
import { getPrograms, deleteProgram, updateProgram } from '../services/api.program'; // Assurez-vous d'importer correctement vos services

const Programmes = () => {
    const [programs, setPrograms] = useState([]);
    const [filteredPrograms, setFilteredPrograms] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            const response = await getPrograms();
            console.log(response);
            const visiblePrograms = response.data;
            setPrograms(visiblePrograms);
            setFilteredPrograms(visiblePrograms);
        } catch (error) {
            console.error("Error fetching programs", error);
        }
    };

    const handleSearch = () => {
        const filtered = programs.filter(program =>
            program.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPrograms(filtered);
    };

    const handleEditProgram = (programId) => {
        console.log("Edit program with ID:", programId);
        // Logic to edit program goes here
    };

    const handleDeleteProgram = async (programId) => {
        try {
            await deleteProgram(programId);
            fetchPrograms();
        } catch (error) {
            console.error("Error deleting program", error);
        }
    };

    const handleShareProgram = async (programId) => {
        try {
            const program = programs.find(p => p.id === programId);
            if (program) {
                const newVisibility = !program.isVisible;
                await updateProgram(programId, {
                    title: program.title,
                    description: program.description,
                    isVisible: newVisibility
                });
                fetchPrograms();
            }
        } catch (error) {
            console.error("Error sharing program", error);
        }
    };

    return (
        <div className="container mx-auto px-4 pt-32 flex">
            {/* Programs Section */}
            <div className="w-2/3 pr-4">
                <div className="mt-4 space-y-4">
                    {filteredPrograms.map(program => (
                        <div key={program.id} className="p-4 border border-gray-300 rounded shadow-lg bg-white relative">
                            <h2 className="text-xl font-bold">{program.title}</h2>
                            <p className="text-gray-700">{program.description}</p>
                            {program.file && (
                                <div className="mt-4">
                                    <div className="border rounded p-2 text-gray-500">
                                        <p>File Preview:</p>
                                        <a href={program.file} target="_blank" rel="noopener noreferrer">View File</a>
                                    </div>
                                </div>
                            )}
                            <div className="absolute top-2 right-2">
                                <Menu
                                    programId={program.id}
                                    onEdit={handleEditProgram}
                                    onDelete={handleDeleteProgram}
                                    onShare={handleShareProgram}
                                    isVisible={program.isVisible}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Menu = ({ programId, onEdit, onDelete, onShare, isVisible }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <FaEllipsisV className="cursor-pointer" onClick={() => setIsOpen(!isOpen)} />
            {isOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded shadow-lg">
                    <button
                        className="block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-200 flex items-center"
                        onClick={() => {
                            onEdit(programId);
                            setIsOpen(false);
                        }}
                    >
                        <FaEdit className="mr-2" /> Modifier
                    </button>
                    <button
                        className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-200 flex items-center"
                        onClick={() => {
                            onDelete(programId);
                            setIsOpen(false);
                        }}
                    >
                        <FaTrash className="mr-2" /> Supprimer
                    </button>
                    <button
                        className={`block w-full text-left px-4 py-2 ${isVisible ? 'text-green-500' : 'text-gray-800'} hover:bg-gray-200 flex items-center`}
                        onClick={() => {
                            onShare(programId);
                            setIsOpen(false);
                        }}
                    >
                        <FaShareSquare className="mr-2" /> {isVisible ? "Retirer partage" : "Partager"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Programmes;
