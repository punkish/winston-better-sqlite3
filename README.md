# winston-better-sqlite3

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
            // the columns in the sqlite3 table
            params: ['level', 'resource', 'query', 'message']
        })
    ]
});
```

