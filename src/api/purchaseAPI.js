const baseAPI = '/api';

const purchaseAPI = {
  get() {
    return new Promise((resolve, reject) => {
      fetch(`${baseAPI}/purchases`)
        .then(response => response.json())
        .then(json => resolve(json))
        .catch(err => {
          reject(err);
        });
    });
  },

  create(purchase) {
    return new Promise((resolve, reject) => {
      fetch(`${baseAPI}/purchase`, {
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
      fetch(`${baseAPI}/purchase/${purchase.createdAt}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(json => resolve(json))
        .catch(err => {
          reject(err);
        });
    });
  }
};

export default purchaseAPI;