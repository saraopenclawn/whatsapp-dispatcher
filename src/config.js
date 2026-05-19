import { readFileSync } from 'fs'
import { resolve } from 'path'
import 'dotenv/config'

export function loadDispatches(configPath = './config/dispatches.json') {
  const full = resolve(configPath)
  const raw = readFileSync(full, 'utf-8')
  const parsed = JSON.parse(raw)

  if (!Array.isArray(parsed.dispatches)) {
    throw new Error('Config must have a "dispatches" array')
  }

  for (const d of parsed.dispatches) {
    validateDispatch(d)
  }

  return parsed.dispatches
}

function validateDispatch(d) {
  if (!d.id) throw new Error(`Dispatch missing "id"`)
  if (!d.type) throw new Error(`Dispatch "${d.id}" missing "type"`)
  if (!d.schedule) throw new Error(`Dispatch "${d.id}" missing "schedule"`)
  if (!d.target) throw new Error(`Dispatch "${d.id}" missing "target"`)
  if (!d.content) throw new Error(`Dispatch "${d.id}" missing "content"`)

  if (d.type === 'poll') {
    if (!d.content.question) throw new Error(`Poll "${d.id}" missing content.question`)
    if (!Array.isArray(d.content.options) || d.content.options.length < 2) {
      throw new Error(`Poll "${d.id}" needs at least 2 options`)
    }
  }

  if (d.type === 'message') {
    if (!d.content.text) throw new Error(`Message "${d.id}" missing content.text`)
  }
}
