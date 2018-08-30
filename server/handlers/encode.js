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
    this.basePayload = {
      test: true,
    };
  }

  submit(file, payload = this.basePayload) {
    const options = {
      ...this.baseRequest,
      data: JSON.stringify({
        ...this.basePayload,
        ...payload,
        input: file,
      }),
    };

    console.info('Encode submit');

    return axios.post(`${this.API}/jobs`, options);
  }
}

module.exports = Encode;
