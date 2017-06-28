# Description
#   hubot scripts for diagnosing hubot
#
# Commands:
#   hubot ping - Reply with pong
#   hubot adapter - Reply with the adapter
#   hubot echo <text> - Reply back with <text>
#   hubot time - Reply with current time
#
# Author:
#   Josh Nichols <technicalpickles@github.com>

module.exports = (robot) ->
  robot.respond /PING$/i, id: "diagnostics.ping", (msg) ->
    msg.send "PONG"

  robot.respond /ADAPTER$/i, id: "diagnostics.adapter", (msg) ->
    msg.send robot.adapterName

  robot.respond /ECHO (.*)$/i, id: "diagnostics.echo", (msg) ->
    msg.send msg.match[1]

  robot.respond /TIME$/i, id: "diagnostics.time", (msg) ->
    msg.send "Server time is: #{new Date()}"
