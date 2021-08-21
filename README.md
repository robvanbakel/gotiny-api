# GoTiny
### A lightweight link shortener API

[Live](https://gotiny.cc) | [API Docs](https://gotiny.cc/api)

GoTiny is a link shortener API that's built with a failproof user experience as its main goal, for both the visitors of the landing page as well as developers. GoTiny links are all lowercase and don't include characters that could be confused with each other (e.g. o/0 or 1/i/l). It also filters the url out of any string that a user enters. This way, developers using the API don't have to provide a clean link, but can just feed an entire paragraph into GoTiny. The API will find the url and return a short link.

#### Built With

GoTiny links are stored in and queried from MongoDB. The API interfaces with the database through [Mongoose](https://mongoosejs.com). The Discord bot uses [Discord.js](https://discord.js.org) to read and write messages and because I'm an avid Notion user, the API stores every tiny link in a database through the [Notion API](https://developers.notion.com/docs). All invalid entries (i.e. strings that don't contain a valid URL) are also stored in Notion, making it easy to spot common user errors or gaps in the logic that validates the URL from a string.
