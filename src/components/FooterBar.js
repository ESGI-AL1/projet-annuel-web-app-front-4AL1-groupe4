import React from 'react';
import { FaUserFriends, FaPlusCircle } from 'react-icons/fa';

function FooterBar() {
    return (
        <footer className="bg-white py-4 fixed bottom-0 w-full z-10 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <button
                    onClick={() => console.log("Créer un groupe")}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"
                >
                    <FaPlusCircle className="mr-2" /> Créer un groupe
                </button>
                <button
                    onClick={() => console.log("Liste des amis")}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"
                >
                    <FaUserFriends className="mr-2" /> Liste des amis
                </button>
            </div>
        </footer>
    );
}

export default FooterBar;
