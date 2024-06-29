import React, { useState } from 'react';

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

export default IconToggle;
