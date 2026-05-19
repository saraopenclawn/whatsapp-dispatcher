import { describe, it, expect } from '@jest/globals'
import { scheduleDispatches, stopAll } from '../src/scheduler.js'

const mockSock = {
  sendMessage: async () => {},
}

describe('scheduleDispatches', () => {
  it('returns a task for each dispatch', () => {
    const dispatches = [
      {
        id: 'poll-1',
        type: 'poll',
        schedule: '0 10 * * 1',
        target: '123@g.us',
        content: { question: 'Q?', options: ['A', 'B'] },
      },
      {
        id: 'msg-1',
        type: 'message',
        schedule: '0 9 * * 5',
        target: '123@g.us',
        content: { text: 'Hello' },
      },
    ]

    const tasks = scheduleDispatches(mockSock, dispatches)
    expect(tasks).toHaveLength(2)
    expect(tasks.map((t) => t.id)).toEqual(['poll-1', 'msg-1'])
    stopAll(tasks)
  })

  it('throws on invalid cron expression', () => {
    const dispatches = [
      {
        id: 'bad-cron',
        type: 'message',
        schedule: 'not-a-cron',
        target: '123@g.us',
        content: { text: 'Hi' },
      },
    ]
    expect(() => scheduleDispatches(mockSock, dispatches)).toThrow('Invalid cron expression')
  })
})
