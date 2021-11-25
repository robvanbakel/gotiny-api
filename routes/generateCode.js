// Import Mongoose
const GoTiny = require("../mongoose")

// Import Helper functions
const { constructError, getTiny, urlCheck } = require("../helpers")

module.exports = async (req, res) => {
  const staged = []

  if (req.body.input) {
    // If input parameter is present, filter links out of string and stage them
    urlCheck(req.body.input).forEach((long) => {
      staged.push({
        long,
        custom: null,
        useFallback: null,
      })
    })
  } else if (req.body.long) {
    // If long parameter is present, verify and stage link
    staged.push({
      long: urlCheck(req.body.long)[0],
      custom: req.body.custom,
      useFallback: req.body.useFallback,
    })
  } else if (Array.isArray(req.body) && req.body.length) {
    // If body is array, loop over all objects and stage them
    req.body.forEach((obj) => {
      staged.push({
        long: urlCheck(obj.long)[0],
        custom: obj.custom,
        useFallback: obj.useFallback,
      })
    })
  } else {
    // Send error if no input is provided
    return res.send(constructError("missing-argument", "No input provided"))
  }

  // Send error if no valid links are staged
  if (!staged.map((obj) => obj.long).some((long) => !!long === true)) {
    return res.send(constructError("no-link-found", "Could not find a link"))
  }

  // Send error if duplicate custom codes are found
  const customsArray = staged.map((obj) => obj.custom)
  const duplicatesArray = customsArray
    .filter((code, index) => customsArray.indexOf(code) !== index)
    .filter((code) => !!code === true)

  if (duplicatesArray.length) {
    return res.send(
      constructError(
        "duplicate-custom-codes",
        `The following custom codes are being used multiple times: ${duplicatesArray}`
      )
    )
  }

  const customCodeRegex = /^[a-z0-9_-]+$/

  for (const entry of staged) {
    // Verify custom code
    if (entry.custom) {
      entry.custom = entry.custom.toLowerCase()

      // Send error if custom code is less than 4 characters long
      if (entry.custom?.length < 4) {
        if (entry.useFallback === false) {
          return res.send(constructError("custom-code-invalid", `Custom code too short: ${entry.custom}`))
        } else {
          entry.custom = null
        }
      }

      // Send error if custom code is more than 32 characters long
      if (entry.custom?.length > 32) {
        if (entry.useFallback === false) {
          return res.send(constructError("custom-code-invalid", `Custom code too long: ${entry.custom}`))
        } else {
          entry.custom = null
        }
      }

      // Send error if two of the same symbols are next to each other
      if (/(\-\-)|(__)/.test(entry.custom)) {
        if (entry.useFallback === false) {
          return res.send(
            constructError("custom-code-invalid", `Custom code has two of the same symbols together: ${entry.custom}`)
          )
        } else {
          entry.custom = null
        }
      }

      // Send error if custom code contains restricted characters
      if (!customCodeRegex.test(entry.custom)) {
        if (entry.useFallback === false) {
          return res.send(
            constructError(
              "custom-code-invalid",
              `Custom code does not only contain lowercase letters, numbers and - or _ symbols: ${entry.custom}`
            )
          )
        } else {
          entry.custom = null
        }
      }

      // Check if custom code is already taken
      const codeTaken = await GoTiny.findOne({ code: entry.custom })

      if (codeTaken) {
        if (entry.useFallback === false) {
          return res.send(constructError("custom-code-taken", `Custom code already taken: ${entry.custom}`))
        } else {
          entry.custom = null
        }
      }
    }
  }

  // Save to database

  const entries = staged.map((entry) => {
    return new GoTiny({
      long: entry.long,
      code: entry.custom || getTiny(6),
      customCode: !!entry.custom,
      lastActive: null,
      createdAt: Date.now(),
      visited: 0,
    })
  })

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
