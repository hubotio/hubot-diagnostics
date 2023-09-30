'use strict'

const { describe, it, beforeEach, afterEach } = require('node:test')
const path = require('path')
const assert = require('assert')
const Hubot = require('hubot')

const Robot = Hubot.Robot
const TextMessage = Hubot.TextMessage

const newTestRobot = async () => {
  process.env.PORT = '0'
  const robot = new Robot('mock-adapter', false, 'hubot')

  await robot.loadFile(path.resolve('src/'), 'diagnostics.js')
  await robot.loadAdapter('./test/fixtures/MockAdapter.js')

  robot.adapter.on('connected', () => robot.brain.userForId('1', {
    name: 'john',
    real_name: 'John Doe',
    room: '#test'
  }))

  return robot
}

describe('diagnostics', () => describe('respond to diagnostic commands', () => {
  let robot = null
  beforeEach(async () => {
    robot = await newTestRobot()
    await robot.run()
  })

  afterEach(() => {
    robot.shutdown()
  })

  describe('when sent a ping', () => it('hubot pongs', async () => {
    let wasCalled = false
    robot.adapter.on('send', (envelope, strings) => {
      assert.equal(strings.length, 1)
      assert.equal(strings[0], 'PONG')
      wasCalled = true
    })
    await robot.receive(new TextMessage(this.user, 'hubot ping'))
    assert.deepEqual(wasCalled, true)
  }))

  describe('when asked for adapter', () => it('responds with mock-adapter', async () => {
    let wasCalled = false
    robot.adapter.on('send', (envelope, strings) => {
      assert.equal(strings.length, 1)
      assert.equal(strings[0], 'mock-adapter')
      wasCalled = true
    })

    await robot.receive(new TextMessage(this.user, 'hubot adapter'))
    assert.deepEqual(wasCalled, true)
  }))

  describe('when asked to echo a string', () => it('echoes the string', async () => {
    let wasCalled = false
    robot.adapter.on('send', (envelope, strings) => {
      assert.equal(strings.length, 1)
      assert.equal(strings[0], 'horses are weird')
      wasCalled = true
    })

    await robot.receive(new TextMessage(this.user, 'hubot echo horses are weird'))
    assert.deepEqual(wasCalled, true)
  }))

  describe('when asked for the server time', () => it('responds with the time', async () => {
    let wasCalled = false
    robot.adapter.on('send', (envelope, strings) => {
      assert.equal(strings.length, 1)
      assert.match(strings[0], /Server time is:/g)
      wasCalled = true
    })
    await robot.receive(new TextMessage(this.user, 'hubot time'))
    assert.deepEqual(wasCalled, true)
  }))

  describe('when asked to echo a multiline string', () => it('echoes the multiline string', async () => {
    let wasCalled = false
    robot.adapter.on('send', (envelope, strings) => {
      assert.equal(strings.length, 1)
      assert.equal(strings[0], 'horses are weird\nviolets are blue')
      wasCalled = true
    })

    await robot.receive(new TextMessage(this.user, 'hubot echo horses are weird\nviolets are blue'))
    assert.deepEqual(wasCalled, true)
  }))
}))
