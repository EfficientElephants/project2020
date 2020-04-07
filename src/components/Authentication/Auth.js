// import { getFromStorage } from '../Storage';

class Auth {
  constructor() {
    this.authenticated = false;
  }

  login(cb) {
    // const obj = getFromStorage('expense_app');
    // if (obj && obj.token) {
    //     const { token } = obj;
    //     // Verify token
    //     fetch('/api/verify?token=' + token)
    //     .then(res => res.json())
    //     .then(json => {
    //         if(json.success){
    //             this.state.authenticated = true;
    //         }
    //         else {
    //             this.state.authenticated = false;
    //         }
    //     })
    // }

    this.authenticated = true;
    cb();
  }

  logout(cb) {
    this.authenticated = false;
    cb();
  }

  isAuthenticated() {
    return this.authenticated;
  }
}

export default new Auth();
