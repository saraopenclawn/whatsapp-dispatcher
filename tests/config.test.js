import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import { writeFileSync, mkdirSync, rmSync } from 'fs'
import { loadDispatches } from '../src/config.js'

const TMP = '/tmp/wa-dispatcher-test'

beforeAll(() => mkdirSync(TMP, { recursive: true }))
afterAll(() => rmSync(TMP, { recursive: true, force: true }))

function writeConfig(obj) {
  const path = `${TMP}/dispatches.json`
  writeFileSync(path, JSON.stringify(obj))
  return path
}

describe('loadDispatches', () => {
  it('loads a valid poll config', () => {
    const path = writeConfig({
      dispatches: [
        {
          id: 'test-poll',
          type: 'poll',
          schedule: '0 10 * * 1',
          target: '123@g.us',
          content: { question: 'How are you?', options: ['Good', 'Bad'] },
        },
      ],
    })
    const dispatches = loadDispatches(path)
    expect(dispatches).toHaveLength(1)
    expect(dispatches[0].id).toBe('test-poll')
  })

  it('loads a valid message config', () => {
    const path = writeConfig({
      dispatches: [
        {
          id: 'test-msg',
          type: 'message',
          schedule: '0 9 * * 2',
          target: '123@g.us',
          content: { text: 'Hello!' },
        },
      ],
    })
    const dispatches = loadDispatches(path)
    expect(dispatches[0].type).toBe('message')
  })

  it('throws if dispatches array is missing', () => {
    const path = writeConfig({})
    expect(() => loadDispatches(path)).toThrow('"dispatches" array')
  })

  it('throws if poll has fewer than 2 options', () => {
    const path = writeConfig({
      dispatches: [
        {
          id: 'bad-poll',
          type: 'poll',
          schedule: '0 10 * * 1',
          target: '123@g.us',
          content: { question: 'Q?', options: ['Only one'] },
        },
      ],
    })
    expect(() => loadDispatches(path)).toThrow('at least 2 options')
  })

  it('throws if message has no text', () => {
    const path = writeConfig({
      dispatches: [
        {
          id: 'bad-msg',
          type: 'message',
          schedule: '0 10 * * 1',
          target: '123@g.us',
          content: {},
        },
      ],
    })
    expect(() => loadDispatches(path)).toThrow('missing content.text')
  })

  it('throws if required field is missing', () => {
    const path = writeConfig({
      dispatches: [{ id: 'no-type', schedule: '0 10 * * 1', target: '123@g.us', content: {} }],
    })
    expect(() => loadDispatches(path)).toThrow('missing "type"')
  })
})
