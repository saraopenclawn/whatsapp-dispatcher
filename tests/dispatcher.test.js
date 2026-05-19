import { describe, it, expect, jest } from '@jest/globals'
import { dispatch } from '../src/dispatcher.js'

describe('dispatch', () => {
  it('sends a poll message', async () => {
    const sendMessage = jest.fn().mockResolvedValue({})
    const sock = { sendMessage }

    await dispatch(sock, {
      id: 'test-poll',
      type: 'poll',
      target: '123@g.us',
      content: { question: 'Q?', options: ['A', 'B'], selectableCount: 1 },
    })

    expect(sendMessage).toHaveBeenCalledWith('123@g.us', {
      poll: { name: 'Q?', values: ['A', 'B'], selectableCount: 1 },
    })
  })

  it('sends a text message', async () => {
    const sendMessage = jest.fn().mockResolvedValue({})
    const sock = { sendMessage }

    await dispatch(sock, {
      id: 'test-msg',
      type: 'message',
      target: '123@g.us',
      content: { text: 'Hello!' },
    })

    expect(sendMessage).toHaveBeenCalledWith('123@g.us', { text: 'Hello!' })
  })

  it('throws on unknown type', async () => {
    const sock = { sendMessage: jest.fn() }
    await expect(
      dispatch(sock, { id: 'x', type: 'unknown', target: '123@g.us', content: {} })
    ).rejects.toThrow('Unknown dispatch type')
  })
})
