const { constructError } = require("../helpers")

// Import Mongoose
const GoTiny = require("../mongoose")

module.exports = async (req, res, next) => {
  const GoTinyObject = await GoTiny.findOne({ code: req.params.id })

  if (GoTinyObject) {
    if (req.query.format === 'json') {
      res.json({
        code: GoTinyObject.code, 
        long: GoTinyObject.long,
      })
    } else {
      res.send(GoTinyObject.long)
    }

    // Update Last Active and Visited
    await GoTiny.updateOne(
      { _id: GoTinyObject._id },
      {
        $set: { lastActive: Date.now() },
        $inc: { visited: 1 },
      }
    )
  } else {
    res.status(404)
    return res.send(constructError("no-matches", "GoTiny link not found"))
  }
}
