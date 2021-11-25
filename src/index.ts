import { Command, flags } from '@oclif/command'
import FileManager from './services/file-manager.service'
import * as path from "path"

class EnvSaver extends Command {
  static description = 'describe the command here';

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: 'n', description: 'name to print' }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: 'f' }),
  };

  static args = [
    {
      name: 'origin',
      required: true,
      description: "Origin directory"
    },
    {
      name: 'dest',
      default: null,
      description: "Destination directory"
    },
  ];

  async run() {
    const { args, flags } = this.parse(EnvSaver)
    const originDir = path.normalize(args.origin);
    const destDir = path.normalize(args.dest ?? path.join(originDir, "env-saver-artifacts"));

    const fm = new FileManager(originDir, destDir);
    const envFiles = await fm.findEnvFiles({ depth: 1 });
    console.log(await fm.saveEnvFiles(envFiles))
  }
}

export = EnvSaver;
