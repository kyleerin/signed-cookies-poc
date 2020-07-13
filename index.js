const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const cors = require('cors')
const cf = require('aws-cloudfront-sign')
const options = {keypairId: 'APKAIAJ7G3RDYUHGZNYQ', privateKeyPath: './private.pem'}
const cdnDomain = 'https://cloudfront.net'

app.use(express.static('public'))
app.use(cors())


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/auth', (req, res) => {
  const signed = cf.getSignedCookies(cdnDomain, options)
  res.cookie('authorized', signed, {maxAge: 24 * 60 * 60, secure: true, sameSite: 'None', domain: cdnDomain})
  res.sendFile(path.join(__dirname, 'secure.html'))
})

app.listen(port, () => {
  console.log(`app running on http://localhost:${port}`)
})
