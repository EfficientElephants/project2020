import React from 'react';
import { ListGroup, Button, Table } from 'react-bootstrap';


const Expense = props => {
    return (
        <tr 
            className={props.expense === props.selectedExpense ? 'selected' : ''} 
            onClick={() => props.onSelect(props.expense)}
        >


            <Table>
                <tbody>
                    <td>{props.expense.category}</td>
                    <td>{props.expense.item}</td>
                    <td>{((props.expense.price)/100).toFixed(2)}</td>
                    <td><Button
                            variant="danger"
                            onClick={e => props.onDelete(e, props.expense)}>
                                Delete
                        </Button>
                    </td>
                </tbody>
            </Table>
        </tr>
    );
}

export default Expense;