import React, { useContext } from 'react';
import ListeFriend from "../components/ListeFriend";
import { UserContext } from '../contexts/UserContext';

function UsersPage() {
    const { user } = useContext(UserContext);

    return (
        <div className="pl-8 pr-8 mt-32 align-middle flex flex-col justify-center ">
            <div>
                {user ? (
                    <ListeFriend user={user} />
                ) : (
                    <div>Loading...</div>
                )}
            </div>

        </div>
    );
}

export default UsersPage;
