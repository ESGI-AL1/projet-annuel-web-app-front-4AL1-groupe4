import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from "../contexts/UserContext";
import { getActions } from "../services/api.action";
import { listFriends, listFriendRequests, manageFriendRequest } from "../services/api.friendship";
import ListeProgram from "../components/ListeProgram";
import ListeFriend from "../components/ListeFriend";
import ListeGroup from "../components/ListeGroup";
import { useNavigate } from 'react-router-dom';

function Home() {
    const { user } = useContext(UserContext);
    const [actions, setActions] = useState([]);
    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchActions();
            fetchFriends();
            fetchRequests();
        } else {
            navigate('/home');
        }
    }, [user, navigate]);

    const fetchActions = async () => {
        try {
            const response = await getActions();
            setActions(response.data);
        } catch (error) {
            console.error("Error fetching actions", error);
        }
    };

    const fetchFriends = async () => {
        try {
            const response = await listFriends();
            setFriends(response.data);
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    const fetchRequests = async () => {
        try {
            const response = await listFriendRequests();
            setRequests(response.data);
        } catch (error) {
            console.error('Error fetching friend requests:', error);
        }
    };

    const handleAcceptRequest = async (friendshipId) => {
        try {
            await manageFriendRequest(friendshipId, 'accept');
            fetchFriends();
            fetchRequests();
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    const handleRejectRequest = async (friendshipId) => {
        try {
            await manageFriendRequest(friendshipId, 'reject');
            fetchRequests();
        } catch (error) {
            console.error('Error rejecting friend request:', error);
        }
    };

    if (!user) {
        return null; // Return null or a loading indicator if user is not defined
    }

    return (
        <div className="container mx-auto px-4 pt-32">
            <div className="flex flex-col lg:flex-row">
                {/* Programs Section */}
                <div className="lg:w-2/3 lg:pr-4">
                    <ListeProgram user={user} actions={actions} setActions={setActions} />
                </div>

                {/* Friends and Groups Section */}
                <div className="lg:w-1/3 lg:pl-4 mt-8 lg:mt-0 space-y-8">
                    <ListeFriend user={user} />
                    <ListeGroup />
                </div>
            </div>
        </div>
    );
}

export default Home;
