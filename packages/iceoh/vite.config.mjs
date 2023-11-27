import { resolve } from "path";
import { defineConfig } from "vite";
import fs from 'fs'

const packageJsonPath = resolve(__dirname, 'package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath).toString())

function writeExports() {
  return {
    name: 'writeExports',
    closeBundle() {
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
    }
  }
}

export default defineConfig({
  plugins: [writeExports()],
  build: {
    lib: {
      entry: ['index.ts', 'IsoTilemap.ts', 'Tilemap.ts', 'utils.ts'].map(f => resolve(__dirname, `src/${f}`)),
      name: 'Iceoh',
      // the proper extensions will be added
      fileName: (module, name) => {
        const outPath = `${name}${module === 'es' ? '.mjs' : '.umd.js'}`
        const exp = name.startsWith('index') ? '.' : `./${name}`
        if (!packageJson.exports[exp]) packageJson.exports[exp] = {}
        packageJson.exports[exp][module === 'es' ? 'import' : 'require'] = `./dist/${outPath}`
        packageJson.exports[exp]['types'] = `./dist/${name}.d.ts`
        return outPath
      }
    },
  },
});
