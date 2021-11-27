export const DEFAULTS = {
  defaultDestDirName: 'env-saver-artifacts',
}

export const REGEX = {
  envFile: /\.env(\..+)?/, // Matches string parts that start with ".env"
  envFileStrict: /^\.env(\..+)?/, // Matches only strings starting with ".env"
}
