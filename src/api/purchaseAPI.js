const baseAPI = '/api';

const purchaseAPI = {
  get(userId) {
    return new Promise((resolve, reject) => {
      fetch(`${baseAPI}/purchases?userId=` + userId) //maybe want to pass this in as a param *maybe future state*
        .then(response => response.json())
        .then(json => resolve(json))
        .catch(err => {
          reject(err);
        });
    });
  },

  create(purchase, userId) {
    return new Promise((resolve, reject) => {
      fetch(`${baseAPI}/purchase?userId=` + userId, {
        method: 'POST',
        body: JSON.stringify(purchase),
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

  update(purchase) {
    return new Promise((resolve, reject) => {
      fetch(`${baseAPI}/purchase`, {
        method: 'PUT',
        body: JSON.stringify(purchase),
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

  destroy(purchase) {
    return new Promise((resolve, reject) => {
      fetch(`${baseAPI}/purchase/${purchase._id}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(json => resolve(json))
        .catch(err => {
          reject(err);
        });
    });
  },

  getTotalsAll(userId) {
    console.log('API', userId);
    return new Promise((resolve, reject) => {
      fetch(`${baseAPI}/purchases/totals/${userId}`)
      .then(response => response.json())
      .then(json => resolve(json))
      .catch(err => {
        reject(err);
      });
   });
  }
}
export default purchaseAPI;