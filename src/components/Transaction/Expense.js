import React from 'react';
import { Button } from 'react-bootstrap';


const Expense = props => {
    return (
        <tr 
            className={props.expense === props.selectedExpense ? 'selected' : ''} 
            onClick={() => props.onSelect(props.expense)}
        >


                <td>{props.expense.category}</td>
                <td>{props.expense.item}</td>
                <td>{((props.expense.price)/100).toFixed(2)}</td>
                <td><Button
                        variant="danger"
                        onClick={e => props.onDelete(e, props.expense)}>
                            Delete
                    </Button>
                    &nbsp;
                    <Button
                        variant="info"
                        // onClick={e => props.onDelete(e, props.expense)}
                        >
                            Edit
                    </Button>
                </td>
        </tr>
    );
}

export default Expense;