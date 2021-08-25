const fs = require('fs');
const config = require('./config');
const express = require('express');

const app = express();
app.use(express.static('public'))
app.use(express.json({ extended: true }))
app.use(express.urlencoded({ extended: true }))

const fileRoute = config.fileServer && config.fileServer.route ? config.fileServer.route : ''

app.get(`${fileRoute}/:file`, async (req, res) => {
  try {
    const path = `${config.fileServer.folder + '/' || ''}${req.params.file}`;
    fs.readFileSync(path, 'utf8');
    res.sendFile(path);
  } catch (err) {
    res.send('file not found').status(404)
    console.error(err.message)
  }
})

app.get('*', async (req, res) => {
  res.redirect(config.redirect)
})

const port = config.port || 80
app.listen(port, () => {
  console.log(`Redirecting from ${port} to ${config.redirect}`)
})