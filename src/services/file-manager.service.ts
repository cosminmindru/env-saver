import { promises as fs } from 'fs'
import * as path from 'path'
import cli from 'cli-ux'

const junkRe = /^\./ // TODO: Make this a y/n param
const dotEnv = '.env'

type FileManagerOpts = {
}

type FindEnvFilesParams = {
  depth: number
}

export default class FileManager {
  private originDir = ''
  private destDir = ''

  constructor(originDir: string, destDir: string, opts?: FileManagerOpts) {
    this.originDir = originDir
    this.destDir = destDir
  }

  async findEnvFiles({ depth }: FindEnvFilesParams = { depth: 2 }): Promise<string[]> {
    return this.recursiveEnvFileLookup(this.originDir, depth);
  }

  /**
   * Recursively find all env files down a specified level
   */
  private async recursiveEnvFileLookup(dir: string, depth: number): Promise<string[]> {
    // TODO: Clean this up
    const envFiles = []

    const dirEntries = await fs.readdir(dir, { withFileTypes: true })

    for (const dirEntry of dirEntries) {
      // Handle subdirectories
      if (depth >= 1 && dirEntry.isDirectory()) {
        envFiles.push(...await this.recursiveEnvFileLookup(path.join(dir, dirEntry.name), depth - 1))
      }

      // Handle files
      if (dirEntry.isFile() && dirEntry.name.startsWith('.env')) {
        envFiles.push(path.join(dir, dirEntry.name))
      }
    }

    return envFiles
  }

  async saveEnvFiles(envFiles: string[]): Promise<void> {
    for (const envFile of envFiles) {
      // Need to add in the part that checks if the dest folder exists
      // and make it create it if it doesn't exist, because atm this fails to run properly
      const strippedEnvFile = envFile.replace(`${this.originDir}${path.sep}`, "")
      await fs.copyFile(envFile, path.join(this.destDir, strippedEnvFile))
    }
  }

  /** OLD SCRIPT COPY - TO BE DELETED */
  async copyFromOriginToDest(): Promise<void> {
    // TODO: Refactor this into multiple functions such as:
    // - one that checks that the origin and destination folders exist
    // - another that looks for env files and returns them
    // - another that copies the files and so on
    const hp = await cli.prompt('hello', { type: 'single' })
    console.log(`hello ${hp}`)

    try {
      // Get the folders as an array
      const allFolders = await fs.readdir(this.originDir)
      const folders = allFolders.filter((folder: string) => !junkRe.test(folder))
      console.log(folders)


      for (const folder of folders) {
        const allFiles = await fs.readdir(`${this.originDir}/${folder}`)
        const envFile = allFiles.find((file: string) => file === '.env')

        if (envFile) {
          const destDirFull = `${this.destDir}/${folder}`

          try {
            await fs.access(destDirFull)
          } catch (error) {
            await fs.mkdir(destDirFull, { recursive: true })
          }

          await fs.copyFile(
            `${this.originDir}/${folder}/${dotEnv}`,
            `${this.destDir}/${folder}/${dotEnv}`,
          )
        }
      }
    } catch (e) {
      // Catch anything bad that happens
      console.error("We've thrown! Whoops!", e)
    }
  }
  /** OLD SCRIPT COPY - TO BE DELETED */
}
