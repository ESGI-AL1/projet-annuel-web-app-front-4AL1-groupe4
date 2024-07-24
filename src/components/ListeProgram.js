import React, { useEffect, useState } from 'react';
import { getPublicPrograms } from "../services/api.program";
import ProgramDetails from './ProgramDetails';
import { useTranslation } from 'react-i18next';

const ListeProgram = ({ user, actions, setActions }) => {
    const { t } = useTranslation();
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
            console.error(t('error_fetching_programs'), error);
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

            {filteredPrograms.map(program => (
                <div key={program.id} className="p-4 border border-gray-100 rounded-lg shadow-lg bg-white relative">
                    <ProgramDetails program={program} user={user} actions={actions} setActions={setActions} />
                </div>
            ))}
        </div>
    );
};

export default ListeProgram;
