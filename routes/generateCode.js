// Import Mongoose
const GoTiny = require('../mongoose');

// Import Helper functions
const { constructError, getTiny, urlCheck } = require('../helpers');

module.exports = async (req, res) => {
  const staged = [];

  if (req.body.input) {
    // If input parameter is present, filter links out of string and stage them
    urlCheck(req.body.input).forEach((long) => {
      staged.push({
        long,
        custom: null,
        useFallback: null,
      });
    });
  } else if (req.body.long) {
    // If long parameter is present, verify and stage link
    staged.push({
      long: urlCheck(req.body.long)[0],
      custom: req.body.custom,
      useFallback: req.body.useFallback,
    });
  } else if (Array.isArray(req.body) && req.body.length) {
    // If body is array, loop over all objects and stage them
    req.body.forEach((obj) => {
      staged.push({
        long: urlCheck(obj.long)[0],
        custom: obj.custom,
        useFallback: obj.useFallback,
      });
    });
  } else {
    // Send error if no input is provided
    res.send(constructError('missing-argument', 'No input provided'));
    return;
  }

  // Send error if no valid links are staged
  if (!staged.map((obj) => obj.long).some((long) => !!long === true)) {
    res.send(constructError('no-link-found', 'Could not find a link'));
    return;
  }

  // Send error if duplicate custom codes are found
  const customsArray = staged.map((obj) => obj.custom);
  const duplicatesArray = customsArray
    .filter((code, index) => customsArray.indexOf(code) !== index)
    .filter((code) => !!code === true);

  if (duplicatesArray.length) {
    res.send(
      constructError(
        'duplicate-custom-codes',
        `The following custom codes are being used multiple times: ${duplicatesArray}`,
      ),
    );
    return;
  }

  const customCodeRegex = /^[a-z0-9_-]+$/;

  // Verify custom code
  if (staged[0].custom) {
    staged[0].custom = staged[0].custom.toLowerCase();

    // Send error if custom code is less than 4 characters long
    if (staged[0].custom?.length < 4) {
      if (staged[0].useFallback === false) {
        res.send(constructError('custom-code-invalid', 'Custom code too short'));
        return;
      }
      staged[0].custom = null;
    }

    // Send error if custom code is more than 32 characters long
    if (staged[0].custom?.length > 32) {
      if (staged[0].useFallback === false) {
        res.send(constructError('custom-code-invalid', 'Custom code too long'));
        return;
      }
      staged[0].custom = null;
    }

    // Send error if two of the same symbols are next to each other
    if (/(--)|(__)/.test(staged[0].custom)) {
      if (staged[0].useFallback === false) {
        res.send(
          constructError('custom-code-invalid', 'Custom code has two of the same symbols together'),
        );
        return;
      }
      staged[0].custom = null;
    }

    // Send error if custom code contains restricted characters
    if (!customCodeRegex.test(staged[0].custom)) {
      if (staged[0].useFallback === false) {
        res.send(
          constructError(
            'custom-code-invalid',
            'Custom code does not only contain lowercase letters, numbers and - or _ symbols.',
          ),
        );
        return;
      }
      staged[0].custom = null;
    }

    // Check if custom code is already taken
    const codeTaken = await GoTiny.findOne({ code: staged[0].custom });

    if (codeTaken) {
      if (staged[0].useFallback === false) {
        res.send(constructError('custom-code-taken', `Custom code already taken: ${staged[0].custom}`));
        return;
      }
      staged[0].custom = null;
    }
  }

  // Save to database
  const entries = staged.map((entry) => new GoTiny({
    long: entry.long,
    code: entry.custom || getTiny(6),
    customCode: !!entry.custom,
    lastActive: null,
    createdAt: Date.now(),
    visited: 0,
  }));

  GoTiny.insertMany(entries, (error, docs) => {
    if (error) {
      console.log(error);
    } else {
      const responseArray = [];

      docs.forEach((doc) => {
        responseArray.push({
          long: doc.long,
          code: doc.code,
        });
      });

      // Send response
      res.send(responseArray);
    }
  });
};
