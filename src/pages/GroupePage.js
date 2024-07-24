import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AiOutlineUserAdd, AiOutlineMore } from 'react-icons/ai';
import { getGroupById, deleteGroup } from '../services/api.groups';
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';

function GroupePage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams();
    const [group, setGroup] = useState({});
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const response = await getGroupById(id);
                setGroup(response.data);
            } catch (error) {
                toast.error(t('error_fetching_group'), error);
            }
        };
        fetchGroup();
    }, [id, t]);

    const handleDeleteGroup = async () => {
        try {
            await deleteGroup(id);
            navigate('/groups');
        } catch (error) {
            console.error(t('error_deleting_group'), error);
        }
    };

    const handleEditGroup = () => {
        navigate(`/edit-group/${id}`);
    };

    return (
        <div className="container mx-auto p-4 mt-80 ">
            <div className="flex justify-between items-center bg-white shadow p-4 rounded-lg">
                <h1 className="text-2xl font-bold">{group.name}</h1>
                <div className="flex items-center">
                    <input
                        type="text"
                        placeholder={t('search')}
                        className="p-2 border rounded mr-4"
                    />
                    <AiOutlineUserAdd className="text-xl mr-4 cursor-pointer" />
                    <div className="relative">
                        <AiOutlineMore className="text-xl cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)} />
                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg">
                                <button
                                    onClick={handleEditGroup}
                                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                                >
                                    {t('edit_group')}
                                </button>
                                <button
                                    onClick={handleDeleteGroup}
                                    className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-200"
                                >
                                    {t('delete_group')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="mt-4">
                {/* Informations supplémentaires ou autres composants */}
            </div>
        </div>
    );
}

export default GroupePage;
