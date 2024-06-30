import React, { useState, useEffect } from 'react';

const IconToggle = ({ icon: Icon, activeIcon: ActiveIcon, activeColor, size, actionType, entityId, entity, count, handleAction }) => {
    const [active, setActive] = useState(false);

    const handleToggle = async () => {
        setActive(!active);
        await handleAction(actionType, entityId, entity);
    };

    useEffect(() => {
        setActive(false);
    }, [count]);

    const getColorClass = () => {
        if (count > 0) {
            switch (actionType) {
                case 'love':
                    return 'text-red-500';
                case 'like':
                    return 'text-blue-500';
                case 'dislike':
                    return 'text-yellow-500';
                case 'share':
                    return 'text-green-500';
                default:
                    return 'text-gray-500';
            }
        }
        return 'text-gray-500';
    };

    return (
        <div className="flex items-center cursor-pointer" onClick={handleToggle}>
            {active ? <ActiveIcon className={getColorClass()} style={{ fontSize: size }} /> : <Icon className={getColorClass()} style={{ fontSize: size }} />}
            <span className="ml-1">{count}</span>
        </div>
    );
};

export default IconToggle;
