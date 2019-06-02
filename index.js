const Transport = require('winston-transport');
const Database = require('better-sqlite3');

// Inherit from `winston-transport` so you can take advantage
// of the base functionality and `.exceptions.handle()`.
//
module.exports = class Sqlite3 extends Transport {
    constructor(options) {
        super(options);
        
        //this.name = 'sqlite';
        if (!options.hasOwnProperty('db')) {
            throw new Error('"db" is required');
        }
        else {
            this.db = new Database(options.db);
        }
        
        this.params = options.params || ['level', 'message'];

        this.columnsInsert = this.params.map(el => { return el });
        this.columnsBind = this.columnsInsert.map(el => { return '?' });
        this.insertStmt = `INSERT INTO log (${this.columnsInsert.join(', ')}) VALUES (${this.columnsBind.join(', ')})`;

        this.columnsTyped = this.params.map(p => { return p + ' TEXT'});
        this.columnsTyped.unshift("id INTEGER PRIMARY KEY", "timestamp INTEGER DEFAULT (strftime('%s','now'))");
        this.table = `CREATE TABLE IF NOT EXISTS log (${this.columnsTyped.join(', ')})`;

        this.db.prepare(this.table).run();
        this.insert = this.db.prepare(this.insertStmt);
    }

    log(info, callback) {
        const params = Object.values(info);

        setImmediate(() => {
            this.emit('logged', debug);
        });

        this.insert.run(params);

        // Perform the writing to the remote service
        callback();
    }

};