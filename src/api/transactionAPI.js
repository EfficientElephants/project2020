const baseAPI = '/api';

const transactionAPI = {
  get(userId, dates) {
    return new Promise((resolve, reject) => {
      fetch(`${baseAPI}/transactions?userId=${userId}&dates=${dates}`) // maybe want to pass this in as a param *maybe future state*
        .then((response) =>
          response.json())
        .then((json) =>
          resolve(json))
        .catch((err) => {
          reject(err);
        });
    });
  },

  create(transaction, userId) {
    return new Promise((resolve, reject) => {
      fetch(`${baseAPI}/transaction?userId=${userId}`, {
        method: 'POST',
        body: JSON.stringify(transaction),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then((result) =>
          result.json())
        .then((json) =>
          resolve(json))
        .catch((err) => {
          reject(err);
        });
    });
  },

  update(transaction) {
    return new Promise((resolve, reject) => {
      fetch(`${baseAPI}/transaction`, {
        method: 'PUT',
        body: JSON.stringify(transaction),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  destroy(transaction) {
    return new Promise((resolve, reject) => {
      fetch(`${baseAPI}/transaction/${transaction._id}`, { method: 'DELETE' })
        .then((response) =>
          response.json())
        .then((json) =>
          resolve(json))
        .catch((err) => {
          reject(err);
        });
    });
  },


  getTotalsAll(userId, dates) {
    return new Promise((resolve, reject) => {
      fetch(`${baseAPI}/transaction/totals/${userId}/${dates}`)
        .then((response) =>
          response.json())
        .then((json) =>
          resolve(json))
        .catch((err) => {
          reject(err);
        });
    });
  },

  getSpendingTotal(userId, dates) {
    return new Promise((resolve, reject) => {
      fetch(`${baseAPI}/transaction/spendingTotal/${userId}/${dates}`)
        .then((response) =>
          response.json())
        .then((json) =>
          resolve(json))
        .catch((err) => {
          reject(err);
        });
    });
  },
  getIncomeTotal(userId, dates) {
    return new Promise((resolve, reject) => {
      fetch(`${baseAPI}/transaction/incomeTotal/${userId}/${dates}`)
        .then((response) =>
          response.json())
        .then((json) =>
          resolve(json))
        .catch((err) => {
          reject(err);
        });
    });
  },

  earliestTransaction(userId) {
    return new Promise((resolve, reject) => {
      fetch(`${baseAPI}/transaction/earliest/${userId}`)
        .then((response) =>
          response.json())
        .then((json) =>
          resolve(json))
        .catch((err) => {
          reject(err);
        });
    });
  },

};
export default transactionAPI;
