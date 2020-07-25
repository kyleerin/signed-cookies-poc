# signed-cookies-poc
A proof of concept for using signed cookies, to restrict access to cloudfront

# Configure
Follow [this guide](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-signed-cookies.html) on setting up cloudfront and S3 for signed cookies.

Update config values cdnDomain and keypairid in `./test-cookies.js` with your cloudfront url and cloudfront keypairid.

Update the `./policy.json` with your resource url, ie. the file you want to fetch.

Download your cloudfront private key, put in base directory.

Make sure the epoch time in `./policy.json` and `./test-cookies.js` are the same and in the future.

# To run
`$ node test-cookies.js`
