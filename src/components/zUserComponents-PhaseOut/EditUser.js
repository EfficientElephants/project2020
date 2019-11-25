// phase out

import React from 'react';

const EditUser = props => {
  if (props.selectedUser) {
    return (
      <div>
        <div className="editfields">
          <div>
            <label>email: </label>
            {props.addingUser
              ? <input
                  name="email"
                  placeholder="example@test.com"
                  value={props.selectedUser.email}
                  onChange={props.onChange}
                />
              : <label className="value">
                  {props.selectedUser.email}
                </label>}
          </div>
          <div>
            <label>username: </label>
            <input
              type="string"
              name="username"
              value={props.selectedUser.username}
              placeholder="username"
              onChange={props.onChange}
            />
          </div>
          <div>
            <label>password: </label>
            <input
              name="password"
              value={props.selectedUser.password}
              placeholder="password"
              onChange={props.onChange}
            />
          </div>
        </div>
        <button onClick={props.onCancel}>Cancel</button>
        <button onClick={props.onSave}>Save</button>
      </div>
    );
  } else {
    return <div />;
  }
};

export default EditUser;