const express = require('express')
const app = express()
const port = 3000
const path = require('path')
// const cors = require('cors')
const cookieParser = require('cookie-parser')
const cf = require('aws-cloudfront-sign')
const options = {keypairId: 'KEYPAIR_ID', privateKeyPath: './private.pem'}
const cdnDomain = 'https://d3hqjqdr0jqjzf.cloudfront.net'

app.use(express.static('public'))
// app.use(cors())
app.use(cookieParser())


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/auth', (req, res) => {
  const signed = cf.getSignedCookies(cdnDomain, options)
  res.cookie('CloudFront-Expires', 1595372546, {secure: true, sameSite: 'None', httpOnly: true, domain: cdnDomain, path: '/'})
  res.cookie('CloudFront-Signature', signed, {secure: true, sameSite: 'None', httpOnly: true, domain: cdnDomain, path: '/'})
  res.cookie('CloudFront-Key-Pair-Id', options.keypairId, {secure: true, sameSite: 'None', httpOnly: true, domain: cdnDomain, path: '/'})
  res.sendFile(path.join(__dirname, 'secure.html'))
})

app.listen(port, () => {
  console.log(`app running on http://localhost:${port}`)
})
