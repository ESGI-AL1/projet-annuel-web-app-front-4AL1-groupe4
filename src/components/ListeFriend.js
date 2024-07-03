import React, { useEffect, useState } from 'react';
import { getAllUsers } from "../services/api.user";
import { sendFriendRequest, listFriendRequests, acceptFriendRequest, declineFriendRequest } from "../services/api.friendship";
import { FaUserPlus, FaComments } from 'react-icons/fa';

const ListeFriend = ({ user }) => {
    const [users, setUsers] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            setError("There was an error fetching the users!");
            setLoading(false);
        }
    };

    const fetchRequests = async () => {
        try {
            const response = await listFriendRequests();
            setFriendRequests(response.data);
        } catch (error) {
            console.error('Error fetching friend requests:', error);
        }
    };

    const handleAddFriend = async (friendId) => {
        try {
            await sendFriendRequest(user.id, friendId, 'sent');
            setFriendRequests([...friendRequests, { user: user.id, friend: friendId, status: 'sent' }]);
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    const handleAcceptFriend = async (friendshipId, userId, friendId) => {
        try {
            await acceptFriendRequest(friendshipId, userId, friendId);
            fetchRequests();
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    const handleDeclineFriend = async (friendshipId, userId, friendId) => {
        try {
            await declineFriendRequest(friendshipId, userId, friendId);
            fetchRequests();
        } catch (error) {
            console.error('Error declining friend request:', error);
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
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="bg-gray-100 rounded-lg shadow-lg max-h-96 overflow-y-auto relative mt-5">
            <div className="sticky top-0 bg-white p-4 z-8">
                <h2 className="text-2xl font-bold mb-4">Ajouter des amis</h2>
            </div>

            <div className="p-4">
                {users.map(friend => {
                    const request = getRequest(friend.id);
                    const status = request ? request.status : null;
                    const friendshipId = request ? request.id : null;
                    const friendUserId = request ? request.user : null;
                    const friendFriendId = request ? request.friend : null;
                    return (
                        <div key={friend.id} className="flex flex-col sm:flex-row items-center mb-4 p-2 border rounded bg-gray-100">
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-white">
                                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                    <span className="text-lg text-gray-600">{friend.first_name.charAt(0)}{friend.last_name.charAt(0)}</span>
                                </div>
                            </div>
                            <div className="ml-0 sm:ml-4 mt-2 sm:mt-0 text-center sm:text-left">
                                <p className="font-bold">{friend.first_name} {friend.last_name}</p>
                                <p className="text-sm text-gray-600">{friend.email}</p>
                                <p className="text-sm text-gray-600">{friend.username}</p>
                            </div>
                            {status === 'sent' && friendFriendId === user.id ? (
                                <>
                                    <button onClick={() => handleAcceptFriend(friendshipId, friendUserId, friendFriendId)} className="flex items-center bg-green-500 text-white px-3 py-1 mt-2 sm:mt-0 ml-0 sm:ml-auto rounded hover:bg-green-700">
                                        Accepter
                                    </button>
                                    <button onClick={() => handleDeclineFriend(friendshipId, friendUserId, friendFriendId)} className="flex items-center bg-red-500 text-white px-3 py-1 mt-2 sm:mt-0 ml-0 sm:ml-auto rounded hover:bg-red-700 ml-2">
                                        Rejeter
                                    </button>
                                </>
                            ) : status === 'sent' && friendUserId === user.id ? (
                                <button className="flex items-center bg-gray-500 text-white px-3 py-1 mt-2 sm:mt-0 ml-0 sm:ml-auto rounded" disabled>
                                    Invitation envoyée
                                </button>
                            ) : status === 'accepted' ? (
                                <button className="flex items-center bg-green-500 text-white px-3 py-1 mt-2 sm:mt-0 ml-0 sm:ml-auto rounded">
                                    Ami
                                    <FaComments className="ml-2" />
                                </button>
                            ) : status === 'rejected' ? (
                                <button className="flex items-center bg-red-500 text-white px-3 py-1 mt-2 sm:mt-0 ml-0 sm:ml-auto rounded" disabled>
                                    Invitation rejetée
                                </button>
                            ) : (
                                <button onClick={() => handleAddFriend(friend.id)} className="flex items-center bg-blue-500 text-white px-3 py-1 mt-2 sm:mt-0 ml-0 sm:ml-auto rounded hover:bg-blue-700">
                                    <FaUserPlus className="mr-2" /> Ajouter
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ListeFriend;
