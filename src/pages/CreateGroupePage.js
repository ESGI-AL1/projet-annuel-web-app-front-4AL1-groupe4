import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import { createGroup } from '../services/api.groups';
import { getAllUsers } from '../services/api.user';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import crewimage from "../assets/photos/groupe.png";
import { UserContext } from '../contexts/UserContext';

function CreateGroupePage() {
    const { user } = useContext(UserContext);
    const [groupName, setGroupName] = useState('');
    const [description, setDescription] = useState('');
    const [members, setMembers] = useState([]);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await getAllUsers();
            const allUsers = response.data;

            const filteredUsers = allUsers.filter(u => u.id !== user.id);
            setUsers(filteredUsers);
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const groupData = {
                name: groupName,
                description,
                members: [...members, user.id],
            };
            const response = await createGroup(groupData);
            if (response.status === 201) {
                toast.success('Groupe créé avec succès !');
                setTimeout(() => {
                    navigate('/home', { state: { newGroup: response.data } });
                }, 1500);
            }
        } catch (error) {
            toast.error('Erreur lors de la création du groupe');
            console.error('Erreur lors de la création du groupe', error);
        }
    };

    const handleCancel = () => {
        setGroupName('');
        setDescription('');
        navigate('/home');
    };

    const handleMemberSelect = (userId) => {
        setMembers(prevSelected =>
            prevSelected.includes(userId)
                ? prevSelected.filter(id => id !== userId)
                : [...prevSelected, userId]
        );
    };

    return (
        <div className="flex h-screen items-center justify-center">
            <ToastContainer />
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
                <label className="mb-2">Ajouter des Membres</label>
                <div className="max-h-40 overflow-y-auto mb-4">
                    {users.map((user) => (
                        <div key={user.id} className="flex items-center mb-2">
                            <input
                                type="checkbox"
                                checked={members.includes(user.id)}
                                onChange={() => handleMemberSelect(user.id)}
                                className="mr-2"
                            />
                            <span>{`${user.first_name} ${user.last_name} (${user.email})`}</span>
                        </div>
                    ))}
                </div>
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
