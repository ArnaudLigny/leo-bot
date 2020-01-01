# leo-bot

> A very simple bot based on [Botkit](https://github.com/howdyai/botkit) to notice you when it's time to pick up your child at school!

![Slack screen capture](./docs/leo-bot-slack-example.png)

## Installation

```bash
git clone https://github.com/Narno/leo-bot.git && cd leo-bot
npm install
```

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/Narno/leo-bot)

### Slack
#### Token

You need to set an environment variable:
```bash
export SLACK_BOT_TOKEN="xoxb-XXXXXXXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXX"
```
> You'll find `SLACK_BOT_TOKEN` at https://my.slack.com/apps/A0F7YS25R-bots.

#### Channel

The bot daily message is sent to:
- `#test-bot` channel on **debug** mode
- `#leo` channel on **production** mode

See `config.json`.

### Reminder

The bot daily message is scheduled at:
- `*/15 * * * * *` on **debug** mode: every 15 seconds
- `0 45 17 * * 1-5` on **production** mode: every opendays at 5:45pm

See `config.json`.

## Usage

```bash
# Served with hot reload (+ ESLint verification).
npm run dev
# Run ESLint to check if code respects it's syntax.
npm run lint
# Start server in production environment.
npm run start
```

### Supported commands

Just ask `help` to `@leo-bot`.

## Deploy

### Heroku (CLI)

```bash
heroku create --buildpack https://github.com/heroku/heroku-buildpack-nodejs.git
heroku addons:create heroku-redis:hobby-dev
heroku config:set SLACK_BOT_TOKEN=xoxb-XXXXXXXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXX
heroku config:set TZ=Europe/Paris
heroku ps:scale web=0 worker=1
```

## Development

This project uses ESLint for its syntax. You should read [some documentation before](https://eslint.org/docs/rules/).

## License

_leo-bot_ is a free software distributed under the terms of the [MIT license](https://opensource.org/licenses/MIT).

Copyright (c) Arnaud Ligny
