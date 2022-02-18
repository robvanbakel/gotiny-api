const constructError = (code, message) => {
  return {
    error: {
      source: "api",
      code,
      message,
    },
  }
}

// List of allowed characters
const chars = ['a', 'b', 'c', 'd', 'e', 'f', 'h', 'k', 'm', 'n', 'p', 'r', 's', 't', 'w', 'x', 'y', 'z', '2', '3', '4', '5', '6', '7', '8']

// Generate GoTiny Code
const getTiny = len => {
  let id = '';
  for (let i = 0; i < len; i++) {
    id = id.concat(chars[Math.floor(Math.random() * chars.length)])
  }
  return id;
}

// Check for valid URL
const urlCheck = str => {
  const regex = new RegExp(
    '(http(s)?:\\/\\/.)?[-a-z0-9@:%._\\+~#=]{1,2048}\\.[a-z]{2,24}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)',
    'gi'
  )

  const matches = str.match(regex)

  return matches || []
}

module.exports = {constructError, getTiny, urlCheck}