import React from 'react';

const EditExpense = props => {
  

  if (props.selectedExpense) {
    return (
      <div>
        <div className="editfields">
          <div>
            <label>Item: </label>
            <input
                type="string"
                name="item"
                // placeholder="example@test.com"
                value={props.selectedExpense.item}
                onChange={props.onChange}
              />
          </div>
          <div>
            <label>Price: </label>
            <input
              type="string"
              name="price"
              value={props.selectedExpense.price}
              placeholder="$5.00"
              onChange={props.onChange}
            />
          </div>
          <div>
            <label>
              Category
            </label>
            <select name="category" value = {props.selectedExpense.category.value} onChange={props.onChange}>
                <option value="Rent">Rent</option>
                <option value="Food">Food</option>
                <option value="Social">Social</option>
                <option value="Medical">Medical</option>
                <option value="Transportation">Transportation</option>
                <option value="Personal Care">Personal Care</option>
            </select>
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

export default EditExpense;