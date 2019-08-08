# URL Parser

Parses URL in the following format: `protocol://user:pass@host:1000/some/path?query=string#hash`

```js
const parse = require('url-parser');

parse('mysql://jos%C3%A9:maria@database.com:3306/some/path?option=value#spam')
// {
//   protocol: 'mysql',
//   auth: { username: 'josé', password: 'maria' },
//   hostname: 'database.com',
//   port: '3306',
//   path: '/some/path',
//   query: { option: 'value' },
//   hash: 'spam'
// }
```
