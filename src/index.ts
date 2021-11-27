import { Command, flags } from '@oclif/command'
import * as path from 'path'

import FileManager from './services/file-manager.service'

import { DEFAULTS } from './constants'

class EnvSaver extends Command {
  static description = 'bulk save env files';

  static flags = {
    version: flags.version({
      char: 'v',
    }),
    help: flags.help({
      char: 'h',
    }),
    verbose: flags.boolean({
      char: 'V',
      description: 'log additional debug output',
    }),
    depth: flags.integer({
      char: 'D',
      default: 1,
      description: 'file lookup depth',
    }),
  };

  static args = [
    {
      name: 'origin',
      required: true,
      description: 'Origin directory',
    },
    {
      name: 'dest',
      default: null,
      description: 'Destination directory',
    },
  ];

  async run() {
    const { args, flags } = this.parse(EnvSaver)
    const originDir = path.normalize(args.origin)
    const destDir = path.normalize(args.dest ?? path.join(originDir, DEFAULTS.defaultDestDirName))

    const fileManager = new FileManager(originDir, destDir, { verbose: flags.verbose })
    await fileManager.findAndSaveEnvFiles({ depth: flags.depth })
  }
}

export = EnvSaver;
