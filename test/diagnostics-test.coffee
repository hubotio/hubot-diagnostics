chai = require 'chai'
sinon = require 'sinon'
chai.use require 'sinon-chai'

expect = chai.expect

describe 'diagnostics', ->
  beforeEach ->
    @robot =
      respond: sinon.spy()
      hear: sinon.spy()

    require('../src/diagnostics')(@robot)

  it 'registers a respond listener', ->
    expect(@robot.respond).to.have.been.calledWith(/PING$/i)
    expect(@robot.respond).to.have.been.calledWith(/ADAPTER$/i)
    expect(@robot.respond).to.have.been.calledWith(/ECHO (.*)$/i)
    expect(@robot.respond).to.have.been.calledWith(/TIME$/i)
