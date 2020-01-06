/**
 * @file Entry point of bot.
 * @author Arnaud Ligny <arnaud@ligny.org>
 */

const Botkit = require('botkit')
const Schedule = require('node-schedule')
const Redis = require('redis').createClient(process.env.REDIS_URL)
const i18n = require('i18n')
const path = require('path')

const debug = process.env.NODE_ENV !== 'production'
const child = process.env.CHILD || 'Léo'
const token = process.env.SLACK_BOT_TOKEN
const channel = process.env.CHANNEL || path.join('#', child)
const schedule = process.env.SCHEDULE || '0 45 17 * * 1-5'

i18n.configure({ directory: path.join(__dirname, '../locales') })

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
    text: i18n.__("Attention <!channel>, il est temps de s'organiser pour récupérer %s !", child),
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
  bot.reply(message, i18n.__('Hello, je ne sers que de rappel journalier ! :kissing_heart:\n- `annule` pour annuler les rappels\n- `rappel` pour reprogrammer les rappels'))
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
      convo.ask(i18n.__('Voulez-vous annuler les prochains rappels :alarm_clock: ?'), [
        {
          pattern: utterances.yes,
          callback: function (response, convo) {
            job.cancel()
            Redis.set('job', 'off', Redis.print)
            convo.say(i18n.__('Les rappels ont été annulés :no_bell:'))
            convo.next()
            // message on channel
            bot.api.chat.postMessage({
              token: token,
              channel: channel,
              text: i18n.__('Les rappels ont été annulés :no_bell:'),
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
      convo.say(i18n.__('Rappels programmés :bell:'))
      convo.next()
    }
  })
})
