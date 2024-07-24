import React, { useState, useEffect, useRef } from 'react';
import { getComments, createComment, updateComment, deleteComment } from "../services/api.coment";
import { getUserInformation } from "../services/api.user";
import { FaHeart, FaRegHeart, FaEllipsisV, FaEdit, FaTrash, FaPaperPlane } from 'react-icons/fa';
import { GoReply, GoShareAndroid, GoThumbsup, GoThumbsdown } from 'react-icons/go';
import loginicon from "../assets/photos/user.png";
import IconToggle from './IconToggle';
import Comment from './Comment';
import FilePreview from './FilePreview';
import { getActions, createAction, deleteAction } from "../services/api.action";
import { deleteProgram, updateProgram } from "../services/api.program";
import { useTranslation } from 'react-i18next';

const ProgramDetails = ({ program, user }) => {
    const { t } = useTranslation();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [replyTo, setReplyTo] = useState(null);
    const [editCommentId, setEditCommentId] = useState(null);
    const [author, setAuthor] = useState(null);
    const [actions, setActions] = useState([]);
    const [programActionCounts, setProgramActionCounts] = useState({});
    const [commentActionCounts, setCommentActionCounts] = useState({});
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const commentInputRef = useRef(null);
    const menuRef = useRef(null);

    useEffect(() => {
        if (program) {
            fetchComments();
            fetchAuthor();
            fetchActions();
        }
    }, [program]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const fetchComments = async () => {
        try {
            const response = await getComments();
            const programComments = response.data.filter(comment => comment.program === program.id);
            const commentsTree = buildCommentsTree(programComments);
            setComments(commentsTree);
        } catch (error) {
            console.error(t('error_fetching_comments'), error);
        }
    };

    const fetchAuthor = async () => {
        try {
            const response = await getUserInformation(program.author);
            setAuthor(response.data);
        } catch (error) {
            console.error(t('error_fetching_author'), error);
        }
    };

    const fetchActions = async () => {
        try {
            const response = await getActions();
            console.log('Fetched actions:', response.data);
            setActions(response.data);
            updateActionCounts(response.data);
        } catch (error) {
            console.error(t('error_fetching_actions'), error);
        }
    };

    const updateActionCounts = (actions) => {
        const programCounts = {};
        const commentCounts = {};

        actions.forEach(action => {
            const entity = action.program_id ? 'program' : 'comment';
            const entityId = action.program_id || action.comment_id;
            const actionType = action.action;

            if (entity === 'program') {
                if (!programCounts[entityId]) {
                    programCounts[entityId] = {
                        like: 0,
                        dislike: 0,
                        share: 0,
                        love: 0
                    };
                }
                programCounts[entityId][actionType]++;
            } else if (entity === 'comment') {
                if (!commentCounts[entityId]) {
                    commentCounts[entityId] = {
                        like: 0,
                        dislike: 0,
                        share: 0,
                        love: 0
                    };
                }
                commentCounts[entityId][actionType]++;
            }
        });

        setProgramActionCounts(programCounts);
        setCommentActionCounts(commentCounts);
    };

    const handleAddComment = async () => {
        if (editCommentId) {
            handleUpdateComment();
            return;
        }

        try {
            await createComment({
                text: newComment,
                program: program.id,
                parent: replyTo ? replyTo.id : null,
            });
            fetchComments();
            setNewComment('');
            setReplyTo(null);
        } catch (error) {
            console.error(t('error_adding_comment'), error);
        }
    };

    const handleReply = async (comment) => {
        try {
            const response = await getUserInformation(comment.author_id);
            const authorName = `${response.data.first_name} ${response.data.last_name}`;
            setReplyTo(comment);
            const replyText = `${t('replied_to')} @${authorName}: `;
            setNewComment(replyText);
            setTimeout(() => {
                commentInputRef.current.focus();
                commentInputRef.current.setSelectionRange(replyText.length, replyText.length);
            }, 0);
        } catch (error) {
            console.error(t('error_fetching_author'), error);
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
            fetchComments();
            setNewComment('');
            setEditCommentId(null);
        } catch (error) {
            console.error(t('error_updating_comment'), error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(commentId);
            fetchComments();
        } catch (error) {
            console.error(t('error_deleting_comment'), error);
        }
    };

    const handleAction = async (type, entityId, entity) => {
        console.log('Handling action:', type, entityId, entity);
        const existingAction = actions.find(action => action.action === type && action.author_id === user.id && (entity === 'program' ? action.program_id === entityId : action.comment_id === entityId));
        if (existingAction) {
            try {
                await deleteAction(existingAction.id);
                setActions(actions.filter(action => action.id !== existingAction.id));
            } catch (error) {
                console.error(t('error_deleting_action'), error);
            }
        } else {
            try {
                const actionData = {
                    action: type,
                    author_id: user.id
                };
                if (entity === 'program') {
                    actionData.program_id = entityId;
                } else if (entity === 'comment') {
                    actionData.comment_id = entityId;
                }
                const response = await createAction(actionData);
                setActions([...actions, response.data]);
            } catch (error) {
                console.error(t('error_creating_action'), error);
            }
        }
        await fetchActions();
    };

    const countActions = (type, entityId, entity) => {
        if (entity === 'program') {
            if (!programActionCounts[entityId]) {
                return 0;
            }
            return programActionCounts[entityId][type] || 0;
        } else if (entity === 'comment') {
            if (!commentActionCounts[entityId]) {
                return 0;
            }
            return commentActionCounts[entityId][type] || 0;
        }
        return 0;
    };

    const handleDeleteProgram = async (programId) => {
        try {
            await deleteProgram(programId);
            // Additional logic if needed, such as refreshing the program list
        } catch (error) {
            console.error(t('error_deleting_program'), error);
        }
    };

    const handleUpdateProgram = async (programId, programData) => {
        try {
            await updateProgram(programId, programData);
            // Additional logic if needed, such as refreshing the program list
        } catch (error) {
            console.error(t('error_updating_program'), error);
        }
    };

    const buildCommentsTree = (comments) => {
        const commentsMap = {};
        const commentsTree = [];

        comments.forEach(comment => {
            commentsMap[comment.id] = { ...comment, children: [] };
        });

        comments.forEach(comment => {
            if (comment.parent) {
                if (commentsMap[comment.parent]) {
                    commentsMap[comment.parent].children.push(commentsMap[comment.id]);
                }
            } else {
                commentsTree.push(commentsMap[comment.id]);
            }
        });

        return commentsTree;
    };

    const renderComments = (comments, level = 0) => {
        if (!comments) return null;
        return comments.map(comment => (
            <div key={comment.id} style={{ marginLeft: level * 20 }} className="p-2 rounded bg-gray-100">
                <Comment
                    comment={comment}
                    handleReply={handleReply}
                    handleEditComment={handleEditComment}
                    handleDeleteComment={handleDeleteComment}
                    user={user}
                    actions={actions}
                    handleAction={handleAction}
                    countActions={countActions}
                />
                {renderComments(comment.children, level + 1)}
            </div>
        ));
    };

    if (!program || !user) {
        return <div>{t('loading')}</div>;
    }

    return (
        <>
            {author && (
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                            <img src={author.profile_picture || loginicon} alt="Author" className="w-full h-full object-cover" />
                        </div>
                        <div className="ml-4">
                            <p className="font-bold">{author.first_name} {author.last_name}</p>
                        </div>
                    </div>
                    {program.author === user.id && (
                        <div className="relative" ref={menuRef}>
                            <FaEllipsisV className="cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)} />
                            {isMenuOpen && (
                                <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded shadow-lg">
                                    <button
                                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200 flex items-center"
                                        onClick={() => handleUpdateProgram(program.id, program)}
                                    >
                                        <FaEdit className="mr-2" /> {t('edit')}
                                    </button>
                                    <button
                                        className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-200 flex items-center"
                                        onClick={() => handleDeleteProgram(program.id)}
                                    >
                                        <FaTrash className="mr-2" /> {t('delete')}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
            <hr className="my-2" />
            <h2 className="text-xl font-bold">{program.title}</h2>
            <p className="text-gray-700">{program.description}</p>
            {program.file && (
                <div className="">
                    <FilePreview fileUrl={program.file} />
                </div>
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
                    actionType="dislike"
                    entityId={program.id}
                    entity="program"
                    count={countActions('dislike', program.id, 'program')}
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
            <div className="mt-4 space-y-2 w-full max-h-40 overflow-y-auto">
                {renderComments(comments)}
            </div>
            <div className="mt-4 flex items-center">
                <textarea
                    ref={commentInputRef}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={t('comment')}
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

export default ProgramDetails;
