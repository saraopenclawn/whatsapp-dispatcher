import 'dotenv/config'
import { createBot } from './bot.js'
import { loadDispatches } from './config.js'
import { scheduleDispatches, stopAll } from './scheduler.js'

const CONFIG_PATH = process.env.CONFIG_PATH || './config/dispatches.json'
const AUTH_DIR = process.env.AUTH_DIR || './auth'

async function main() {
  const dispatches = loadDispatches(CONFIG_PATH)
  const sock = await createBot(AUTH_DIR)
  const tasks = scheduleDispatches(sock, dispatches)

  process.on('SIGINT', () => {
    stopAll(tasks)
    process.exit(0)
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
