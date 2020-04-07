const baseAPI = '/api';

const usersAPI = {
  getUserName(userId) {
    return new Promise((resolve, reject) => {
      fetch(`${baseAPI}/users/${userId}`) // maybe want to pass this in as a param *maybe future state*
        .then((response) =>
          response.json())
        .then((json) =>
          resolve(json))
        .catch((err) => {
          reject(err);
        });
    });
  },

  getUserId(token) {
    return new Promise((resolve, reject) => {
      fetch(`${baseAPI}/getUserId?token=${token}`)
        .then((response) =>
          response.json())
        .then((json) =>
          resolve(json))
        .catch((err) =>
          reject(err));
    });
  },
};
export default usersAPI;
