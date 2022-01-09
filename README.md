# GoTiny API

GoTiny is a link shortener API that's built with a failproof user experience as its main goal, for both the visitors of the landing page as well as developers. GoTiny links are all lowercase and don't include characters that could be confused with each other (e.g. o/0 or 1/i/l).

It also filters the url out of any string that a user enters. This way, developers using the API don't have to provide a clean link, but can just feed an entire paragraph into GoTiny. The API will find the url and return a short link.

## Table of Contents

- [Usage](#usage)
  - [Create GoTiny link](#create-gotiny-link)
    - [Options](#options)
  - [Resolve GoTiny link](#resolve-gotiny-link)
- [JavaScript SDK](#javascript-sdk)

## Usage

### Create GoTiny link

The GoTiny API lets you quickly obtain a short code that's used to redirect to an URL specified by the user.

| Method | Endpoint                | Format | Parameters                               |
| :----- | :---------------------- | :----- | :--------------------------------------- |
| POST   | `https://gotiny.cc/api` | JSON   | `input`, {`long`,`custom`,`useFallback`} |

To use the GoTiny API, make a POST request to the endpoint `https://gotiny.cc/api`. The body of your request should be in JSON format with a property name of `input`. This key should have a value of the URL you want to shorten or a string that contains that URL. When multiple URLs are found in the provided string, short links will be generated for all of them.

The response will be formatted as JSON and contain the long URL that was shortened and a randomly generated 6-character long code, if provided. This code will be used as an identifier to redirect to the long URL.

### Example Request

###### curl

```bash
curl -X POST https://gotiny.cc/api -H "Content-Type: application/json" -d '{ "input" : "https://amazon.com/very-long-url" }'
```

###### JavaScript

```javascript
fetch("https://gotiny.cc/api", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ input: "https://amazon.com/very-long-url" }),
})
```

### Example Response

```json
{
  "long": "https://amazon.com/very-long-url",
  "code": "y68hxc"
}
```

When `gotiny.cc/y68hxc` is visited, the visitor will be redirected to `https://amazon.com/very-long-url`.

### Options

Options are provided by sending an object in the request body. The object should have a `long` key with the long link as a value, as wel as any of the supported options. Options currently supported are:

| Key           | Type    | Description                                                                                                                                         |
| :------------ | :------ | :-------------------------------------------------------------------------------------------------------------------------------------------------- |
| `custom`      | string  | Generates a custom link (e.g. `gotiny.cc/custom-link`). Custom codes should consist of 4-32 lowercase letters, numbers, `-` and/or `_` symbols.     |
| `useFallback` | boolean | Set to `false` if you don't want to use a randomly generated 6-character fallback code and throw an error instead when a custom code can't be used. |

To generate multiple links at once, you can pass an array of objects into the request body.

### Example Request

###### curl

```bash
curl -X POST https://gotiny.cc/api -H "Content-Type: application/json" -d '{ "long": "https://amazon.com/very-long-url", "custom": "amazon", "useFallback": false }'
```

### Resolve GoTiny link

You can get the long URL that corresponds with a GoTiny link by making a GET request to `https://gotiny.cc/api/<code>`. The long URL will be returned in plain text.

### Example Request

###### curl

```bash
curl https://gotiny.cc/api/y68hxc
```

###### JavaScript

```javascript
fetch('https://gotiny.cc/api/y68hxc')
  .then((res) => res.text())
  .then((data) => console.log(data))
```

## JavaScript SDK

JavaScript developers might want to consider using the [GoTiny SDK](https://www.npmjs.com/package/gotiny). The SDK provides extra features like improved error-handling and extended return objects.

#### Built With

- [Node.js](https://nodejs.org)
- [Express](http://expressjs.com)
- [MongoDB](https://www.mongodb.com)
- [Mongoose](https://mongoosejs.com)

## Other repositories

- [robvanbakel/gotiny-sdk](https://github.com/robvanbakel/gotiny-sdk)
- [robvanbakel/gotiny-website](https://github.com/robvanbakel/gotiny-website)
- [robvanbakel/gotiny-discord-bot](https://github.com/robvanbakel/gotiny-discord-bot)
- [robvanbakel/gotiny-slack-bot](https://github.com/robvanbakel/gotiny-slack-bot)

