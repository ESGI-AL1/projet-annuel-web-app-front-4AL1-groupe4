import React, { useEffect, useState } from 'react';
import { getPublicPrograms } from "../services/api.program";
import ProgramDetails from './ProgramDetails';

const ListeProgram = ({ user, actions, setActions }) => {
    const [programs, setPrograms] = useState([]);
    const [filteredPrograms, setFilteredPrograms] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            const response = await getPublicPrograms();
            const visiblePrograms = response.data.filter(program => program.isVisible);
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

    return (
        <div className="mt-4 space-y-4">
            {/*
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search programs"
        className="p-2 border border-gray-300 rounded"
      />
      <button onClick={handleSearch} className="ml-2 p-2 bg-blue-500 text-white rounded">Search</button>
      */}
            {filteredPrograms.map(program => (
                <div key={program.id} className="p-4 border border-gray-100 rounded-lg shadow-lg bg-white relative">
                    <ProgramDetails program={program} user={user} actions={actions} setActions={setActions}/>
                </div>
            ))}
        </div>);
};

export default ListeProgram;
