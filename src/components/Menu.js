import React, { useState, useEffect, useRef } from 'react';
import { FaEllipsisV, FaEdit, FaTrash } from 'react-icons/fa';

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

export default Menu;
