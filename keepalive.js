const app = require('express')();

app.get('/', (req, res) => {
  res.send("OK");
});

app.listen(3000);