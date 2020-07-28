#!/usr/bin/env node

const {exit, exec} = require("shelljs")
const expire = 1598306437 // <--- make sure this is the same as the number in your policy.json
const cdnDomain = 'https://d1eztk77tajaox.cloudfront.net' // <--- change this to your cloudfront url, and update ./policy.json as well
const keypair = 'APKAIZLP3CRFM7XPHETA' // <--- change this to your cloudfront keypairid (taken from account security settings)

// sign policy
cmd = `cat policy.json | tr -d "\\n" | tr -d " \\t\\n\\r" | openssl sha1 -sign private.pem | openssl base64 | tr -- '+=/' '-_~'`
res = exec(cmd, {silent: true})
if (res.code !== 0) {
  console.log('error signing policy', res.error)
  exit(1) // an error is shown by aws cli in stderr
}
const signature = res.stdout.replace(/\n/g, '')
// hashed policy
cmd = `cat policy.json | tr -d "\\n" | tr -d " \\t\\n\\r" | openssl base64 | tr -- '+=/' '-_~'`
res = exec(cmd, {silent: true})
if (res.code !== 0) {
  console.log('error hashing policy', res.error)
  exit(1) // an error is shown by aws cli in stderr
}
const hashedPolicy = res.stdout.replace(/\n/g, '')

// access first js file
cmd = `curl -b 'CloudFront-Signature=${signature}; Secure; HttpOnly; CloudFront-Expires=${expire}; Secure; HttpOnly; CloudFront-Key-Pair-Id=${keypair}; Secure; HttpOnly; CloudFront-Policy=${hashedPolicy}; Secure; HttpOnly;' ${cdnDomain}/testdir/bucket.js`
res = exec(cmd, {silent: true})
if (res.code !== 0) {
  console.log('error making request', res.error)
  exit(1)
}

console.log('SUCCESS', res.stdout)

// access second js file
cmd = `curl -b 'CloudFront-Signature=${signature}; Secure; HttpOnly; CloudFront-Expires=${expire}; Secure; HttpOnly; CloudFront-Key-Pair-Id=${keypair}; Secure; HttpOnly; CloudFront-Policy=${hashedPolicy}; Secure; HttpOnly;' ${cdnDomain}/testdir/bucket2.js`
res = exec(cmd, {silent: true})
if (res.code !== 0) {
  console.log('error making request', res.error)
  exit(1)
}

console.log('SUCCESS', res.stdout)
