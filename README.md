# URL Shortener Application

A restful CRUD API for URL shortening using Node.js, Express and MongoDB. Note that you will need MongoDB installed.

## Steps to Setup

1. Install dependencies

```bash
npm install
```

2. Run Server

```bash
node app.js
```

## Using the API

Create a short link with
```
POST http://localhost:8080/short_link
{
  "long_url": "<long_url>"
}
```
The API accepts a `POST` request with a JSON body and a content-type of `application/json`.  The `long_url` should be a valid URL like `https://www.twitter.com`.

If the `long_url` has already been shortened, the API will return the previously created `short_link`.  Otherwise, it will return a new `short_link`.  The response will look something like
```
{
  "long_url": "<long_url>",
  "short_link": "<short_link>"
}
```
where the `short_link` looks something like `localhost:8080/1Dk4whT75eX`

To access a short link: Once you have a generated short link, you will be able to access the short link and be redirected to the long link (original URL).  The request would look something like
```
GET http://localhost:8080/a1B2c3D4
```
which will return a 301 that redirects the user to the original URL.

You can access an analytics view for a given short link that will show analytics about each time the short link has been accessed. The analytics view is signified by adding a `+` to the end of a given short link. For example
```
GET http://localhost:8080/a1B2c3D4+
{
  "response": [
    {
      "time": "2018-10-01T10:00:00Z",
      "referrer": "none",
      "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36"
    },
    {
      "time": "2018-10-01T15:30:10Z",
      "referrer": "none",
      "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36"
    }
  ]
}
```
In the above example, the `referrer` is `none` because the link was directly pasted into a browser.  It will follow the same semantics of the HTTP referrer header.

You can browse the API at <http://localhost:8080>

**Author**

Gabe Leon
