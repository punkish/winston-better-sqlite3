const Transport = require('winston-transport');
const Database = require('better-sqlite3');

// Inherit from `winston-transport` so you can take advantage
// of the base functionality and `.exceptions.handle()`.
//
module.exports = class Sqlite3 extends Transport {
    constructor(options) {
        super(options);
        
        if (!options.hasOwnProperty('db')) {
            throw new Error('"db" is required');
        }
        else {
            this.db = new Database(options.db);
        }
        
        this.params = options.params || ['level', 'message'];
        this.tablename = options.table || 'log';

        this.insertStmt = `INSERT INTO ` + this.tablename + ` (${this.params.join(', ')}) VALUES (${this.params.map(e => '?').join(', ')})`;
        
        this.columnsTyped = this.params.map(p => { return p + ' TEXT'});
        this.columnsTyped.unshift("id INTEGER PRIMARY KEY", "timestamp INTEGER DEFAULT (strftime('%s','now'))");
        this.table = `CREATE TABLE IF NOT EXISTS ` + this.tablename + ` (${this.columnsTyped.join(', ')})`;

        this.db.prepare(this.table).run();
        this.insert = this.db.prepare(this.insertStmt);
    }

    log(info, callback) {
        const logparams = Object.assign({}, info);

        let params = [];
        this.params.forEach(el => {
            params.push(logparams[ el ]);
        });
        
        setImmediate(() => {
            this.emit('logged', info);
        });

        this.insert.run(params);

        // Perform the writing to the remote service
        callback();
    }

};
