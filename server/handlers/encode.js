const axios = require('axios');

class Encode {
  constructor() {
    this.API = process.env.ENCODER_API;
    this.baseRequest = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Zencoder-Api-Key': process.env.ENCODER_KEY,
      },
    };
  }

  submit(payload) {
    const options = {
      ...this.baseRequest,
      data: JSON.stringify(payload),
    };
    console.info('Encode submit');

    return axios.post(`${this.API}/jobs`, options);
  }
}

module.exports = Encode;
