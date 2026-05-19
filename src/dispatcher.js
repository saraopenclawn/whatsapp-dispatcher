import pino from 'pino'

const logger = pino({ level: process.env.LOG_LEVEL || 'info' })

export async function dispatch(sock, entry) {
  const { id, type, target, content } = entry
  logger.info({ id, type, target }, 'Dispatching')

  switch (type) {
    case 'poll':
      return sendPoll(sock, target, content)
    case 'message':
      return sendMessage(sock, target, content)
    default:
      throw new Error(`Unknown dispatch type: ${type}`)
  }
}

async function sendPoll(sock, target, content) {
  const { question, options, selectableCount = 1 } = content
  await sock.sendMessage(target, {
    poll: {
      name: question,
      values: options,
      selectableCount,
    },
  })
}

async function sendMessage(sock, target, content) {
  await sock.sendMessage(target, { text: content.text })
}
