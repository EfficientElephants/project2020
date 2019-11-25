import React from 'react';
import { Button } from 'react-bootstrap';


const Transaction = props => {
    return (
        <tr 
            className={props.transaction === props.selectedTransaction ? 'selected' : ''} 
        >
                <td>{props.transaction.category}</td>
                <td>{props.transaction.item}</td>
                <td>{props.transaction.price}</td>
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