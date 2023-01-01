import { Request, Response } from 'express';
import GoTiny, { GoTinyObject } from '../mongoose';

import {
  constructError,
  getTiny,
  urlCheck,
  isVulnerableDomain,
} from '../utils';

interface StagedObject {
  long: string;
  custom?: string;
  useFallback?: boolean;
}

export default async (req: Request, res: Response) => {
  const staged: StagedObject[] = [];

  if (req.body.input) {
    urlCheck(req.body.input).forEach((long) => {
      staged.push({ long });
    });
  } else if (req.body.long) {
    staged.push({
      long: urlCheck(req.body.long)[0],
      custom: req.body.custom,
      useFallback: req.body.useFallback,
    });
  } else if (Array.isArray(req.body) && req.body.length) {
    req.body.forEach((obj: any) => {
      staged.push({
        long: urlCheck(obj.long)[0],
        custom: obj.custom,
        useFallback: obj.useFallback,
      });
    });
  } else {
    res.send(constructError('missing-argument', 'No input provided'));
    return;
  }

  const filteredStaged = staged.filter((obj) => obj.long);

  if (!filteredStaged.length) {
    res.send(constructError('no-link-found', 'Could not find a link'));
    return;
  }

  // Send error if duplicate custom codes are found
  const customsArray = staged.map((obj) => obj.custom);
  const duplicatesArray = customsArray
    .filter((code, index) => customsArray.indexOf(code) !== index)
    .filter(Boolean);

  if (duplicatesArray.length) {
    res.send(
      constructError(
        'duplicate-custom-codes',
        `The following custom codes are being used multiple times: ${duplicatesArray.join(
          ', '
        )}`
      )
    );
    return;
  }

  const customCodeRegex = /^[a-z0-9_-]+$/;

  const checkCostomDuplicates: Promise<{ _id: object } | null>[] = [];

  filteredStaged.forEach((stagedLink) => {
    if (!stagedLink.custom) return;

    const customCode = stagedLink.custom.toLowerCase();

    // Check if "domain/host" is vulnerable (and sends a custom error).
    if (isVulnerableDomain(stagedLink?.long)) {
      if (!stagedLink.useFallback /* falsy */) {
        return res.send(
          constructError(
            'long-url-domain-invalid',
            'URL already short, try again later'
          )
        );
      }
    }

    // Send error if custom code is less than 4 characters long
    if (customCode.length < 4) {
      if (stagedLink.useFallback === false) {
        res.send(
          constructError('custom-code-invalid', 'Custom code too short')
        );
        return;
      }

      stagedLink.custom = undefined;
    }

    // Send error if custom code is more than 32 characters long
    if (customCode.length > 32) {
      if (stagedLink.useFallback === false) {
        res.send(constructError('custom-code-invalid', 'Custom code too long'));
        return;
      }

      stagedLink.custom = undefined;
    }

    // Send error if two of the same symbols are next to each other
    if (/(--)|(__)/.test(customCode)) {
      if (stagedLink.useFallback === false) {
        res.send(
          constructError(
            'custom-code-invalid',
            'Custom code has two of the same symbols together'
          )
        );
        return;
      }
      stagedLink.custom = undefined;
    }

    // Send error if custom code contains restricted characters
    if (!customCodeRegex.test(customCode)) {
      if (stagedLink.useFallback === false) {
        res.send(
          constructError(
            'custom-code-invalid',
            'Custom code does not only contain lowercase letters, numbers and - or _ symbols.'
          )
        );
        return;
      }

      stagedLink.custom = undefined;
    }

    checkCostomDuplicates.push(
      new Promise(async (resolve, reject) => {
        const codeTaken = await GoTiny.exists({ code: stagedLink.custom });

        if (codeTaken) {
          if (stagedLink.useFallback === false) {
            reject(stagedLink.custom);
          }

          stagedLink.custom = undefined;
        }

        resolve(null);
      })
    );
  });

  try {
    await Promise.all(checkCostomDuplicates);
  } catch (custom) {
    res.send(
      constructError('custom-code-taken', `Code already taken: ${custom}`)
    );
    return;
  }

  const entries = filteredStaged.map(
    (entry) =>
      new GoTiny<GoTinyObject>({
        long: entry.long,
        code: entry.custom || getTiny(6),
        customCode: !!entry.custom,
        lastActive: null,
        createdAt: Date.now(),
        visited: 0,
      })
  );

  GoTiny.insertMany(entries, (error, docs) => {
    if (error) {
      console.log(error);
      return;
    }

    const responseArray = docs.map((doc) => ({
      long: doc.long,
      code: doc.code,
    }));

    res.send(responseArray);
  });
};
