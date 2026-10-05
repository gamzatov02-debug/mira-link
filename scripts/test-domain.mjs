import {build} from 'esbuild';
import {mkdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
await mkdir('.test-runtime',{recursive:true});
await build({entryPoints:['tests/domain.test.ts'],bundle:true,platform:'node',format:'esm',outfile:'.test-runtime/domain.test.mjs'});
const result=spawnSync(process.execPath,['--test','.test-runtime/domain.test.mjs'],{stdio:'inherit'});
process.exit(result.status??1);
