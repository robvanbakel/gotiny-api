const { Client } = require("@notionhq/client")

const notion = new Client({ auth: process.env.NOTION_KEY })

const databaseId = process.env.NOTION_DATABASE_ID

const addToNotion = async (code, long) => {
  await notion.pages.create({
    parent: { database_id: databaseId },
    properties: {
      Code: {
        title: [
          {
            "text": {
              "content": code
            }
          }
        ]
      },
      Long: {
        url: long,
      },
    },
  })
}

module.exports = addToNotion