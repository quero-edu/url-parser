const URL_REGEX = /^(\w+?):\/\/([^@:]*:[^@]*@)?([^#\?\/:]*)(:\d+)?([^#\?]*)?([^#]*)?(#.*)?$/;

module.exports = function(url) {
  const result = url.match(URL_REGEX);

  return {
    protocol: result[1],
    auth: extractUserAndPass(result[2] || ''),
    hostname: result[3],
    port: (result[4] || '').substring(1),
    path: removeTrailingSlash(result[5] || '/'),
    query: explodeQuery((result[6] || '').substring(1)),
    hash: (result[7] || '').substring(1),
  };
}

function explodeQuery(query) {
  if (query === '') return {};

  const res = {};
  const queries = query.split('&');

  for (let i = 0; i < queries.length; i++) {
    const [k, v] = queries[i].split('=');
    const decodedKey = decodeURIComponent(k);
    const decodedVal = decodeURIComponent(v);

    if (res.hasOwnProperty(decodedKey)) {
      if (Array.isArray(res[decodedKey])) {
        res[decodedKey].push(decodedVal);
      } else {
        res[decodedKey] = [res[decodedKey], decodedVal];
      }
    } else {
      res[decodedKey] = decodedVal;
    }
  }

  return res;
}

function removeTrailingSlash(path) {
  if (path === '/' || !/^.+\/$/.test(path)) {
    return path;
  }

  return path.substring(0, path.length - 1);
}

function extractUserAndPass(authString) {
  if (!authString) return {};
  const [username, password] = removeTrailingAt(authString).split(':').map(decodeURIComponent)
  return { username, password }
}

function removeTrailingAt(string) {
  if (string[string.length - 1] == '@') return string.substring(0, string.length - 1)
  return string;
}
