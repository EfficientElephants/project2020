import React, { Component } from 'react';

import User from './User';
import EditUser from './EditUser';


class Users extends Component {
    constructor() {
        super();
        this.state = { users: [], addingUser: false};

        this.handleSelect = this.handleSelect.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleEnableAddMode = this.handleEnableAddMode.bind(this);

    }
    componentDidMount() {
        fetch('/api/users').then(result => result.json()).then(json => {
            this.setState({ users: json});
        });
    }
    

    handleSelect(user) {
        this.setState({ selectedUser: user });
    }

    handleSave (user) {

    }

    handleChange(event) {
        let selectedUser = this.state.selectedUser;
        selectedUser[event.target.name] = event.target.value;
        this.setState({ selectedUser: selectedUser });

    }

    handleCancel() {
        this.setState({ selectedUser: null, addingUser: false})
    }

    handleEnableAddMode() {
        this.setState({
            addingUser: true,
            selectedUser: {id: '', name:'', password: ''}
        });
    }


    render() {
        return (
            <div>
                <ul className="users">
                    {this.state.users.map(user =>{
                        return <User user={user} onSelect={this.handleSelect} selectedUser = {this.state.selectedUser} />
                    })}
                </ul>
                <div className="editarea">
                    <button onClick={this.handleEnableAddMode}>Add New Hero</button>
                    <EditUser 
                        addingUser = {this.state.addingUser} 
                        selectedUser={this.state.selectedUser}
                        onChange={this.handleChange}
                        onSave = {this.handleSave}
                        onCancel = {this.handleCancel}
                    />
                </div>
            </div>
        );
    }
}
export default Users;