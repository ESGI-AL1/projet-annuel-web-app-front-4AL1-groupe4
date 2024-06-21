import React, { useState } from 'react';
import crewimage from "../assets/photos/groupe.png";
import { useNavigate } from 'react-router-dom';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import { createGroup } from '../services/api.groups';

function CreateGroupePage() {
    const [groupName, setGroupName] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await createGroup({ name: groupName, description });
            if (response.status === 201) {
                navigate(`/groupePage/${response.data.id}`);
            }
        } catch (error) {
            console.error('Erreur lors de la création du groupe', error);
        }
    };

    const handleCancel = () => {
        setGroupName('');
        setDescription('');
    };

    return (
        <div className="flex h-screen items-center justify-center ">
            <img src={crewimage} alt="Groupe" className="w-1/3 h-auto" />
            <form onSubmit={handleSubmit} className="flex flex-col w-1/3 p-4 bg-white shadow-lg rounded-lg">
                <h1 className="text-2xl mb-4 text-center">Créer un Groupe</h1>
                <label className="mb-2">Nom du groupe</label>
                <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="p-2 border rounded mb-4"
                    required
                />
                <label className="mb-2">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="p-2 border rounded mb-4"
                    required
                />
                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="flex items-center justify-center p-2 bg-red-500 text-white rounded"
                    >
                        <AiOutlineClose className="mr-2" /> Annuler
                    </button>
                    <button
                        type="submit"
                        className="flex items-center justify-center p-2 bg-green-500 text-white rounded"
                    >
                        <AiOutlineCheck className="mr-2" /> Valider
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateGroupePage;
