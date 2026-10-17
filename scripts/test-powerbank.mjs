import {build} from 'esbuild';
import {mkdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
await mkdir('.test-runtime',{recursive:true});
await build({entryPoints:['tests/powerbank/energo.test.ts'],bundle:true,platform:'node',format:'esm',outfile:'.test-runtime/energo.test.mjs'});
const result=spawnSync(process.execPath,['--test','.test-runtime/energo.test.mjs'],{stdio:'inherit'});
process.exit(result.status??1);
