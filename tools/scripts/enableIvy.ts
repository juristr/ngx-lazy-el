#!/usr/bin/env node
'use strict';
import * as fs from 'fs';
import * as path from 'path';

function baseDir(...dirs: string[]): string {
  return path.resolve(__dirname, '../..', ...dirs);
}

async function main(enableIvy: string) {
  const doEnable = enableIvy === 'true' ? true : false;

  console.log(`Enabling Ivy: ${doEnable}`);

  const tsconfigPath = baseDir('apps/demoapp/tsconfig.app.json');
  const angularConfigPath = baseDir('angular.json');

  let tsconfigApp = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
  let angularJson = JSON.parse(fs.readFileSync(angularConfigPath, 'utf8'));

  if (doEnable) {
    tsconfigApp['angularCompilerOptions'] = {
      enableIvy: true
    };

    angularJson.projects.demoapp.architect.build.options.aot = true;
  } else {
    delete tsconfigApp['angularCompilerOptions'];
    angularJson.projects.demoapp.architect.build.options.aot = false;
  }

  fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfigApp, null, 1));
  fs.writeFileSync(angularConfigPath, JSON.stringify(angularJson, null, 1));
}

main(process.argv[2]).catch(err => {
  console.error(err);
  process.exit(1);
});
