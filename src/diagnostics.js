'use strict'

// Description
//   hubot scripts for diagnosing hubot
//
// Commands:
//   hubot ping - Reply with pong
//   hubot adapter - Reply with the adapter
//   hubot echo <text> - Reply back with <text>
//   hubot time - Reply with current time
//
// Author:
//   Josh Nichols <technicalpickles@github.com>

module.exports = function (robot) {
  robot.respond(/PING$/i, async msg => {
    await msg.send('PONG')
  })

  robot.respond(/ADAPTER$/i, async msg => {
    await msg.send(robot.adapterName)
  })
  robot.respond(/ECHO ([\s\S]*)$/im, async msg => {
    await msg.send(msg.match[1])
  })

  robot.respond(/TIME$/i, async msg => {
    await msg.send(`Server time is: ${new Date()}`)
  })
}
