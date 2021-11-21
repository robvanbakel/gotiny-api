// Import Mongoose
const GoTiny = require("../mongoose")

// Import Helper functions
const { constructError, getTiny, urlCheck } = require("../helpers")

module.exports = async (req, res) => {
  // Send error if no input is found
  if (!req.body.input) {
    return res.send(constructError("missing-argument", "No input provided"))
  }

  // Check and filter URL
  if (typeof req.body.input !== "string") {
    foundLinks = urlCheck(req.body.input.join(" "))
  } else {
    foundLinks = urlCheck(req.body.input)
  }

  // Send error if no link is found
  if (!foundLinks) {
    return res.send(constructError("no-link-found", "Could not find a link"))
  }

  const customCodeRegex = /^[a-z0-9_-]{4,32}$/
  const custom = req.body.custom?.split(" ")

  const entries = []

  let useCustomCode = false

  for (const index in foundLinks) {
    // Get GoTiny Code
    let code = getTiny(6)

    if (custom && custom[index]) {
      // Validate custom code
      let customCode = custom[index].toLowerCase()

      if (/(\-\-)|(__)/.test(customCode)) {
        // Send error if no link is found
        if (req.body.useFallback === false) {
          return res.send(
            constructError("custom-code-invalid", "Custom codes can not have two of the same symbols together")
          )
        }
      }

      if (!customCodeRegex.test(customCode) || /(\-\-)|(__)/.test(customCode)) {
        if (req.body.useFallback === false) {
          return res.send(
            constructError("custom-code-invalid", `Custom code does not meet requirements: ${customCodeRegex}`)
          )
        }
      } else {
        // Check if custom code is already taken
        const codeTaken = await GoTiny.findOne({ code: customCode })

        if (codeTaken && req.body.useFallback === false) {
          return res.send(constructError("custom-code-taken", `Custom code already taken: ${customCode}`))
        }

        if (!codeTaken) {
          code = customCode
          useCustomCode = true
        }
      }
    }

    // Create GoTiny entry
    const newEntry = new GoTiny({
      long: foundLinks[index],
      code,
      customCode: useCustomCode,
      lastActive: null,
      createdAt: Date.now(),
      visited: 0,
    })

    entries.push(newEntry)
  }

  // Save to database
  GoTiny.insertMany(entries, (error, docs) => {
    if (error) {
      console.log(error)
    } else {
      const responseArray = []

      docs.forEach((doc) => {
        responseArray.push({
          long: doc.long,
          code: doc.code,
        })
      })

      // Send response
      res.send(responseArray)
    }
  })
}
