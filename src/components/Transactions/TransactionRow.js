import React from 'react';
import { Button } from 'react-bootstrap';



const Transaction = props => {
    return (
        <tr 
            className={props.transaction === props.selectedTransaction ? 'selected' : ''} 
        >
            <td>{props.transaction.date}</td>
            <td>{props.transaction.category}</td>
            <td>{props.transaction.item}</td>
            <td
                className={props.transaction.transactionType === "expense" ? "expenseAmount" : "incomeAmount"}
            >
                {props.transaction.transactionType === "expense" ? "-"+props.transaction.price : props.transaction.price}
                </td>

                <td><Button
                        variant="info"
                        onClick={() => props.onSelect(props.transaction)}
                        >
                            Edit
                    </Button>
                    &nbsp;
                    <Button
                        variant="danger"
                        onClick={e => props.onDelete(e, props.transaction)}>
                            Delete
                    </Button>
                </td>
        </tr>
    );
}

export default Transaction;