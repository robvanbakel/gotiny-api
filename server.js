const express = require('express');
const cors = require('cors');
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

  let { long } = req.body;

  if (!long) {

    res.status(404).json({ error: "Key: 'long' not found!" })

  } else {

    // Check and filter URL
    long = urlCheck(long)

    if (long) {

      long = long[0]

      // Get GoTiny Code
      const code = getTiny(6)

      // Create GoTiny entry
      const newGoTiny = new GoTiny({
        long,
        code,
        lastActive: null,
        createdAt: Date.now(),
        visited: 0
      });

      try {

        // Save to Mongo DB
        await newGoTiny.save()

        // Save to Notion
        addToNotion(code, long)

        // Send Response
        res.send({
          long,
          code,
          tiny: `gotiny.cc/${code}`,
          link: `https://gotiny.cc/${code}`
        })

        console.log(`${Date.now()}: Created ${code}`)

      } catch (err) {

        res.status(404).json({ error: err._message })

      }

    } else {
      res.status(401).json('Invalid long url')

      console.log(`${Date.now()}: Logged invalid entry`)

      // Save to Notion
      addToNotion('<invalid>', req.body.long)

    };
  }


});

// Generate new GoTiny Link
app.post('/api', async (req, res) => {

  // Check and filter URL
  foundLinks = urlCheck(req.body.input)

  if (foundLinks) {

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

  } else {
    res.send({
      error: 'Error: No link found'
    })
  }

});

// Start Server
app.listen(process.env.PORT, () => console.log(`GoTiny running on port ${process.env.PORT}`));
