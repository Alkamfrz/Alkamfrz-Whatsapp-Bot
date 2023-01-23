import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

const configPath = join(__dirname, '..', '..', 'config.json')
const configExists = existsSync(configPath)

if (!configExists) {
    throw new Error('config.json not found!')
}

const config = JSON.parse(readFileSync(configPath, 'utf-8'))

export default config