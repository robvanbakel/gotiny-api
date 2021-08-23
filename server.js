const express = require('express');
const cors = require('cors');
const gotiny = require('gotiny')
require('dotenv').config()

const app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(cors());

// Discord Bot
const bot_discord = require('./bot_discord');
bot_discord();

// Mongoose
const GoTiny = require('./mongoose')

// Notion
const addToNotion = require('./notion')

// Helpers
const { getTiny, urlCheck } = require('./helpers')

// Redirect GoTiny to URL
app.get('/:id', async (req, res) => {

  // Get GoTiny Object from MongoDB
  const GoTinyObject = await GoTiny.findOne({ code: req.params.id });

  if (GoTinyObject) {

    // Optionally prepend with 'http://'
    let prepend = '';

    if (GoTinyObject.long.substring(0, 4) !== 'http') {
      prepend = 'http://'
    }

    // Redirect to Full URL
    res.redirect(prepend + GoTinyObject.long)

    // Update Last Active and Visited
    await GoTiny.updateOne(
      { _id: GoTinyObject._id },
      {
        $set: { lastActive: Date.now() },
        $inc: { visited: 1 }
      }
    )

  }
  else {
    res.status(404)
    res.sendFile(__dirname + '/public/404.html');
  }

});

app.get('/api/:id', async (req, res) => {

  const GoTinyObject = await GoTiny.findOne({ code: req.params.id });

  if (GoTinyObject) {

    res.send(GoTinyObject.long)

    // Update Last Active and Visited
    await GoTiny.updateOne(
      { _id: GoTinyObject._id },
      {
        $set: { lastActive: Date.now() },
        $inc: { visited: 1 }
      }
    )

  }
  else {
    res.status(404)
    res.send('GoTiny link not found')
  }

})

app.post('/apiLocal', async (req, res) => {

  try {

    // Get GoTiny link from API and send response to client
    const goTinyObject = await gotiny.set(req.body.long)
    res.send(JSON.stringify(goTinyObject[0].tiny))

  } catch (err) {

    // If API returns an error, send response to client
    res.status(400).send(err)

  }

});

// Generate new GoTiny Link
app.post('/api', async (req, res) => {

  // Send error if no input is found
  if (!req.body.input) {
    res.send({
      error: {
        source: 'api',
        code: 'missing-argument',
        message: 'No key `input` provided',
      }
    })
  } else {

    // Check and filter URL
    foundLinks = urlCheck(req.body.input)

    // Send error if no link is found
    if (!foundLinks) {
      res.send({
        error: {
          source: 'api',
          code: 'no-link-found',
          message: 'Could not find a link'
        }
      })
    } else {

      const entries = []

      foundLinks.forEach(long => {

        // Get GoTiny Code
        const code = getTiny(6)

        // Create GoTiny entry
        const newEntry = new GoTiny({
          long,
          code,
          lastActive: null,
          createdAt: Date.now(),
          visited: 0
        });

        entries.push(newEntry)

      })

      // Save to database
      GoTiny.insertMany(entries, (error, docs) => {

        if (error) {
          console.log(error)
        } else {

          const responseArray = []

          docs.forEach(doc => {
            responseArray.push({
              long: doc.long,
              code: doc.code
            })
          })

          // Send response
          res.send(responseArray)
        }

      })

    }
  }

});

// Start Server
app.listen(process.env.PORT, () => console.log(`GoTiny running on port ${process.env.PORT}`));
