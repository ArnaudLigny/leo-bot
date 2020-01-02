/**
 * @file Entry point of bot.
 * @author Arnaud Ligny <arnaud@ligny.org>
 */

const Schedule = require('node-schedule')
const Redis = require('redis').createClient(process.env.REDIS_URL)
const Botkit = require('botkit')

const debug = process.env.NODE_ENV !== 'production'
const token = process.env.SLACK_BOT_TOKEN
const channel = process.env.CHANNEL
const schedule = process.env.SCHEDULE

// messages
const messageReminder = 'Attention <!channel>, il est temps de s\'organiser pour récupérer Léo !'
const messageHelp = 'Hello, je ne sers que de rappel journalier ! :kissing_heart:\n' +
'- `annule` pour annuler les rappels\n' +
'- `rappel` pour reprogrammer les rappels'
const messageReminderCancelAsk = 'Voulez-vous annuler les prochains rappels :alarm_clock: ?'
const messageReminderCancelConfirm = 'Les rappels ont été annulés :no_bell:'
const messageReminderStartConfirm = 'Rappels programmés :bell:'

if (!token) {
  console.log('Error: Slack token is not defined in environment')
  process.exit(1)
}

const controller = Botkit.slackbot({
  debug: debug
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

/**
 * Reminder message
 */
const reminder = function () {
  bot.api.chat.postMessage({
    token: token,
    channel: channel,
    text: messageReminder,
    as_user: true
  })
}

/**
 * Job schedule
 */
let job = Schedule.scheduleJob(schedule, reminder)

Redis.get('job', function (error, result) {
  if (error) {
    console.log(error)
    throw error
  }
  if (debug) {
    console.log('debug: REDIS `job` = `' + result + '`')
  }
  if (result === 'off') {
    job.cancel()
  }
})

/**
 * Explain how to use the bot
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
  bot.startConversation(message, function (err, convo) {
    if (!err) {
      convo.ask(messageReminderCancelAsk, [
        {
          pattern: utterances.yes,
          callback: function (response, convo) {
            job.cancel()
            Redis.set('job', 'off', Redis.print)
            convo.say(messageReminderCancelConfirm)
            convo.next()
            // message on channel
            bot.api.chat.postMessage({
              token: token,
              channel: channel,
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
      job = Schedule.scheduleJob(schedule, reminder)
      Redis.set('job', 'on', Redis.print)
      convo.say(messageReminderStartConfirm)
      convo.next()
    }
  })
})
