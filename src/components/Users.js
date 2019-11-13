import React, { Component } from 'react';

import User from './User';
import EditUser from './EditUser';
import usersAPI from '../api/userAPI';



class Users extends Component {
    constructor() {
        super();
        this.state = { users: [], addingUser: false, error: false};

        this.handleSelect = this.handleSelect.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleEnableAddMode = this.handleEnableAddMode.bind(this);
        this.handleDelete = this.handleDelete.bind(this);

    }
    componentDidMount() {
        usersAPI.get().then(json => this.setState({users:json}));
    }
    

    handleSelect(user) {
        this.setState({ selectedUser: user });
    }

    handleDelete(event, user) {
        event.stopPropagation();
        usersAPI.destroy(user).then(() => {
            let users = this.state.users;
            users = users.filter(h => h !== user);
            this.setState({ users: users });
    
            if (this.selectedUser === user) {
                this.setState({ selectedUser: null });
            }
        });
    }

    handleSave () {
        let users = this.state.users;

        if (this.state.addingUser) {
        usersAPI
            .create(this.state.selectedUser)
            .then(result => {
                if (result.errors) {
                    console.log(result);
                    this.setState({error: true});

                }
                else {
                    console.log('Successfully created!');
                    users.push(this.state.selectedUser);
                    this.setState({
                        users: users,
                        selectedUser: null,
                        addingUser: false,
                        error: false
                    });
                }
            })
            .catch(err => {
                console.log(err);
            });
        } else {
        usersAPI
            .update(this.state.selectedUser)
            .then(() => {
                this.setState({ selectedUser: null });
            })
            .catch(err => {});
    }
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
            selectedUser: {email: '', username:'', password: ''}
        });
    }

    errorNotifcation () {
        let errorValue = this.state.error;
        if (errorValue) {
            return (
                <div class="alert alert-danger" role="alert">
                    <strong>Oh snap!</strong> Either your email or username is already in use. Please try again.
                </div>
            )
        }else {
            return (<div></div>)
        }
    }

    


    render() {
        return (
            <div>
                {this.errorNotifcation()}
                <ul className="users">
                    {this.state.users.map(user =>{
                        return <User 
                            user={user} 
                            onSelect={this.handleSelect} 
                            selectedUser = {this.state.selectedUser}
                            onDelete={this.handleDelete} 
                        />
                    })}
                </ul>
                <div className="editarea">
                    <button onClick={this.handleEnableAddMode}>Add New User</button>
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