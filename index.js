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
        
        this.db = new Database(options.db);
        this.params = options.params || ['level', 'message'];
        const table = options.table || 'log';
        
        // the 'log' table always has 'id' and 'timestamp'
        const cols = [
            "id INTEGER PRIMARY KEY", 
            "timestamp INTEGER DEFAULT (strftime('%s','now'))"
        ];
        
        // add user-provided columns to the table and create the table
        this.params.forEach(p => cols.push(`${p} TEXT`));
        this.db.prepare(`CREATE TABLE IF NOT EXISTS ${table} (${cols.join(', ')})`).run();

        // prepare the insert statement to be used while logging
        this.insert = this.db.prepare(`INSERT INTO ${table} (${this.params.join(', ')}) VALUES (${this.params.map(p => `@${p}`).join(', ')})`);
    }

    log(info, callback) {
        const logparams = Object.assign({}, info);

        setImmediate(() => this.emit('logged', info));

        // Perform the writing to the remote service
        this.insert.run(logparams);

        callback();
    }
};