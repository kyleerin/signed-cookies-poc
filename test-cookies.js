#!/usr/bin/env node

const {exit, exec} = require("shelljs")
const axios = require('axios').default
const expire = 1598306437
const cdnDomain = 'https://d1eztk77tajaox.cloudfront.net'
const keypair = 'APKAIZLP3CRFM7XPHETA'

// sign policy
cmd = `cat policy.json | tr -d "\\n" | tr -d " \\t\\n\\r" | openssl sha1 -sign private.pem | openssl base64 | tr -- '+=/' '-_~'`
res = exec(cmd, {silent: true})
if (res.code !== 0) {
  console.log('error signing policy', res.error)
  exit(1) // an error is shown by aws cli in stderr
}

cmd = `curl -b 'CloudFront-Signature=${res.stdout.replace(/\n/g, '')}; CloudFront-Expires=${expire}; CloudFront-Key-Pair-Id=${keypair}; Secure; HttpOnly' ${cdnDomain}/bucket.js`
res = exec(cmd, {silent: true})
// console.log(cmd)
if (res.code !== 0) {
  console.log('error making request', res.error)
  exit(1)
}

console.log(res.stdout)
