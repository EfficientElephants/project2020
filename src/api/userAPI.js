const baseAPI = '/api';

const usersAPI = {
  get(userId) {
    return new Promise((resolve, reject) => {
      fetch(`${baseAPI}/users/${userId}`) //maybe want to pass this in as a param *maybe future state*
        .then(response => response.json())
        .then(json => resolve(json))
        .catch(err => {
          reject(err);
        });
    });
  },

//   update(user) {
//     return new Promise((resolve, reject) => {
//       fetch(`${baseAPI}/user`, {
//         method: 'PUT',
//         body: JSON.stringify(user),
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json'
//         }
//       })
//         .then(result => {
//           resolve(result);
//         })
//         .catch(err => {
//           reject(err);
//         });
//     });
//   }
}


export default usersAPI;