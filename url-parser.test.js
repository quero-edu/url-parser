const parse = require('./url-parser');

test('Detect protocol', () => {
  expect(parse('http://site.com').protocol).toBe('http');
  expect(parse('https://site.com').protocol).toBe('https');
  expect(parse('ftp://site.com').protocol).toBe('ftp');
});

test('Detect aut', () => {
  expect(parse('http://user:pass@site.com').auth).toEqual({ username: 'user', password: 'pass' });
  expect(parse('http://j%C3%A3o:man%C3%89%25@site.com').auth).toEqual({ username: 'jão', password: 'manÉ%' });
});

test('Detect port', () => {
  expect(parse('http://site.com:8000').port).toBe('8000');
});

test('Detect hostname', () => {
  expect(parse('http://site.com').hostname).toBe('site.com');
  expect(parse('http://www.site.com').hostname).toBe('www.site.com');
  expect(parse('http://foo.bar.site.com').hostname).toBe('foo.bar.site.com');
});

test('Detect path', () => {
  expect(parse('http://site.com').path).toBe('/');
  expect(parse('http://site.com/').path).toBe('/');
  expect(parse('http://site.com/spam').path).toBe('/spam');
  expect(parse('http://site.com/spam/egg').path).toBe('/spam/egg');
  expect(parse('http://site.com/spam/egg/').path).toBe('/spam/egg');
});

test('Detect hash', () => {
  expect(parse('http://site.com').hash).toBe('');
  expect(parse('http://site.com#').hash).toBe('');
  expect(parse('http://site.com#a-hash').hash).toBe('a-hash');
});

test('Detect query string', () => {
  expect(parse('http://site.com').query).toEqual({});
  expect(parse('http://site.com?').query).toEqual({});
  expect(parse('http://site.com?foo=bar').query).toEqual({ foo: 'bar' });
  expect(parse('http://site.com?p%C3%A1=p%C3%A9').query).toEqual({ pá: 'pé' });
  expect(parse('http://site.com?foo=bar&baz=qux').query).toEqual({ foo: 'bar', baz: 'qux' });
  expect(parse('http://site.com?name=jos%C3%A9').query).toEqual({ name: 'josé' });
  expect(parse('http://site.com?foo=one&foo=two&foo=three').query).toEqual({
    foo: ['one', 'two', 'three']
  });
});

test('Detects everything at the same time', () => {
  expect(parse('sftp://poxa:vida@a.b.c.site.com:3000/yay/wow/?spam=egg&spam=r%C3%A3&pat%C3%AA=cream#something')).toEqual({
    protocol: 'sftp',
    auth: { username: 'poxa', password: 'vida' },
    hostname: 'a.b.c.site.com',
    port: '3000',
    path: '/yay/wow',
    hash: 'something',
    query: { spam: ['egg', 'rã'], patê: 'cream' },
  });
})