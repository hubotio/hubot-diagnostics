# Description
#   hubot scripts for diagnosing hubot
#
# Commands:
#   hubot ping - Reply with pong
#   hubot adapter - Reply with the adapter
#   hubot echo <text> - Reply back with <text>
#   hubot time - Reply with current time
#   hubot show storage - Display the contents that are persisted in the brain
#   hubot show users - Display all users that hubot knows about
#
# Author:
#   Josh Nichols <technicalpickles@github.com>

Util = require "util"

module.exports = (robot) ->
  robot.respond /PING$/i, id: "diagnostics.ping", (msg) ->
    msg.send "PONG"

  robot.respond /ADAPTER$/i, id: "diagnostics.adapter", (msg) ->
    msg.send robot.adapterName

  robot.respond /ECHO (.*)$/i, id: "diagnostics.echo", (msg) ->
    msg.send msg.match[1]

  robot.respond /TIME$/i, id: "diagnostics.time", (msg) ->
    msg.send "Server time is: #{new Date()}"

  robot.respond /show storage$/i, id: "diagnostics.storage", (msg) ->
    output = Util.inspect(robot.brain.data, false, 4)
    msg.send output

  robot.respond /show users$/i, id: "diagnostics.users", (msg) ->
    response = ""

    for own key, user of robot.brain.data.users
      response += "#{user.id} #{user.name}"
      response += " <#{user.email_address}>" if user.email_address
      response += "\n"

    msg.send response