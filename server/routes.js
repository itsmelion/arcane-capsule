const express = require('express');

const router = express.Router();

const data = {
  someitem: 'some data',
  anotheritem: 'another data',
  number: 999,
  array: [1, 'string', { subitem: 'subvalue' }],
};

router.get('/', (req, res) => {
  res.format({
    html() {
      res.send(`
        <style>
          .contain { box-sizing: border-box; padding: 2rem; }
          pre {
            box-sizing: border-box; padding: 1rem; color: white;
            background: #1c2030; font-size: 1.2rem;
          }
        </style>
        <h1>Welcome to ${process.env.appName} !!</h1>
        <br>
        <main id="root" class="contain">
        <h3>You sent me this request</h3>
        <b>body:</b>
        <pre>${JSON.stringify(req.body, null, 2)};</pre><br>
        <b>Query:</b>
        <pre>${JSON.stringify(req.query, null, 2)}</pre>
        <br>
        <b>Params:</b>
        <pre>${JSON.stringify(req.params)}</pre><br><br>
        <b>headers:</b>
        <pre>${JSON.stringify(req.headers, null, 2)}</pre>
        <br>
        <hr>
        <h3>Here is your data:</h3>
        <pre>${JSON.stringify(data, null, 2)}</pre>
        </main>
        <footer>Developed with 💙 by <a href="http://alia.ml">Alia<a></footer>
      `);
    },

    json() {
      res.jsonp(data);
    },
  });
});

module.exports = router;
