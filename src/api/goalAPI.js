const baseAPI = '/api';

const goalAPI = {
  get(userInfo) {
    return new Promise((resolve, reject) => {
      fetch(`${baseAPI}/goals/${userInfo.userId}/${userInfo.mmyyID}`) //maybe want to pass this in as a param *maybe future state*
        .then(response => response.json())
        .then(json => resolve(json))
        .catch(err => {
          reject(err);
        });
    });
  },

  create(goal, userId) {
    return new Promise((resolve, reject) => {
      fetch(`${baseAPI}/goal?userId=` + userId, {
        method: 'POST',
        body: JSON.stringify(goal),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(result => result.json())
        .then(json => resolve(json))
        .catch(err => {
          reject(err);
        });
    });
  },

  update(goal) {
    return new Promise((resolve, reject) => {
      fetch(`${baseAPI}/goal`, {
        method: 'PUT',
        body: JSON.stringify(goal),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  destroy(goal) {
    return new Promise((resolve, reject) => {
      fetch(`${baseAPI}/goal/${goal._id}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(json => resolve(json))
        .catch(err => {
          reject(err);
        });
    });
  },

}
export default goalAPI;

