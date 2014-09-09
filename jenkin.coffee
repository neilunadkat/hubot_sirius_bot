j = require("./js/jenkins")

module.exports = (robot) ->
  robot.respond  /start build server/i, (msg) ->
    msg.emote "is going over to jenkins"
    setTimeout () ->
      j.startRemoteBuildServer((t) -> msg.reply t)
    , 2000

  robot.respond /stop build server/i, (msg) ->
    msg.emote "is going over to jenkins"
    setTimeout () ->
      j.stopRemoteBuildServer((t) -> msg.reply t)
    , 2000

  robot.respond /run build/i, (msg) ->
    msg.emote "is going over to jenkins"
    setTimeout () ->
      j.runJenkinsBuild(msg.message.text,"sirius",(t) -> msg.reply t)
    , 2000

  robot.respond /get info for jen build/i, (msg) ->
    msg.emote "is going over to jenkins"
    setTimeout () ->
      j.getJenkinsBuildInfo(msg.message.text,"sirius",(t) -> msg.reply t)
    , 2000

  robot.respond /start blue server/i, (msg) ->
    msg.emote "is going over to jenkins"
    setTimeout () ->
      j.startBlueServer((t) -> msg.reply t)
    , 2000

  robot.respond /stop blue server/i, (msg) ->
    msg.emote "is going over to jenkins"
    setTimeout () ->
      j.stopBlueServer((t) -> msg.reply t)
    , 2000
