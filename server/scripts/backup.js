const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const { spawn } = require('node:child_process');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
async function run(binary, args) {
    await new Promise((resolve, reject) => {
        const child = spawn(binary, args, { stdio: ['ignore', 'ignore', 'ignore'] });
        child.on('error', reject); child.on('exit', code => code === 0 ? resolve() : reject(new Error(`${binary} failed (exit ${code})`)));
    });
}
(async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI is required');
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'rizqara-backup-'));
    try {
        const config = path.join(directory, 'config.yml');
        await fs.writeFile(config, JSON.stringify({ uri }), { mode: 0o600 });
        if (process.argv[2] === 'restore') {
            const archive = path.resolve(process.argv[3] || '');
            const database = process.argv[4];
            if (!/^rizqara_restore_[a-zA-Z0-9_]+$/.test(database || '')) throw new Error('Restore only into a new database named rizqara_restore_<name>');
            const mongoose = require('mongoose');
            await mongoose.connect(uri);
            const source = mongoose.connection.name;
            if (!source || source === 'test') throw new Error('Backup URI must include an explicit database name');
            const exists = (await mongoose.connection.getClient().db().admin().listDatabases()).databases.some(item => item.name === database);
            await mongoose.disconnect();
            if (exists) throw new Error('Restore destination already exists; choose a new name');
            await run('mongorestore', ['--config', config, '--archive=' + archive, '--gzip', '--nsFrom=' + source + '.*', '--nsTo=' + database + '.*']);
            console.log(`Restored into ${database}. Original data was preserved.`);
        } else {
            const target = path.resolve(__dirname, '../../backups'); await fs.mkdir(target, { recursive: true, mode: 0o700 });
            const file = path.join(target, `rizqara-${new Date().toISOString().replace(/[:.]/g, '-')}.archive.gz`);
            await run('mongodump', ['--config', config, '--archive=' + file, '--gzip']); await fs.chmod(file, 0o600);
            console.log(file);
            console.log('Back up PRIVATE_UPLOAD_DIR separately; CV files are not included in the database archive.');
        }
    } finally { await fs.rm(directory, { recursive: true, force: true }); }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
