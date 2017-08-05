/**
 * @file Entry point of bot.
 * @author Arnaud Ligny <arnaud@ligny.org>
 */

const config = require('../config.json')[process.env.NODE_ENV || 'development']
const schedule = require('node-schedule')
const token = process.env.SLACK_BOT_TOKEN

if (!token) {
  console.log('Error: Specify token in environment')
  process.exit(1)
}

let Botkit = require('botkit')

let controller = Botkit.slackbot({
  debug: config['DEBUG']
})

var bot = controller.spawn({
  token: token
}).startRTM(function (err, bot, payload) {
  if (err) {
    throw new Error('Could not connect to Slack')
  } else {
    console.log('READY TO WORK')
  }
})

/**
 * Sends a message every working day at 17:45
 */
schedule.scheduleJob('0 45 17 * * 1-5', function () {
  const text = '<!here> Attention @arnaud et @cecile, il est temps de s\'organiser pour récupérer Léo !\n'
  bot.api.chat.postMessage({
    'token': token,
    'channel': config['CHANNEL'],
    'text': text,
    'as_user': true
  })
})

/**
 * Explain the user how to use the bot
 */
controller.hears(['aide', 'help'], 'direct_message,direct_mention,mention', function (bot, message) {
  bot.reply(message,
    'Hello, je ne sers que de rappel journalier ! :smile:\n'
  )
})
