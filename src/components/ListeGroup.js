import React, { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGroups, updateGroup, deleteGroup } from "../services/api.groups";
import { getAllUsers } from "../services/api.user";
import { UserContext } from "../contexts/UserContext";
import { FaEllipsisV, FaEdit, FaTrash, FaUserPlus } from 'react-icons/fa';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ListeGroup = () => {
    const { user } = useContext(UserContext);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showUpdatePopup, setShowUpdatePopup] = useState(false);
    const [showAddUserPopup, setShowAddUserPopup] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [menuOpen, setMenuOpen] = useState(null);
    const [searchText, setSearchText] = useState('');

    const menuRefs = useRef([]);
    const updatePopupRef = useRef(null);
    const addUserPopupRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchGroups();
        fetchUsers();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRefs.current && !menuRefs.current.some(ref => ref && ref.contains(event.target))) {
                setMenuOpen(null);
            }
            if (updatePopupRef.current && !updatePopupRef.current.contains(event.target)) {
                setShowUpdatePopup(false);
            }
            if (addUserPopupRef.current && !addUserPopupRef.current.contains(event.target)) {
                setShowAddUserPopup(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const fetchGroups = async () => {
        try {
            const response = await getGroups();
            setGroups(response.data);
            setLoading(false);
        } catch (error) {
            setError("There was an error fetching the groups!");
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await getAllUsers();
            setUsers(response.data);
            setFilteredUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleUpdateGroup = async () => {
        if (selectedGroup) {
            try {
                await updateGroup(selectedGroup.id, { name: groupName, description: groupDescription, members: selectedGroup.members });
                fetchGroups();
                setShowUpdatePopup(false);
            } catch (error) {
                console.error('Error updating group:', error);
            }
        }
    };

    const handleDeleteGroup = async (groupId) => {
        try {
            const resp = await deleteGroup(groupId);
            if (resp) {
                toast.success("Successfully deleted the group.");
                fetchGroups();
            } else {
                toast.error("Failed to delete the group.");
            }
        } catch (error) {
            console.error('Error deleting group:', error);
            toast.error('Error deleting group. Please try again later.');
        }
    };

    const handleAddUserToGroup = async (userId) => {
        if (selectedGroup) {
            try {
                const updatedGroup = {
                    ...selectedGroup,
                    members: [...selectedGroup.members, userId]
                };
                await updateGroup(selectedGroup.id, updatedGroup);
                fetchGroups();
                setShowAddUserPopup(false);
            } catch (error) {
                console.error('Error adding user to group:', error);
            }
        }
    };

    const openUpdatePopup = (group) => {
        setSelectedGroup(group);
        setGroupName(group.name);
        setGroupDescription(group.description);
        setShowUpdatePopup(true);
        setMenuOpen(null);
    };

    const openAddUserPopup = (group) => {
        setSelectedGroup(group);
        setShowAddUserPopup(true);
        setMenuOpen(null);
    };

    const toggleMenu = (groupId) => {
        setMenuOpen(prevMenuOpen => (prevMenuOpen === groupId ? null : groupId));
    };

    const handleSearchChange = (e) => {
        const searchValue = e.target.value;
        setSearchText(searchValue);
        if (searchValue.trim()) {
            const filtered = users.filter(user =>
                user.first_name.toLowerCase().includes(searchValue.toLowerCase()) ||
                user.last_name.toLowerCase().includes(searchValue.toLowerCase()) ||
                user.email.toLowerCase().includes(searchValue.toLowerCase())
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users);
        }
    };

    const handleGroupClick = (group) => {
        navigate(`/chat`, { state: { group } });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="bg-gray-100 rounded shadow-lg max-h-96 overflow-y-auto relative">
            <div className="sticky top-0 bg-white p-4 z-10">
                <h2 className="text-2xl font-bold mb-4">Liste des groupes</h2>
            </div>
            <div className="p-4">
                {groups.map((group, index) => (
                    <div
                        key={group.id}
                        className="flex items-center justify-between mb-4 p-2 border rounded bg-gray-100 cursor-pointer"
                        onClick={() => handleGroupClick(group)}
                    >
                        <div className="ml-4">
                            <p className="font-bold">{group.name}</p>
                            <p className="text-sm text-gray-600">{group.description}</p>
                        </div>
                        {group.author_id === user.id && (
                            <div className="relative" ref={el => menuRefs.current[index] = el} onClick={(e) => e.stopPropagation()}>
                                <FaEllipsisV className="cursor-pointer" onClick={() => toggleMenu(group.id)} />
                                {menuOpen === group.id && (
                                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded shadow-lg z-20">
                                        <button
                                            className="block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-200 flex items-center"
                                            onClick={() => openUpdatePopup(group)}
                                        >
                                            <FaEdit className="mr-2" /> Modifier
                                        </button>
                                        <button
                                            className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-200 flex items-center"
                                            onClick={() => handleDeleteGroup(group.id)}
                                        >
                                            <FaTrash className="mr-2" /> Supprimer
                                        </button>
                                        <button
                                            className="block w-full text-left px-4 py-2 text-green-500 hover:bg-gray-200 flex items-center"
                                            onClick={() => openAddUserPopup(group)}
                                        >
                                            <FaUserPlus className="mr-2" /> Ajouter
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {showUpdatePopup && selectedGroup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
                    <div className="bg-white p-6 rounded-lg shadow-lg" ref={updatePopupRef}>
                        <h2 className="text-xl font-bold mb-4">Modifier le groupe</h2>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            placeholder="Nom du groupe"
                        />
                        <textarea
                            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                            value={groupDescription}
                            onChange={(e) => setGroupDescription(e.target.value)}
                            placeholder="Description du groupe"
                        />
                        <button
                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                            onClick={handleUpdateGroup}
                        >
                            Valider
                        </button>
                        <button
                            className="bg-red-500 text-white py-2 px-4 rounded ml-2 hover:bg-red-700"
                            onClick={() => setShowUpdatePopup(false)}
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            )}

            {showAddUserPopup && selectedGroup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full" ref={addUserPopupRef}>
                        <h2 className="text-xl font-bold mb-4">Ajouter un utilisateur au groupe</h2>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                            value={searchText}
                            onChange={handleSearchChange}
                            placeholder="Rechercher un utilisateur"
                        />
                        <div className="max-h-60 overflow-y-auto mb-4">
                            <ul>
                                {filteredUsers.map(user => (
                                    <li
                                        key={user.id}
                                        className="flex items-center justify-between p-2 border rounded bg-gray-100 mb-2 cursor-pointer"
                                    >
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                                                <span className="text-lg text-gray-600">{user.first_name.charAt(0)}{user.last_name.charAt(0)}</span>
                                            </div>
                                            <div>
                                                <p className="font-bold">{user.first_name} {user.last_name}</p>
                                                <p className="text-sm text-gray-600">{user.email}</p>
                                            </div>
                                        </div>
                                        <button
                                            className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-700"
                                            onClick={() => handleAddUserToGroup(user.id)}
                                        >
                                            Ajouter
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <button
                            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 w-full"
                            onClick={() => setShowAddUserPopup(false)}
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListeGroup;
