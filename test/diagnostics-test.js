'use strict'

/* global describe, beforeEach, it, afterEach, context */

const path = require('path')

const chai = require('chai')
const { hook, reset } = require('./fixtures/RequireMocker.js')
const Hubot = require('hubot')

const expect = chai.expect
const Robot = Hubot.Robot
const TextMessage = Hubot.TextMessage

chai.use(require('sinon-chai'))

const newTestRobot = function newTestRobot () {
  process.env.PORT = '0'
  const robot = new Robot(null, 'mock-adapter', true, 'hubot')

  robot.loadFile(path.resolve('src/'), 'diagnostics.js')

  robot.adapter.on('connected', () => robot.brain.userForId('1', {
    name: 'john',
    real_name: 'John Doe',
    room: '#test'
  }))

  return robot
}

describe('diagnostics', () => describe('respond to diagnostic commands', () => {
  beforeEach(function () {
    hook('hubot-mock-adapter', require('./fixtures/MockAdapter.js'))
    this.robot = newTestRobot()
    this.robot.run()
    this.user = this.robot.brain.userForName('john')
  })

  afterEach(function () {
    this.robot.shutdown()
    reset()
  })

  context('when sent a ping', () => it('hubot pongs', function (done) {
    this.robot.adapter.on('send', function (envelope, strings) {
      expect(strings.length).to.eql(1)
      expect(strings[0]).to.eql('PONG')

      return done()
    })

    return this.robot.adapter.receive(new TextMessage(this.user, 'hubot ping'))
  }))

  context('when asked for adapter', () => it('responds with mock-adapter', function (done) {
    this.robot.adapter.on('send', function (envelope, strings) {
      expect(strings.length).to.eql(1)
      expect(strings[0]).to.eql('mock-adapter')

      return done()
    })

    return this.robot.adapter.receive(new TextMessage(this.user, 'hubot adapter'))
  }))

  context('when asked to echo a string', () => it('echoes the string', function (done) {
    this.robot.adapter.on('send', function (envelope, strings) {
      expect(strings.length).to.eql(1)
      expect(strings[0]).to.eql('horses are weird')

      return done()
    })

    return this.robot.adapter.receive(new TextMessage(this.user, 'hubot echo horses are weird'))
  }))

  context('when asked for the server time', () => it('responds with the time', function (done) {
    this.robot.adapter.on('send', function (envelope, strings) {
      expect(strings.length).to.eql(1)
      expect(strings[0]).to.include('Server time is:')

      return done()
    })
    return this.robot.adapter.receive(new TextMessage(this.user, 'hubot time'))
  }))

  context('when asked to echo a multiline string', () => it('echoes the multiline string', function (done) {
    this.robot.adapter.on('send', function (envelope, strings) {
      expect(strings.length).to.eql(1)
      expect(strings[0]).to.eql('horses are weird\nviolets are blue')

      return done()
    })

    return this.robot.adapter.receive(new TextMessage(this.user, 'hubot echo horses are weird\nviolets are blue'))
  }))
}))
