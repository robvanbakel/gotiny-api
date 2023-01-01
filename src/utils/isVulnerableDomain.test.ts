import assert from 'node:assert/strict'; // Using "node:" preffix

import { isVulnerableDomain } from './isVulnerableDomain';

// #IsVulnerableDomain tests/suite.

{
  // it should be able to returns truthy when invalid URL/domain are provided.
  assert.deepStrictEqual(isVulnerableDomain('https://gotiny.cc'), true);

  // with "www" prefix
  assert.deepStrictEqual(isVulnerableDomain('https://www.gotiny.cc'), true);

  assert.deepStrictEqual(
    isVulnerableDomain('https://www.gotiny.cc/api/{{any_code}}'),
    true
  );
}

{
  // it should be able to returns truthy when bad URL format is provided.
  assert.deepStrictEqual(isVulnerableDomain('bad_url_format'), true);
  assert.deepStrictEqual(isVulnerableDomain(''), true);
  assert.deepStrictEqual(isVulnerableDomain(null as any), true);
  assert.deepStrictEqual(isVulnerableDomain(undefined as any), true);
}

{
  // it should be able to returns falsy when valid URL is provided.
  assert.deepStrictEqual(
    isVulnerableDomain('https://google.com/?q=Node.js'),
    false
  );
  assert.deepStrictEqual(
    isVulnerableDomain('https://api.gihub.com/users/{{any_user}}'),
    false
  );
}
