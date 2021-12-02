// Import Mongoose
const GoTiny = require("../mongoose")

module.exports = async (req, res, next) => {
  // Get GoTiny Object from MongoDB
  const GoTinyObject = await GoTiny.findOne({ code: req.params.id })

  if (GoTinyObject) {
    // Optionally prepend with 'http://'
    let prepend = ""

    if (GoTinyObject.long.substring(0, 4) !== "http") {
      prepend = "http://"
    }

    // Redirect to Full URL
    res.redirect(prepend + GoTinyObject.long)

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

    const baseURL = new URL('https://gotiny.cc')
    const errorPage = new URL('404.html', baseURL)
    errorPage.searchParams.set('code', req.params.id)
    
    res.redirect(errorPage)
  }
}
