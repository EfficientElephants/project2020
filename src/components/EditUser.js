import React from 'react';

const EditUser = props => {
  if (props.selectedUser) {
    return (
      <div>
        <div className="editfields">
          <div>
            <label>id: </label>
            {props.addingUser
              ? <input
                  type="number"
                  name="id"
                  placeholder="id"
                  value={props.selectedUser.id}
                  onChange={props.onChange}
                />
              : <label className="value">
                  {props.selectedUser.id}
                </label>}
          </div>
          <div>
            <label>name: </label>
            <input
              name="name"
              value={props.selectedUser.name}
              placeholder="name"
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