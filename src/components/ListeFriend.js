import React, { useEffect, useState } from 'react';
import { getAllUsers } from "../services/api.user";
import { sendFriendRequest, listFriendRequests, acceptFriendRequest, declineFriendRequest } from "../services/api.friendship";
import { FaUserPlus, FaComments } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const ListeFriend = ({ user }) => {
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchUsers();
            fetchRequests();
        }
    }, [user]);

    const fetchUsers = async () => {
        try {
            const response = await getAllUsers();
            const filteredUsers = response.data.filter(u => u.id !== user.id);
            setUsers(filteredUsers);
            setLoading(false);
        } catch (error) {
            setError(t("error_fetching_users"));
            setLoading(false);
        }
    };

    const fetchRequests = async () => {
        try {
            const response = await listFriendRequests();
            setFriendRequests(response.data);
        } catch (error) {
            console.error(t('error_fetching_requests'), error);
        }
    };

    const handleAddFriend = async (friendId) => {
        try {
            await sendFriendRequest(user.id, friendId, 'sent');
            setFriendRequests([...friendRequests, { user: user.id, friend: friendId, status: 'sent' }]);
        } catch (error) {
            console.error(t('error_sending_request'), error);
        }
    };

    const handleAcceptFriend = async (friendshipId, userId, friendId) => {
        try {
            await acceptFriendRequest(friendshipId, userId, friendId);
            fetchRequests();
        } catch (error) {
            console.error(t('error_accepting_request'), error);
        }
    };

    const handleDeclineFriend = async (friendshipId, userId, friendId) => {
        try {
            await declineFriendRequest(friendshipId, userId, friendId);
            fetchRequests();
        } catch (error) {
            console.error(t('error_declining_request'), error);
        }
    };

    const getRequestStatus = (friendId) => {
        const request = friendRequests.find(req => (req.friend === friendId && req.user === user.id) || (req.friend === user.id && req.user === friendId));
        return request ? request.status : null;
    };

    const getFriendshipId = (friendId) => {
        const request = friendRequests.find(req => (req.friend === friendId && req.user === user.id) || (req.friend === user.id && req.user === friendId));
        return request ? request.id : null;
    };

    const getRequest = (friendId) => {
        return friendRequests.find(req => (req.friend === friendId && req.user === user.id) || (req.friend === user.id && req.user === friendId));
    };

    if (loading) {
        return <div>{t("loading")}</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="bg-gray-100 rounded-lg shadow-lg max-h-96 overflow-y-auto relative mt-5">
            <div className="sticky top-0 bg-white p-4 z-8">
                <h2 className="text-2xl font-bold mb-4">{t("add_friends")}</h2>
            </div>

            <div className="p-4">
                {users.map(friend => {
                    const request = getRequest(friend.id);
                    const status = request ? request.status : null;
                    const friendshipId = request ? request.id : null;
                    const friendUserId = request ? request.user : null;
                    const friendFriendId = request ? request.friend : null;
                    return (
                        <div key={friend.id} className="flex items-center mb-4 p-2 border rounded bg-gray-100">
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-white flex-shrink-0">
                                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                    <span className="text-lg text-gray-600">{friend.first_name.charAt(0)}{friend.last_name.charAt(0)}</span>
                                </div>
                            </div>
                            <div className="ml-4 flex-grow">
                                <p className="font-bold truncate w-full">{friend.first_name} {friend.last_name}</p>
                                <p className="text-sm text-gray-600 truncate w-full">{friend.email}</p>
                                <p className="text-sm text-gray-600 truncate w-full">{friend.username}</p>
                            </div>
                            <div className="ml-4 flex space-x-2">
                                {status === 'sent' && friendFriendId === user.id ? (
                                    <>
                                        <button onClick={() => handleAcceptFriend(friendshipId, friendUserId, friendFriendId)} className="flex items-center bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700">
                                            {t("accept")}
                                        </button>
                                        <button onClick={() => handleDeclineFriend(friendshipId, friendUserId, friendFriendId)} className="flex items-center bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700">
                                            {t("decline")}
                                        </button>
                                    </>
                                ) : status === 'sent' && friendUserId === user.id ? (
                                    <button className="flex items-center bg-gray-500 text-white px-3 py-1 rounded" disabled>
                                        {t("request_sent")}
                                    </button>
                                ) : status === 'accepted' ? (
                                    <button className="flex items-center bg-green-500 text-white px-3 py-1 rounded"
                                            onClick={() => navigate('/chat', { state: { friend: { name: 'Nom de l’utilisateur', id: friend.id } } })}
                                    >
                                        {t("friend")}
                                        <FaComments className="ml-2" />
                                    </button>
                                ) : status === 'rejected' ? (
                                    <button className="flex items-center bg-red-500 text-white px-3 py-1 rounded" disabled>
                                        {t("request_rejected")}
                                    </button>
                                ) : (
                                    <button onClick={() => handleAddFriend(friend.id)} className="flex items-center bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700">
                                        <FaUserPlus className="mr-2" /> {t("add")}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ListeFriend;
