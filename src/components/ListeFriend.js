import React, { useEffect, useState } from 'react';
import { getAllUsers } from "../services/api.user";
import { sendFriendRequest, listFriendRequests } from "../services/api.friendship";
import { FaUserPlus } from 'react-icons/fa';

const ListeFriend = ({ user }) => {
    const [users, setUsers] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
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
            setSentRequests(response.data.filter(req => req.status === 'sent').map(req => req.friend));
        } catch (error) {
            console.error('Error fetching friend requests:', error);
        }
    };

    const handleAddFriend = async (friendId) => {
        try {
            await sendFriendRequest(friendId);
            setSentRequests([...sentRequests, friendId]);
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
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
                {users.map(friend => (
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
                        {sentRequests.includes(friend.id) ? (
                            <button className="flex items-center bg-gray-500 text-white px-3 py-1 mt-2 sm:mt-0 ml-0 sm:ml-auto rounded" disabled>
                                Invitation envoyée
                            </button>
                        ) : (
                            <button onClick={() => handleAddFriend(friend.id)} className="flex items-center bg-blue-500 text-white px-3 py-1 mt-2 sm:mt-0 ml-0 sm:ml-auto rounded hover:bg-blue-700">
                                <FaUserPlus className="mr-2" /> Ajouter
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListeFriend;
