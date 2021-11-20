# GoTiny API

GoTiny is a link shortener API that's built with a failproof user experience as its main goal, for both the visitors of the landing page as well as developers. GoTiny links are all lowercase and don't include characters that could be confused with each other (e.g. o/0 or 1/i/l).

It also filters the url out of any string that a user enters. This way, developers using the API don't have to provide a clean link, but can just feed an entire paragraph into GoTiny. The API will find the url and return a short link.

## Usage

The GoTiny API lets you quickly obtain a short code that's used to redirect to an URL specified by the user.

| Method | Endpoint                | Format | Parameters                                            |
| :----- | :---------------------- | :----- | :---------------------------------------------------- |
| POST   | `https://gotiny.cc/api` | JSON   | `input`, `custom` (optional),`useFallback` (optional) |

To use the GoTiny API, make a POST request to the endpoint `https://gotiny.cc/api`. The body of your request should be in JSON format with a property name of `input`. This key should have a value of the URL you want to shorten or a string that contains that URL. To shorten multiple links at once, you can pass in an array with links.

Optionally, you can provide a `custom` key. The value of this key will be used as the GoTiny code for the generated link. Custom codes should consist of 4-32 lowercase letters, numbers, hyphen and/or underscore symbols. When a custom code does not meet these requirements, or when a custom code is already being used, the API will automatically use a randomly generated fallback code. If you want the API to not continue when not being able to use your custom code, set the request's `useFallback` parameter to `false`.

The response will be formatted as JSON and will contain the long URL that was shortened, a randomly generated 6-digit code or custom code, if provided. This code will be used as an identifier to redirect to the long URL.

## Example Request

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

#### JavaScript SDK

JavaScript developers might want to consider using the [GoTiny SDK](https://www.npmjs.com/package/gotiny). The SDK provides extra features like improved error-handling and extended return objects.

## Example Response

```json
{
  "long": "https://amazon.com/very-long-url",
  "code": "y68hxc"
}
```

When `gotiny.cc/y68hxc` is visited, the visitor will be redirected to `https://amazon.com/very-long-url`.

#### Built With

- [Node.js](https://nodejs.org)
- [Express](http://expressjs.com)
- [MongoDB](https://www.mongodb.com)
- [Mongoose](https://mongoosejs.com)

## Other repositories

- [robvanbakel/gotiny-sdk](https://github.com/robvanbakel/gotiny-sdk)
- [robvanbakel/gotiny-website](https://github.com/robvanbakel/gotiny-website)
- [robvanbakel/gotiny-discord-bot](https://github.com/robvanbakel/gotiny-discord-bot)
