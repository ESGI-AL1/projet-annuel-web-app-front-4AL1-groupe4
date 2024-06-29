import React, { useEffect, useState } from 'react';
import { getGroups } from "../services/api.groups";

const ListeGroup = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const response = await getGroups();
            setGroups(response.data);
            setLoading(false);
        } catch (error) {
            setError("There was an error fetching the groups!");
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
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
    );
};

export default ListeGroup;
