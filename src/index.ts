import * as glob from 'glob'
import * as parseArgs from 'minimist'

import {transform} from './transformer'

const argv = parseArgs(process.argv.slice(2))

argv._.forEach((path) => {
  glob(path, {}, (err, filepaths) => {
    if (err != null) {
      console.error(err)
      return
    }
    filepaths.forEach((filepath) => {
      transform(filepath)
    })
  })
})
