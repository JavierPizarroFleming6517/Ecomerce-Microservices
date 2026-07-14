import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const required = ['NEO4J_URI', 'NEO4J_USERNAME', 'NEO4J_PASSWORD'];
const missing = required.filter((name) => !process.env[name]);

if (missing.length > 0) {
  throw new Error(`Missing environment variables: ${missing.join(', ')}`);
}

const file = process.argv[2];

if (!file) {
  throw new Error('A Cypher file path is required');
}

const hasLocalCypherShell =
  spawnSync('cypher-shell', ['--version'], {
    shell: process.platform === 'win32',
  }).status === 0;

// Neo4j only ships `cypher-shell` inside its own image, so when running the
// database in Docker (the default local setup) there is no host binary to
// call. Fall back to executing it inside the `neo4j` compose service instead
// of requiring a separate Neo4j installation on the host.
const result = hasLocalCypherShell
  ? spawnSync(
      'cypher-shell',
      [
        '--address',
        process.env.NEO4J_URI,
        '--username',
        process.env.NEO4J_USERNAME,
        '--password',
        process.env.NEO4J_PASSWORD,
        '--database',
        process.env.NEO4J_DATABASE ?? 'neo4j',
        '--file',
        resolve(file),
      ],
      { stdio: 'inherit', shell: process.platform === 'win32' },
    )
  : spawnSync(
      'docker',
      [
        'compose',
        'exec',
        '-T',
        'neo4j',
        'cypher-shell',
        '--username',
        process.env.NEO4J_USERNAME,
        '--password',
        process.env.NEO4J_PASSWORD,
        '--database',
        process.env.NEO4J_DATABASE ?? 'neo4j',
      ],
      {
        input: readFileSync(resolve(file)),
        stdio: ['pipe', 'inherit', 'inherit'],
        shell: process.platform === 'win32',
      },
    );

if (result.error) {
  throw result.error;
}

process.exitCode = result.status ?? 1;
