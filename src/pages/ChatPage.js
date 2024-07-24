import React, { useState, useEffect, useContext, useRef } from 'react';
import { FaPaperPlane, FaCamera, FaImage, FaCog, FaQuestion, FaUsers, FaTimes, FaEdit, FaTrash, FaEllipsisV } from 'react-icons/fa';
import { getAllUsers } from '../services/api.user';
import { listFriendRequests } from '../services/api.friendship';
import { getGroups, updateGroup } from '../services/api.groups';
import { getMessages, createMessage, updateMessage, deleteMessage } from '../services/api.message';
import { UserContext } from '../contexts/UserContext';
import { useTranslation } from 'react-i18next';

const ChatPage = () => {
    const { user } = useContext(UserContext);
    const { t } = useTranslation();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [friends, setFriends] = useState([]);
    const [filteredFriends, setFilteredFriends] = useState([]);
    const [groups, setGroups] = useState([]);
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [showMembers, setShowMembers] = useState(false);
    const [users, setUsers] = useState([]);
    const [memberSearchText, setMemberSearchText] = useState('');
    const [editingMessage, setEditingMessage] = useState(null);
    const [messageMenuOpen, setMessageMenuOpen] = useState(null);
    const messageMenuRef = useRef(null);

    useEffect(() => {
        if (user) {
            fetchFriends();
            fetchGroups();
            fetchUsers();
        }
    }, [user]);

    useEffect(() => {
        if (selectedFriend) {
            fetchMessagesForFriend(selectedFriend);
        } else if (selectedGroup) {
            fetchMessagesForGroup(selectedGroup);
        }
    }, [selectedFriend, selectedGroup]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (messageMenuRef.current && !messageMenuRef.current.contains(event.target)) {
                setMessageMenuOpen(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const fetchFriends = async () => {
        try {
            const usersResponse = await getAllUsers();
            const friendsResponse = await listFriendRequests();

            const allUsers = usersResponse.data;
            const friendships = friendsResponse.data;

            const acceptedFriends = friendships.filter(f => f.status === 'accepted').flatMap(f => {
                if (f.user === user.id) {
                    return f.friend;
                } else if (f.friend === user.id) {
                    return f.user;
                }
                return [];
            });

            const friendUsers = allUsers.filter(u => acceptedFriends.includes(u.id));
            setFriends(friendUsers);
            setFilteredFriends(friendUsers);
        } catch (error) {
            console.error(t('errorFetchingFriends'), error);
        }
    };

    const fetchGroups = async () => {
        try {
            const response = await getGroups();
            const userGroups = response.data.filter(group => group.members.includes(user.id));
            setGroups(userGroups);
            setFilteredGroups(userGroups);
        } catch (error) {
            console.error(t('errorFetchingGroups'), error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await getAllUsers();
            setUsers(response.data);
        } catch (error) {
            console.error(t('errorFetchingUsers'), error);
        }
    };

    const fetchMessagesForFriend = async (friend) => {
        try {
            const response = await getMessages();
            const allMessages = response.data;
            const relevantMessages = allMessages.filter(message =>
                (message.receiver === friend.id && message.sender === user.id) ||
                (message.sender === friend.id && message.receiver === user.id)
            );
            setMessages(relevantMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)));
        } catch (error) {
            console.error(t('errorFetchingMessages'), error);
        }
    };

    const fetchMessagesForGroup = async (group) => {
        try {
            const response = await getMessages();
            const allMessages = response.data;
            const relevantMessages = allMessages.filter(message => message.group_id === group.id);
            setMessages(relevantMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)));
        } catch (error) {
            console.error(t('errorFetchingMessages'), error);
        }
    };

    const handleSendMessage = async () => {
        if (newMessage.trim()) {
            const messageData = {
                content: newMessage,
                sender: user.id,
                receiver: selectedFriend ? selectedFriend.id : null,
                group_id: selectedGroup ? selectedGroup.id : null,
            };
            try {
                await createMessage(messageData);
                if (selectedFriend) {
                    fetchMessagesForFriend(selectedFriend);
                } else if (selectedGroup) {
                    fetchMessagesForGroup(selectedGroup);
                }
                setNewMessage('');
            } catch (error) {
                console.error(t('errorSendingMessage'), error);
            }
        }
    };

    const handleUpdateMessage = async (messageId, newContent) => {
        try {
            const oldMessage = messages.find((message) => message.id === messageId);
            const updatedMessage = {
                ...oldMessage,
                content: newContent
            };
            await updateMessage(messageId, updatedMessage);
            if (selectedFriend) {
                fetchMessagesForFriend(selectedFriend);
            } else if (selectedGroup) {
                fetchMessagesForGroup(selectedGroup);
            }
            setEditingMessage(null);
            setNewMessage('');
        } catch (error) {
            console.error(t('errorUpdatingMessage'), error);
        }
    };

    const handleDeleteMessage = async (messageId) => {
        try {
            await deleteMessage(messageId);
            if (selectedFriend) {
                fetchMessagesForFriend(selectedFriend);
            } else if (selectedGroup) {
                fetchMessagesForGroup(selectedGroup);
            }
        } catch (error) {
            console.error(t('errorDeletingMessage'), error);
        }
    };

    const handleEditMessage = (message) => {
        setEditingMessage(message);
        setNewMessage(message.content);
    };

    const handleSelectFriend = (friend) => {
        setSelectedFriend(friend);
        setSelectedGroup(null);
    };

    const handleSelectGroup = (group) => {
        setSelectedGroup(group);
        setSelectedFriend(null);
    };

    const handleSearchChange = (e) => {
        const searchValue = e.target.value;
        setSearchText(searchValue);

        if (searchValue.trim()) {
            const filteredFriends = friends.filter(friend =>
                (friend.first_name && friend.first_name.toLowerCase().includes(searchValue.toLowerCase())) ||
                (friend.last_name && friend.last_name.toLowerCase().includes(searchValue.toLowerCase())) ||
                (friend.username && friend.username.toLowerCase().includes(searchValue.toLowerCase()))
            );
            setFilteredFriends(filteredFriends);

            const filteredGroups = groups.filter(group =>
                group.name.toLowerCase().includes(searchValue.toLowerCase())
            );
            setFilteredGroups(filteredGroups);
        } else {
            setFilteredFriends(friends);
            setFilteredGroups(groups);
        }
    };

    const handleMemberSearchChange = (e) => {
        setMemberSearchText(e.target.value);
    };

    const getInitials = (first_name, last_name) => {
        return `${first_name?.charAt(0) || ''}${last_name?.charAt(0) || ''}`;
    };

    const toggleMembers = () => {
        setShowMembers(!showMembers);
    };

    const handleAddUserToGroup = async (userId) => {
        if (selectedGroup) {
            const updatedMembers = [...selectedGroup.members, userId];
            await updateGroup(selectedGroup.id, { ...selectedGroup, members: updatedMembers });
            await fetchGroups();
            setShowMembers(false);
        }
    };

    const handleRemoveUserFromGroup = async (userId) => {
        if (selectedGroup) {
            const updatedMembers = selectedGroup.members.filter(id => id !== userId);
            await updateGroup(selectedGroup.id, { ...selectedGroup, members: updatedMembers });
            await fetchGroups();
            setShowMembers(false);
        }
    };

    const confirmRemoveUser = (userId, userName) => {
        if (window.confirm(t('confirmRemoveUser', { userName }))) {
            handleRemoveUserFromGroup(userId);
        }
    };

    const getUserById = (userId) => {
        return users.find(user => user.id === userId) || {};
    };

    const filteredMembers = selectedGroup?.members
        ?.filter(memberId => memberId !== user?.id)
        .map(memberId => users.find(user => user.id === memberId))
        .filter(member => member && member.first_name.toLowerCase().includes(memberSearchText.toLowerCase())) || [];

    const nonMembers = users.filter(user => !selectedGroup?.members?.includes(user.id)) || [];

    const toggleMessageMenu = (messageId) => {
        setMessageMenuOpen(messageMenuOpen === messageId ? null : messageId);
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen pt-12 mt-24 px-4">
            <div className="w-full lg:w-5/6 bg-gray-100 shadow-lg rounded-lg overflow-hidden">
                <div className="flex flex-col lg:flex-row h-[80vh]">
                    <div className="w-full lg:w-1/4 bg-white border-r border-gray-300">
                        <div className="p-4">
                            <input
                                type="text"
                                placeholder={t('searchPlaceholder')}
                                className="w-full p-2 border border-gray-300 rounded-lg"
                                value={searchText}
                                onChange={handleSearchChange}
                            />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold p-4">{t('friends')}</h3>
                            <ul>
                                {filteredFriends.map((friend, index) => (
                                    <li
                                        key={index}
                                        className={`flex items-center p-2 cursor-pointer hover:bg-gray-200 ${selectedFriend && selectedFriend.username === friend.username ? 'bg-blue-200' : 'bg-white'}`}
                                        onClick={() => handleSelectFriend(friend)}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                                            <span className="text-lg text-gray-600">{getInitials(friend.first_name, friend.last_name)}</span>
                                        </div>
                                        <div>
                                            <div className="font-bold">{`${friend.first_name} ${friend.last_name}`}</div>
                                            <div className="text-sm text-gray-500">{friend.email}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold p-4">{t('groups')}</h3>
                            <ul>
                                {filteredGroups.map((group, index) => (
                                    <li
                                        key={index}
                                        className={`flex items-center p-2 cursor-pointer hover:bg-gray-200 ${selectedGroup && selectedGroup.id === group.id ? 'bg-blue-200' : 'bg-white'}`}
                                        onClick={() => handleSelectGroup(group)}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                                            <span className="text-lg text-gray-600">{group.name.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <div className="font-bold">{group.name}</div>
                                            <div className="text-sm text-gray-500">{t('group')}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="w-full lg:w-3/4 flex flex-col">
                        {selectedFriend && (
                            <div className="flex items-center p-4 bg-white border-b border-gray-300">
                                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center mr-4">
                                    <span className="text-xl text-gray-600">{getInitials(selectedFriend.first_name, selectedFriend.last_name)}</span>
                                </div>
                                <div>
                                    <div className="font-bold">{`${selectedFriend.first_name} ${selectedFriend.last_name}`}</div>
                                    <div className="text-sm text-gray-500">{selectedFriend.email}</div>
                                </div>
                                <div className="ml-auto flex items-center space-x-2">
                                    <FaCamera className="text-gray-500 cursor-pointer" />
                                    <FaImage className="text-gray-500 cursor-pointer" />
                                    <FaCog className="text-gray-500 cursor-pointer" />
                                    <FaQuestion className="text-gray-500 cursor-pointer" />
                                </div>
                            </div>
                        )}
                        {selectedGroup && (
                            <div className="flex items-center p-4 bg-white border-b border-gray-300">
                                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center mr-4">
                                    <span className="text-xl text-gray-600">{selectedGroup.name.charAt(0)}</span>
                                </div>
                                <div>
                                    <div className="font-bold">{selectedGroup.name}</div>
                                    <div className="text-sm text-gray-500">{t('group')}</div>
                                </div>
                                <div className="ml-auto flex items-center space-x-2">
                                    <FaCamera className="text-gray-500 cursor-pointer" />
                                    <FaImage className="text-gray-500 cursor-pointer" />
                                    <FaCog className="text-gray-500 cursor-pointer" />
                                    <FaQuestion className="text-gray-500 cursor-pointer" />
                                    <FaUsers className="text-gray-500 cursor-pointer" onClick={toggleMembers} />
                                </div>
                            </div>
                        )}
                        <div className="flex-1 p-4 overflow-y-auto">
                            {messages.map((message, index) => {
                                const sender = getUserById(message.sender);
                                return (
                                    <div key={index} className={`flex ${message.sender === user.id ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`p-2 my-2 rounded-lg ${message.sender === user.id ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                                                    <span className="text-sm text-gray-600">{getInitials(sender.first_name, sender.last_name)}</span>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-500">{sender.first_name} {sender.last_name}</div>
                                                    <div className="text-xs text-gray-400">{new Date(message.timestamp).toLocaleString()}</div>
                                                </div>
                                                {message.sender === user.id && (
                                                    <div className="ml-auto relative">
                                                        <FaEllipsisV className="text-gray-500 cursor-pointer" onClick={() => toggleMessageMenu(message.id)} />
                                                        {messageMenuOpen === message.id && (
                                                            <div ref={messageMenuRef} className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded-lg shadow-lg">
                                                                <button
                                                                    className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                                                    onClick={() => handleEditMessage(message)}
                                                                >
                                                                    <FaEdit className="mr-2" /> {t('edit')}
                                                                </button>
                                                                <button
                                                                    className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                                                    onClick={() => handleDeleteMessage(message.id)}
                                                                >
                                                                    <FaTrash className="mr-2" /> {t('delete')}
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="pt-4 pb-4">{message.content}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {(selectedFriend || selectedGroup) && (
                            <div className="flex items-center p-4 bg-white border-t border-gray-300">
                                <input
                                    type="text"
                                    className="flex-1 p-2 border border-gray-300 rounded-lg"
                                    placeholder={t('enterTextHere')}
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button
                                    className="ml-2 p-2 bg-blue-500 text-white rounded-lg"
                                    onClick={editingMessage ? () => handleUpdateMessage(editingMessage.id, newMessage) : handleSendMessage}
                                >
                                    <FaPaperPlane />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showMembers && selectedGroup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowMembers(false)}
                        >
                            <FaTimes size={20} />
                        </button>
                        <h2 className="text-xl font-bold mb-4">{t('membersOf')} {selectedGroup.name}</h2>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                            placeholder={t('searchMemberPlaceholder')}
                            value={memberSearchText}
                            onChange={handleMemberSearchChange}
                        />
                        <div className="max-h-60 overflow-y-auto mb-4">
                            <ul>
                                {filteredMembers.map((member) => (
                                    <li key={member?.id} className="flex justify-between items-center p-2 border-b">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                                                <span className="text-lg text-gray-600">{getInitials(member?.first_name, member?.last_name)}</span>
                                            </div>
                                            <div>
                                                <div className="font-bold">{`${member?.first_name} ${member?.last_name}`}</div>
                                                <div className="text-sm text-gray-500">{member?.email}</div>
                                            </div>
                                        </div>
                                        <button
                                            className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700"
                                            onClick={() => confirmRemoveUser(member?.id, `${member?.first_name} ${member?.last_name}`)}
                                        >
                                            {t('remove')}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <h2 className="text-xl font-bold mb-4">{t('addUsers')}</h2>
                        <div className="max-h-60 overflow-y-auto">
                            <ul>
                                {nonMembers.map((user) => (
                                    <li key={user.id} className="flex justify-between items-center p-2 border-b">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                                                <span className="text-lg text-gray-600">{getInitials(user.first_name, user.last_name)}</span>
                                            </div>
                                            <div>
                                                <div className="font-bold">{`${user.first_name} ${user.last_name}`}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                        <button
                                            className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-700"
                                            onClick={() => handleAddUserToGroup(user.id)}
                                        >
                                            {t('add')}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatPage;
