import React, { useContext, useState, useEffect, useRef } from 'react';
import { UserContext } from "../contexts/UserContext";
import { getPrograms, getPublicPrograms } from "../services/api.program";
import { createAction } from "../services/api.action";
import { createComment, getComments, updateComment, deleteComment } from "../services/api.coment";
import { getUserInformation, getAllUsers } from "../services/api.user";
import { getGroups } from "../services/api.groups";
import { FaHeart, FaRegHeart, FaUserPlus, FaEllipsisV, FaEdit, FaTrash, FaPaperPlane } from 'react-icons/fa';
import { GoReply, GoShareAndroid, GoThumbsup, GoThumbsdown } from 'react-icons/go';
import loginicon from "../assets/photos/user.png";
import { Editor } from '@monaco-editor/react';

function Home() {
    const { user } = useContext(UserContext);
    const [programs, setPrograms] = useState([]);
    const [filteredPrograms, setFilteredPrograms] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        fetchPrograms();
        fetchGroups();
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

    const fetchGroups = async () => {
        try {
            const response = await getGroups();
            setGroups(response.data);
        } catch (error) {
            console.error("Error fetching groups", error);
        }
    };

    const handleSearch = () => {
        const filtered = programs.filter(program =>
            program.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPrograms(filtered);
    };

    const handleAddFriend = (friendId) => {
        console.log("Add friend with ID:", friendId);
        // Logic to add friend goes here
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
                                <ProgramDetails program={program} user={user} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Friends and Groups Section */}
                <div className="lg:w-1/3 lg:pl-4 mt-8 lg:mt-0 space-y-8">
                    <div className="bg-gray-100 rounded-lg shadow-lg max-h-96 overflow-y-auto relative mt-5">
                        <div className="sticky top-0 bg-white p-4 z-10">
                            <h2 className="text-2xl font-bold mb-4">Ajouter des amis</h2>
                        </div>
                        <div className="p-4">
                            {users.map(friend => (
                                <div key={friend.id} className="flex items-center mb-4 p-2 border rounded bg-gray-100">
                                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white">
                                        <img src={friend.profile_picture || loginicon} alt="Profile" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="font-bold">{friend.first_name} {friend.last_name}</p>
                                        <p className="text-sm text-gray-600">{friend.first_name}</p>
                                    </div>
                                    <button
                                        onClick={() => handleAddFriend(friend.id)}
                                        className="flex items-center bg-blue-500 text-white px-3 py-1 ml-auto rounded hover:bg-blue-700"
                                    >
                                        <FaUserPlus className="mr-2" /> Ajouter
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-100 rounded shadow-lg max-h-96 overflow-y-auto relative">
                        <div className="sticky top-0 bg-white p-4 z-10">
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
                </div>
            </div>
        </div>
    );
}

const ProgramDetails = ({ program, user }) => {
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
            await updateComment(editCommentId, { text: newComment });
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
                <IconToggle icon={FaRegHeart} activeIcon={FaHeart} activeColor="text-red-500" size="1rem" actionType="love" programId={program.id} />
                <IconToggle icon={GoThumbsup} activeIcon={GoThumbsup} activeColor="text-blue-500" size="1rem" actionType="like" programId={program.id} />
                <IconToggle icon={GoThumbsdown} activeIcon={GoThumbsdown} activeColor="text-blue-500" size="1rem" actionType="like" programId={program.id} />
                <IconToggle icon={GoShareAndroid} activeIcon={GoShareAndroid} activeColor="text-green-500" size="1rem" actionType="share" programId={program.id} isVisible={program.is_visible} />
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

const Comment = ({ comment, handleReply, handleEditComment, handleDeleteComment }) => {
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
                <FaEllipsisV className="cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)} />
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
                <IconToggle icon={FaRegHeart} activeIcon={FaHeart} activeColor="text-red-500" size="1rem" actionType="love" commentId={comment.id} />
                <IconToggle icon={GoThumbsup} activeIcon={GoThumbsup} activeColor="text-blue-500" size="1rem" actionType="like" commentId={comment.id} />
                <IconToggle icon={GoThumbsdown} activeIcon={GoThumbsdown} activeColor="text-blue-500" size="1rem" actionType="like" commentId={comment.id} />
                <button onClick={() => handleReply(comment)} className="text-blue-500 flex items-center">
                    <GoReply className="mr-1" /> Replier
                </button>
            </div>
            {comment.replies && comment.replies.map(reply => (
                <div key={reply.id} className="ml-8 mt-2">
                    <Comment comment={reply} handleReply={handleReply} handleEditComment={handleEditComment} handleDeleteComment={handleDeleteComment} />
                </div>
            ))}
        </div>
    );
};

const IconToggle = ({ icon: Icon, activeIcon: ActiveIcon, activeColor, size, actionType, programId, commentId }) => {
    const [active, setActive] = useState(false);

    const handleToggle = async () => {
        const newActive = !active;
        setActive(newActive);

        try {
            await createAction({
                action: actionType,
                program: programId,
                comment: commentId
            });
        } catch (error) {
            console.error("Error creating action", error);
        }
    };

    return (
        <div onClick={handleToggle} className="cursor-pointer">
            {active ? <ActiveIcon className={activeColor} style={{ fontSize: size }} /> : <Icon className="text-gray-500" style={{ fontSize: size }} />}
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
                        language="javascripte"
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

export default Home;
