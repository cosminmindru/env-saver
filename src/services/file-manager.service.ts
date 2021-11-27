import { promises as fs } from 'fs'
import * as path from 'path'
import * as winston from 'winston'

import { REGEX } from '../constants'

type EnvFilePath = string

type FileManagerOpts = {
  verbose?: boolean;
}

type FindAndSaveEnvFilesParams = {
  depth: number;
}

type RecursiveEnvFileLookupOpts = {
  depth: number;
}

export default class FileManager {
  private logger: winston.Logger
  private originDir: string
  private destDir: string
  private envFiles: string[]
  private verbose: boolean;

  constructor(originDir: string, destDir: string, opts?: FileManagerOpts) {
    this.originDir = originDir
    this.destDir = destDir
    this.envFiles = []
    this.verbose = opts?.verbose ?? false
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.Console({
          level: this.verbose ? 'debug' : 'info',
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({ format: 'HH:mm:ss' }),
            winston.format.printf(info => this.verbose ? `${info.timestamp} ${info.message}` : `${info.message}`),
          ),
        }),
      ],
    })
  }

  get envFilesCount() {
    return this.envFiles.length
  }

  async findAndSaveEnvFiles({ depth }: FindAndSaveEnvFilesParams = { depth: 2 }): Promise<void> {
    this.envFiles = await this.recursiveEnvFileLookup(this.originDir, { depth })
    this.logger.info(`✔️ Found ${this.envFilesCount} env files inside "${this.originDir}"`)

    await this.saveEnvFiles()
    this.logger.info(`🎉 Successfully saved ${this.envFilesCount} env files inside "${this.destDir}"`)
  }

  private async recursiveEnvFileLookup(dir: string, opts: RecursiveEnvFileLookupOpts): Promise<EnvFilePath[]> {
    const envFiles: EnvFilePath[] = []
    const dirEntries = await fs.readdir(dir, { withFileTypes: true })

    for (const dirEntry of dirEntries) {
      // Handle subdirectories
      if (opts.depth >= 1 && dirEntry.isDirectory()) {
        const subDirPath = path.join(dir, dirEntry.name)
        const subDirEnvFiles = await this.recursiveEnvFileLookup(subDirPath, { depth: opts.depth - 1 })

        envFiles.push(...subDirEnvFiles)
      }

      // Handle files
      if (dirEntry.isFile() && REGEX.envFileStrict.test(dirEntry.name)) {
        envFiles.push(path.join(dir, dirEntry.name))
      }
    }

    return envFiles
  }

  async saveEnvFiles(): Promise<EnvFilePath[]> {
    const destEnvFilePaths: EnvFilePath[] = []

    for (const originEnvFilePath of this.envFiles) {
      const destEnvFile = originEnvFilePath.replace(`${this.originDir}${path.sep}`, '') // File path only (without dest dir)
      const destEnvFilePath = path.join(this.destDir, destEnvFile) // Dest file full path including the file
      const destEnvFileDirOnly = destEnvFilePath.replace(REGEX.envFile, '') // Dest file path without the file

      // Create the dest directory if it doesn't exist
      try {
        await fs.access(destEnvFileDirOnly)
      } catch (error) {
        await fs.mkdir(destEnvFileDirOnly, { recursive: true })
        this.logger.debug(`ℹ️ Destination directory "${destEnvFileDirOnly}" successfully created`)
      }

      await fs.copyFile(originEnvFilePath, destEnvFilePath)
      this.logger.debug(`ℹ️ Env file "${destEnvFile}" successfully saved`)
      destEnvFilePaths.push(destEnvFilePath)
    }

    return destEnvFilePaths
  }
}
