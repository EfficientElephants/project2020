import React from 'react';

const User = props => {
    return (
        <li 
            className={props.user === props.selectedUser ? 'selected' : ''} 
            onClick={() => props.onSelect(props.user)}
        >


            <button
                className="delete-button"
                onClick={e => props.onDelete(e, props.user)}
            >
                Delete
            </button>
            <div className="user-element">
                <div className="badge">{props.user.id}</div>
                <div className="name">{props.user.name}</div>
                <div className="password">{props.user.password}</div>
            </div>
        </li>
    );
}

export default User;