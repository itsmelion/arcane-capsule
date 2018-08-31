// const Zencoder = require('zencoder');
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

  submit(file, payload, options = this.baseRequest) {
    const data = {
      test: true,
      input: file,
    };

    console.info('Encode submit');

    return axios.post(`${this.API}/jobs`, data, options)
      .then((res) => { console.info(res); return res; })
      .catch(err => console.error(err));
  }
}

module.exports = Encode;
