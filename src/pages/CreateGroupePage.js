import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import { createGroup } from '../services/api.groups';
import { getAllUsers } from '../services/api.user';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import crewimage from "../assets/photos/groupe.png";
import { UserContext } from '../contexts/UserContext';
import { useTranslation } from 'react-i18next';

function CreateGroupePage() {
    const { t } = useTranslation();
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
            console.error(t('error_fetching_users'), error);
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
                toast.success(t('group_created_success'));
                setTimeout(() => {
                    navigate('/home', { state: { newGroup: response.data } });
                }, 1500);
            }
        } catch (error) {
            toast.error(t('error_creating_group'));
            console.error(t('error_creating_group'), error);
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
                <h1 className="text-2xl mb-4 text-center">{t('create_group')}</h1>
                <label className="mb-2">{t('group_name')}</label>
                <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="p-2 border rounded mb-4"
                    required
                />
                <label className="mb-2">{t('description')}</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="p-2 border rounded mb-4"
                    required
                />
                <label className="mb-2">{t('add_members')}</label>
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
                        <AiOutlineClose className="mr-2" /> {t('cancel')}
                    </button>
                    <button
                        type="submit"
                        className="flex items-center justify-center p-2 bg-green-500 text-white rounded"
                    >
                        <AiOutlineCheck className="mr-2" /> {t('submit')}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateGroupePage;
