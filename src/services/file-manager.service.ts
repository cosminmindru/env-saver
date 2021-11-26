import { promises as fs } from 'fs'
import * as path from 'path'
import { REGEX } from "../constants"

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
      if (dirEntry.isFile() && REGEX.envFileStrict.test(dirEntry.name)) {
        envFiles.push(path.join(dir, dirEntry.name))
      }
    }

    return envFiles
  }

  async saveEnvFiles(originEnvFiles: string[]): Promise<void> {
    for (const originEnvFilePath of originEnvFiles) {
      const destEnvFile = originEnvFilePath.replace(`${this.originDir}${path.sep}`, "") // File path only (without dest dir)
      const destEnvFilePath = path.join(this.destDir, destEnvFile); // Dest file full path including the file
      const destEnvFileDirOnly = destEnvFilePath.replace(REGEX.envFile, ""); // Dest file path without the file

      // Create the dest directory if it doesn't exist
      try {
        await fs.access(destEnvFileDirOnly)
      } catch (error) {
        await fs.mkdir(destEnvFileDirOnly, { recursive: true })
      }

      await fs.copyFile(originEnvFilePath, destEnvFilePath)
    }
  }
}
