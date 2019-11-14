import React from 'react';

const Expense = props => {
    return (
        <li 
            className={props.expense === props.selectedExpense ? 'selected' : ''} 
            onClick={() => props.onSelect(props.expense)}
        >


            <button
                className="delete-button"
                onClick={e => props.onDelete(e, props.expense)}
            >
                Delete
            </button>
            <div className="user-element">
                <div className="badge">{props.expense.category}</div>
                <div className="name">{props.expense.item}</div>
                <div className="password">{(props.expense.price/100).toFixed(2)}</div>
            </div>
        </li>
    );
}

export default Expense;