import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  makeCacheableSignalKeyStore,
} from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import pino from 'pino'

const logger = pino({ level: process.env.LOG_LEVEL || 'info' })

export async function createBot(authDir = './auth') {
  const { state, saveCreds } = await useMultiFileAuthState(authDir)

  const sock = makeWASocket({
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
    printQRInTerminal: true,
    logger: logger.child({ component: 'baileys' }),
  })

  sock.ev.on('creds.update', saveCreds)

  await waitForConnection(sock)
  return sock
}

function waitForConnection(sock) {
  return new Promise((resolve, reject) => {
    sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
      if (qr) {
        logger.info('Scan the QR code above to connect')
      }

      if (connection === 'open') {
        logger.info('WhatsApp connected')
        resolve()
      }

      if (connection === 'close') {
        const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode
        if (statusCode === DisconnectReason.loggedOut) {
          reject(new Error('Logged out — delete auth/ folder and re-scan QR'))
        } else {
          reject(new Error(`Connection closed: ${statusCode}`))
        }
      }
    })
  })
}
