# leo-bot

_leo-bot_ is a very simple bot based on [Botkit](https://github.com/howdyai/botkit) to notice you when it's time to pick up your child at school!

![Screen capture of the Slack bot](docs/leo-bot-slack-example.png)

## Installation

```bash
git clone https://github.com/Narno/leo-bot.git && cd leo-bot
npm install
```

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/ArnaudLigny/leo-bot)

> [Node.js](https://nodejs.org) and [Redis](https://redis.io) are required.

## Configuration

You need to set environment variables (See [`.env.dist`](https://github.com/ArnaudLigny/leo-bot/blob/master/.env.dist)):

- `CHILD`: Child firstname (ie: `Léo`)
- `CHANNEL`: Slack channel (ie: `#leo`)
- `SCHEDULE`: Cron schedule (ie: `0 45 17 * * 1-5`)
- `SLACK_BOT_TOKEN`: Slack token (create one at [my.slack.com/apps/A0F7YS25R-bots](https://my.slack.com/apps/A0F7YS25R-bots))
- `REDIS_URL`: URL to the Redis server (ie: `redis://:secrets@example.com:1234`)
- `TZ`: Time Zone (ie: `Europe/Paris`)

The cron-style scheduling format consists of:

```text
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    |
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)
```

## Usage

```bash
# Served with hot reload (+ ESLint verification).
npm run dev

# Start server in production environment.
npm run start
```

### Supported Slack commands

Just ask `help` to `@leo-bot`.

## Deploy

### Heroku (CLI)

```bash
heroku create --buildpack https://github.com/heroku/heroku-buildpack-nodejs.git
heroku addons:create heroku-redis:hobby-dev
heroku config:set CHILD='Léo'
heroku config:set CHANNEL='#leo'
heroku config:set SCHEDULE='0 45 17 * * 1-5'
heroku config:set SLACK_BOT_TOKEN=xoxb-XXXXXXXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXX
heroku config:set TZ=Europe/Paris
heroku ps:scale web=0 worker=1
```

## Development

This project uses ESLint for its syntax. You should read [some documentation before](https://eslint.org/docs/rules/).

```bash
# Run ESLint to check if code respects it's syntax.
npm run lint
```

## Source

<https://github.com/ArnaudLigny/leo-bot>

## License

_leo-bot_ is a free software distributed under the terms of the [MIT license](https://opensource.org/licenses/MIT).

© [Arnaud Ligny](https://arnaudligny.fr)
