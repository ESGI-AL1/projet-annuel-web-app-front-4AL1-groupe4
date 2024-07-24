import React, { useEffect, useState, useRef } from 'react';
import { FaEllipsisV, FaEdit, FaTrash, FaHeart, FaRegHeart } from 'react-icons/fa';
import { GoReply, GoThumbsup, GoThumbsdown } from 'react-icons/go';
import { getUserInformation } from "../services/api.user";
import IconToggle from './IconToggle';
import { useTranslation } from 'react-i18next';

const Comment = ({ comment, handleReply, handleEditComment, handleDeleteComment, user, actions, setActions, handleAction, countActions }) => {
    const { t } = useTranslation();
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
        <div className="bg-gray-100">
            <div
                className={`p-2 border border-gray-200 rounded-lg shadow bg-white relative ${comment.parent ? 'ml-6' : ''}`}>
                {author && (
                    <p className="font-bold">{author.first_name} {author.last_name}</p>
                )}
                <p className="text-gray-700">{comment.text}</p>
                <div className="absolute top-2 right-2">
                    {author && comment.author_id === user.id && (
                        <FaEllipsisV className="cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)}/>
                    )}
                    {isMenuOpen && (
                        <div ref={menuRef}
                             className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded shadow-lg">
                            <button
                                className="block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-200 flex items-center"
                                onClick={() => {
                                    handleEditComment(comment);
                                    setIsMenuOpen(false);
                                }}
                            >
                                <FaEdit className="mr-2"/> {t('modify')}
                            </button>
                            <button
                                className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-200 flex items-center"
                                onClick={() => {
                                    handleDeleteComment(comment.id);
                                    setIsMenuOpen(false);
                                }}
                            >
                                <FaTrash className="mr-2"/> {t('delete')}
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
                        actionType="dislike"
                        entityId={comment.id}
                        entity="comment"
                        count={countActions('dislike', comment.id, 'comment')}
                        handleAction={handleAction}
                    />
                    <button onClick={() => handleReply(comment)} className="text-blue-500 flex items-center">
                        <GoReply className="mr-1"/> {t('reply')}
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Comment;
