#!/bin/bash
cat policy.json | tr -d "\n" | tr -d " \t\n\r" | openssl sha1 -sign private.pem | openssl base64 | tr -- '+=/' '-_~'
