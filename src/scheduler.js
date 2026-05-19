import cron from 'node-cron'
import pino from 'pino'
import { dispatch } from './dispatcher.js'

const logger = pino({ level: process.env.LOG_LEVEL || 'info' })

export function scheduleDispatches(sock, dispatches) {
  const tasks = []

  for (const entry of dispatches) {
    if (!cron.validate(entry.schedule)) {
      throw new Error(`Invalid cron expression for dispatch "${entry.id}": ${entry.schedule}`)
    }

    const task = cron.schedule(entry.schedule, async () => {
      try {
        await dispatch(sock, entry)
      } catch (err) {
        logger.error({ id: entry.id, err }, 'Dispatch failed')
      }
    })

    tasks.push({ id: entry.id, task })
    logger.info({ id: entry.id, schedule: entry.schedule }, 'Scheduled')
  }

  return tasks
}

export function stopAll(tasks) {
  for (const { task } of tasks) {
    task.stop()
  }
}
