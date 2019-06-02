# winston-better-sqlite3  
*aka wbs*

`sqite3` Transport for [Winson](https://zenodo.org)

## Install

```bash
$ npm install winston-better-sqlite3
```
## Use

```js
const winston = require('winston');

const wbs = require('winston-better-sqlite3');
const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    defaultMeta: { resource: 'renew' },
    transports: [
        new wbs({

            // 'db' is required, and should include the full 
            // path to the sqlite3 database file on the disk
            db: '<name of sqlite3 database file>',

            // A list of the log params to log. Defaults to 
            // ['level, 'message']. These params are used as 
            // columns in the sqlite3 table
            params: ['level', 'resource', 'query', 'message']
        })
    ]
});
```
There are a couple of `sqlite3` transports for Winston out there, but this one is a bit different. For one, it uses Josuha Wise's most excellent [better-sqlite3](https://www.npmjs.com/package/better-sqlite3) package. Secondly, in my biased opinion, `wbs` is also better because it uses no ORMs or any such middleware. It is just a plain, no-nonsense transport that writes the logs to a `sqlite3` database. The database creates a table called `log` with four columns by default

```sql
CREATE TABLE IF NOT EXISTS log (
    id INTEGER PRIMARY KEY,
    timestamp INTEGER DEFAULT (strftime('%s','now')),
    level TEXT,
    message TEXT
);
```

`id` and `timestamp` columns are always provided. `level` and `message` can be replaced with whatever columns the user wants to use to track logging info. For example, I use `level`, `resource`, `query` and `message` in one of my projects (as shown in the example above). All logging params are stored in columns of datatype `TEXT`.