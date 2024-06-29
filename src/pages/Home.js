import React, { useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { UserContext } from "../contexts/UserContext";
import { getPrograms, getPublicPrograms } from "../services/api.program";
import { getActions, createAction, deleteAction } from "../services/api.action";
import { createComment, getComments, updateComment, deleteComment } from "../services/api.coment";
import { getUserInformation, getAllUsers } from "../services/api.user";
import { getGroups } from "../services/api.groups";
import { FaHeart, FaRegHeart, FaUserPlus, FaEllipsisV, FaEdit, FaTrash, FaPaperPlane, FaEnvelope } from 'react-icons/fa';
import { GoReply, GoShareAndroid, GoThumbsup, GoThumbsdown } from 'react-icons/go';
import loginicon from "../assets/photos/user.png";
import { Editor } from '@monaco-editor/react';
import { sendFriendRequest, listFriends, listFriendRequests, manageFriendRequest } from "../services/api.friendship";

function Home() {
    const { user } = useContext(UserContext);
    const [programs, setPrograms] = useState([]);
    const [filteredPrograms, setFilteredPrograms] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [groups, setGroups] = useState([]);
    const [actions, setActions] = useState([]);
    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);

    useEffect(() => {
        fetchPrograms();
        fetchGroups();
        fetchActions();
        fetchFriends();
        fetchRequests();
    }, []);

    useEffect(() => {
        if (user) {
            fetchUsers();
        }
    }, [user]);

    const fetchPrograms = async () => {
        try {
            const response = await getPublicPrograms();
            const visiblePrograms = response.data.filter(program => program.isVisible);
            setPrograms(visiblePrograms);
            setFilteredPrograms(visiblePrograms);
        } catch (error) {
            console.error("Error fetching programs", error);
        }
    };

    const fetchGroups = async () => {
        try {
            const response = await getGroups();
            setGroups(response.data);
        } catch (error) {
            console.error("Error fetching groups", error);
        }
    };

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

    const fetchActions = async () => {
        try {
            const response = await getActions();
            setActions(response.data);
        } catch (error) {
            console.error("Error fetching actions", error);
        }
    };

    const handleSearch = () => {
        const filtered = programs.filter(program =>
            program.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPrograms(filtered);
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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 pt-32">
            <div className="flex flex-col lg:flex-row">
                {/* Programs Section */}
                <div className="lg:w-2/3 lg:pr-4">
                    <div className="mt-4 space-y-4">
                        {filteredPrograms.map(program => (
                            <div key={program.id} className="p-4 border border-gray-100 rounded-lg shadow-lg bg-white relative">
                                <ProgramDetails program={program} user={user} actions={actions} setActions={setActions} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Friends and Groups Section */}
                <div className="lg:w-1/3 lg:pl-4 mt-8 lg:mt-0 space-y-8">
                    <div className="bg-gray-100 rounded-lg shadow-lg max-h-96 overflow-y-auto relative mt-5">
                        <div className="sticky top-0 bg-white p-4 z-8">
                            <h2 className="text-2xl font-bold mb-4">Ajouter des amis</h2>
                        </div>

                        <div className="p-4">
                            {users.map(friend => (
                                <div key={friend.id}
                                     className="flex flex-col sm:flex-row items-center mb-4 p-2 border rounded bg-gray-100">
                                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white">
                                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                                <span
                                                    className="text-lg text-gray-600">{friend.first_name.charAt(0)}</span>
                                        </div>
                                    </div>
                                    <div className="ml-0 sm:ml-4 mt-2 sm:mt-0 text-center sm:text-left">
                                        <p className="font-bold">{friend.first_name} {friend.last_name}</p>
                                        <p className="text-sm text-gray-600">{friend.email}</p>
                                        <p className="text-sm text-gray-600">{friend.username}</p>
                                    </div>
                                    {sentRequests.includes(friend.id) ? (
                                        <button
                                            className="flex items-center bg-gray-500 text-white px-3 py-1 mt-2 sm:mt-0 ml-0 sm:ml-auto rounded"
                                            disabled
                                        >
                                            Invitation envoyée
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleAddFriend(friend.id)}
                                            className="flex items-center bg-blue-500 text-white px-3 py-1 mt-2 sm:mt-0 ml-0 sm:ml-auto rounded hover:bg-blue-700"
                                        >
                                            <FaUserPlus className="mr-2"/> Ajouter
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>


                    <div className="bg-gray-100 rounded shadow-lg max-h-96 overflow-y-auto relative">
                        <div className="sticky top-0 bg-white p-4 z-8">
                            <h2 className="text-2xl font-bold mb-4">Liste des groupes</h2>
                        </div>
                        <div className="p-4">
                            {groups.map(group => (
                                <div key={group.id} className="flex items-center mb-4 p-2 border rounded bg-gray-100">
                                    <div className="ml-4">
                                        <p className="font-bold">{group.name}</p>
                                        <p className="text-sm text-gray-600">{group.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-100 rounded shadow-lg max-h-96 overflow-y-auto relative">
                        <div className="sticky top-0 bg-white p-4 z-8">
                            <h2 className="text-2xl font-bold mb-4">Gérer les demandes d'amis</h2>
                        </div>
                        <div className="p-4">
                            {requests.map(request => (
                                <div key={request.id} className="flex items-center mb-4 p-2 border rounded bg-gray-100">
                                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white">
                                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                            <span
                                                className="text-lg text-gray-600">{request.user === user.id ? request.friend : request.user}</span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="font-bold">{users.find(u => u.id === request.user)?.first_name} {users.find(u => u.id === request.user)?.last_name}</p>
                                        <p className="text-sm text-gray-600">{users.find(u => u.id === request.user)?.email}</p>
                                    </div>
                                    {request.status === 'sent' && request.user !== user.id ? (
                                        <div className="flex space-x-2 ml-auto">
                                            <button
                                                onClick={() => handleAcceptRequest(request.id)}
                                                className="flex items-center bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700"
                                            >
                                                Accepter
                                            </button>
                                            <button
                                                onClick={() => handleRejectRequest(request.id)}
                                                className="flex items-center bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                                            >
                                                Refuser
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            className="flex items-center bg-gray-500 text-white px-3 py-1 ml-auto rounded"
                                            disabled
                                        >
                                            Invitation envoyée
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const ProgramDetails = ({program, user, actions, setActions}) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [replyTo, setReplyTo] = useState(null);
    const [editCommentId, setEditCommentId] = useState(null);
    const [author, setAuthor] = useState(null);
    const commentInputRef = useRef(null);

    useEffect(() => {
        fetchComments();
        fetchAuthor();
    }, []);

    const fetchComments = async () => {
        try {
            const response = await getComments();
            const programComments = response.data.filter(comment => comment.program === program.id);
            setComments(programComments);
        } catch (error) {
            console.error("Error fetching comments", error);
        }
    };

    const fetchAuthor = async () => {
        try {
            const response = await getUserInformation(program.author);
            setAuthor(response.data);
        } catch (error) {
            console.error("Error fetching author information", error);
        }
    };

    const handleAddComment = async () => {
        if (editCommentId) {
            handleUpdateComment();
            return;
        }

        try {
            const response = await createComment({
                text: newComment,
                program: program.id,
            });
            setComments([...comments, response.data]);
            setNewComment('');
            setReplyTo(null);
        } catch (error) {
            console.error("Error adding comment", error);
        }
    };

    const handleReply = async (comment) => {
        try {
            const response = await getUserInformation(comment.author_id);
            const authorName = `${response.data.first_name} ${response.data.last_name}`;
            setReplyTo(comment);
            const replyText = `Replied to @${authorName}: `;
            setNewComment(replyText);
            setTimeout(() => {
                commentInputRef.current.focus();
                commentInputRef.current.setSelectionRange(replyText.length, replyText.length);
            }, 0);
        } catch (error) {
            console.error("Error fetching author information", error);
        }
    };

    const handleEditComment = (comment) => {
        setNewComment(comment.text);
        setEditCommentId(comment.id);
    };

    const handleUpdateComment = async () => {
        if (!editCommentId) return;

        try {
            await updateComment(editCommentId, {text: newComment});
            setNewComment('');
            setEditCommentId(null);
            fetchComments();
        } catch (error) {
            console.error("Error updating comment", error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(commentId);
            fetchComments();
        } catch (error) {
            console.error("Error deleting comment", error);
        }
    };

    const handleAction = async (type, entityId, entity) => {
        const existingAction = actions.find(action => action.type === type && action.user === user.id && action[entity] === entityId);
        if (existingAction) {
            try {
                await deleteAction(existingAction.id);
                setActions(actions.filter(action => action.id !== existingAction.id));
            } catch (error) {
                console.error("Error deleting action", error);
            }
        } else {
            try {
                const response = await createAction({
                    type,
                    [entity]: entityId,
                    user: user.id
                });
                setActions([...actions, response.data]);
            } catch (error) {
                console.error("Error creating action", error);
            }
        }
    };

    const countActions = (type, entityId, entity) => actions.filter(action => action.type === type && action[entity] === entityId).length;

    return (
        <>
            {author && (
                <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                        <img src={author.profile_picture || loginicon} alt="Author" className="w-full h-full object-cover" />
                    </div>
                    <div className="ml-4">
                        <p className="font-bold">{author.first_name} {author.last_name}</p>
                    </div>
                </div>
            )}
            <hr className="my-2" />
            <h2 className="text-xl font-bold">{program.title}</h2>
            <p className="text-gray-700">{program.description}</p>
            {program.file && (
                <FilePreview fileUrl={program.file} />
            )}
            <div className="flex items-center mt-2 space-x-2">
                <IconToggle
                    icon={FaRegHeart}
                    activeIcon={FaHeart}
                    activeColor="text-red-500"
                    size="1rem"
                    actionType="love"
                    entityId={program.id}
                    entity="program"
                    count={countActions('love', program.id, 'program')}
                    handleAction={handleAction}
                />
                <IconToggle
                    icon={GoThumbsup}
                    activeIcon={GoThumbsup}
                    activeColor="text-blue-500"
                    size="1rem"
                    actionType="like"
                    entityId={program.id}
                    entity="program"
                    count={countActions('like', program.id, 'program')}
                    handleAction={handleAction}
                />
                <IconToggle
                    icon={GoThumbsdown}
                    activeIcon={GoThumbsdown}
                    activeColor="text-blue-500"
                    size="1rem"
                    actionType="unlike"
                    entityId={program.id}
                    entity="program"
                    count={countActions('unlike', program.id, 'program')}
                    handleAction={handleAction}
                />
                <IconToggle
                    icon={GoShareAndroid}
                    activeIcon={GoShareAndroid}
                    activeColor="text-green-500"
                    size="1rem"
                    actionType="share"
                    entityId={program.id}
                    entity="program"
                    count={countActions('share', program.id, 'program')}
                    handleAction={handleAction}
                />
            </div>
            {program.authorId === user.id && (
                <div className="absolute top-2 right-2">
                    <Menu programId={program.id} />
                </div>
            )}
            <div className="mt-4 space-y-2 w-full max-h-40 overflow-y-auto">
                {comments.map(comment => (
                    <Comment
                        key={comment.id}
                        comment={comment}
                        handleReply={handleReply}
                        handleEditComment={handleEditComment}
                        handleDeleteComment={handleDeleteComment}
                        user={user}
                        actions={actions}
                        setActions={setActions}
                        handleAction={handleAction}
                        countActions={countActions}
                    />
                ))}
            </div>
            <div className="mt-4 flex items-center">
                <textarea
                    ref={commentInputRef}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Commentaire..."
                    className="flex-grow p-2 border rounded border-gray-300"
                    rows={3}
                />
                <button onClick={handleAddComment} className="ml-2">
                    <FaPaperPlane className="text-blue-500" style={{ fontSize: '1.5rem' }} />
                </button>
            </div>
        </>
    );
};

const IconToggle = ({ icon: Icon, activeIcon: ActiveIcon, activeColor, size, actionType, entityId, entity, count, handleAction }) => {
    const [active, setActive] = useState(false);

    const handleToggle = async () => {
        setActive(!active);
        await handleAction(actionType, entityId, entity);
    };

    return (
        <div className="flex items-center cursor-pointer" onClick={handleToggle}>
            {active ? <ActiveIcon className={activeColor} style={{ fontSize: size }} /> : <Icon className="text-gray-500" style={{ fontSize: size }} />}
            <span className="ml-1">{count}</span>
        </div>
    );
};

const Comment = ({ comment, handleReply, handleEditComment, handleDeleteComment, user, actions, setActions, handleAction, countActions }) => {
    const [author, setAuthor] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        fetchAuthor();
    }, []);

    const fetchAuthor = async () => {
        try {
            const response = await getUserInformation(comment.author_id);
            setAuthor(response.data);
        } catch (error) {
            console.error("Error fetching author information", error);
        }
    };

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsMenuOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={`p-2 border border-gray-100 rounded-lg shadow bg-white relative ${comment.parent ? 'ml-6' : ''}`}>
            {author && (
                <p className="font-bold">{author.first_name} {author.last_name}</p>
            )}
            <p className="text-gray-700">{comment.text}</p>
            <div className="absolute top-2 right-2">
                {author && comment.author_id === user.id && (
                    <FaEllipsisV className="cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)} />)}
                {isMenuOpen && (
                    <div ref={menuRef} className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded shadow-lg">
                        <button
                            className="block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-200 flex items-center"
                            onClick={() => {
                                handleEditComment(comment);
                                setIsMenuOpen(false);
                            }}
                        >
                            <FaEdit className="mr-2" /> Modifier
                        </button>
                        <button
                            className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-200 flex items-center"
                            onClick={() => {
                                handleDeleteComment(comment.id);
                                setIsMenuOpen(false);
                            }}
                        >
                            <FaTrash className="mr-2" /> Supprimer
                        </button>
                    </div>
                )}
            </div>
            <div className="flex items-center mt-2 space-x-2">
                <IconToggle
                    icon={FaRegHeart}
                    activeIcon={FaHeart}
                    activeColor="text-red-500"
                    size="1rem"
                    actionType="love"
                    entityId={comment.id}
                    entity="comment"
                    count={countActions('love', comment.id, 'comment')}
                    handleAction={handleAction}
                />
                <IconToggle
                    icon={GoThumbsup}
                    activeIcon={GoThumbsup}
                    activeColor="text-blue-500"
                    size="1rem"
                    actionType="like"
                    entityId={comment.id}
                    entity="comment"
                    count={countActions('like', comment.id, 'comment')}
                    handleAction={handleAction}
                />
                <IconToggle
                    icon={GoThumbsdown}
                    activeIcon={GoThumbsdown}
                    activeColor="text-blue-500"
                    size="1rem"
                    actionType="unlike"
                    entityId={comment.id}
                    entity="comment"
                    count={countActions('unlike', comment.id, 'comment')}
                    handleAction={handleAction}
                />
                <button onClick={() => handleReply(comment)} className="text-blue-500 flex items-center">
                    <GoReply className="mr-1" /> Replier
                </button>
            </div>
            {comment.replies && comment.replies.map(reply => (
                <div key={reply.id} className="ml-8 mt-2">
                    <Comment comment={reply} handleReply={handleReply} handleEditComment={handleEditComment} handleDeleteComment={handleDeleteComment} user={user} actions={actions} setActions={setActions} handleAction={handleAction} countActions={countActions} />
                </div>
            ))}
        </div>
    );
};

const FilePreview = ({ fileUrl }) => {
    const [content, setContent] = useState('');

    const fetchFileContent = async (fileUrl) => {
        try {
            const response = await fetch(fileUrl);
            const text = await response.text();
            return text;
        } catch (error) {
            console.error("Error fetching file content", error);
            return "Unable to load file content.";
        }
    };

    useEffect(() => {
        const loadFileContent = async () => {
            const fileContent = await fetchFileContent(fileUrl);
            setContent(fileContent);
        };
        loadFileContent();
    }, [fileUrl]);

    return (
        <div className="mt-4">
            <div className="border rounded p-2 text-gray-500">
                <p>File Preview:</p>
                <div className="mt-2">
                    <Editor
                        height="20vh"
                        language="javascript"
                        theme="vs-dark"
                        value={content}
                        options={{
                            readOnly: true,
                            automaticLayout: true,
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

const Menu = ({ programId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleEditProgram = (programId) => {
        console.log("Edit program with ID:", programId);
        // Logic to edit program goes here
    };

    const handleDeleteProgram = (programId) => {
        console.log("Delete program with ID:", programId);
        // Logic to delete program goes here
    };

    return (
        <div className="relative" ref={menuRef}>
            <FaEllipsisV className="cursor-pointer" onClick={() => setIsOpen(!isOpen)} />
            {isOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded shadow-lg">
                    <button
                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200 flex items-center"
                        onClick={() => {
                            handleEditProgram(programId);
                            setIsOpen(false);
                        }}
                    >
                        <FaEdit className="mr-2" /> Modifier
                    </button>
                    <button
                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200 flex items-center"
                        onClick={() => {
                            handleDeleteProgram(programId);
                            setIsOpen(false);
                        }}
                    >
                        <FaTrash className="mr-2 text-red-500" /> Supprimer
                    </button>
                </div>
            )}
        </div>
    );
};




export default Home;
