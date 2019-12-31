/**
 * @file Entry point of bot.
 * @author Arnaud Ligny <arnaud@ligny.org>
 */

const config = require('../config.json')[process.env.NODE_ENV || 'development']
const schedule = require('node-schedule')
const token = process.env.SLACK_BOT_TOKEN
const messageReminder = 'Attention <!channel>, il est temps de s\'organiser pour récupérer Léo !'
const messageHelp = 'Hello, je ne sers que de rappel journalier ! :kissing_heart:\n' +
'- `annule` pour annuler les rappels\n' +
'- `rappel` pour reprogrammer les rappels'
const messageReminderCancelAsk = 'Voulez-vous annuler les prochains rappels :alarm_clock: ?'
const messageReminderCancelConfirm = 'Les rappels ont été annulés :no_bell:'
const messageReminderStartConfirm = 'Rappels programmés :bell:'

if (!token) {
  console.log('Error: Specify token in environment')
  process.exit(1)
}

const Botkit = require('botkit')

const controller = Botkit.slackbot({
  debug: config.DEBUG
})

const bot = controller.spawn({
  token: token
}).startRTM(function (err, bot, payload) {
  if (err) {
    throw new Error('Could not connect to Slack!')
  } else {
    console.log('Bot is ready to work!')
  }
})

const redis = require('redis').createClient(process.env.REDIS_URL)

/**
 * Sends a message
 */
const reminder = function () {
  bot.api.chat.postMessage({
    token: token,
    channel: config.CHANNEL,
    text: messageReminder,
    as_user: true
  })
}

/**
 * Job schedule
 */
let job = schedule.scheduleJob(config.SCHEDULE, reminder)

redis.get('job', function (error, result) {
  if (error) {
    console.log(error)
    throw error
  }
  if (config.DEBUG) {
    console.log('debug: REDIS `job` = `' + result + '`')
  }
  if (result === 'off') {
    job.cancel()
  }
})

/**
 * Explain the user how to use the bot
 */
controller.hears(['aide', 'help'], 'direct_message,direct_mention,mention', function (bot, message) {
  bot.reply(message, messageHelp)
})

const utterances = {
  yes: new RegExp(/^(oui|ouais|yes|yea|yup|yep|ya|sure|ok|y|yeah|yah)/i),
  no: new RegExp(/^(non|nop|nan|no|nah|nope|n)/i)
}

/**
 * Cancel the next planned invocations
 */
controller.hears(['annule', 'cancel'], 'direct_message,direct_mention,mention', function (bot, message) {
  // bot.reply(message, messageReminderCancel)
  bot.startConversation(message, function (err, convo) {
    if (!err) {
      convo.ask(messageReminderCancelAsk, [
        {
          pattern: utterances.yes,
          callback: function (response, convo) {
            job.cancel()
            redis.set('job', 'off', redis.print)
            convo.say(messageReminderCancelConfirm)
            convo.next()
            // message on channel
            bot.api.chat.postMessage({
              token: token,
              channel: config.CHANNEL,
              text: messageReminderCancelConfirm,
              as_user: true
            })
          }
        },
        {
          pattern: bot.utterances.no,
          default: true,
          callback: function (response, convo) {
            convo.say('...')
            convo.next()
          }
        }
      ])
    }
  })
})

/**
 * reStart planned invocations
 */
controller.hears(['rappel', 'reminder'], 'direct_message,direct_mention,mention', function (bot, message) {
  bot.startConversation(message, function (err, convo) {
    if (!err) {
      job.cancel()
      job = schedule.scheduleJob(config.SCHEDULE, reminder)
      redis.set('job', 'on', redis.print)
      convo.say(messageReminderStartConfirm)
      convo.next()
    }
  })
})
