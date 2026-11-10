const { randomBytes, scryptSync } = require('node:crypto');
// Read from stdin to avoid placing passwords in command arguments or shell history.
let password = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => { password += chunk; });
process.stdin.on('end', () => {
    password = password.replace(/[\r\n]+$/, '');
    if (password.length < 14 || password.length > 256) { console.error('Use a password between 14 and 256 characters.'); process.exitCode = 1; return; }
    const salt = randomBytes(16).toString('hex');
    console.log(`${salt}:${scryptSync(password, salt, 64).toString('hex')}`);
});
