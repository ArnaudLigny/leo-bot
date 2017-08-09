# leo-bot

> A very simple bot based on [Botkit](https://github.com/howdyai/botkit) to notice you when it's time to pick up your child at school!

![Slack screen capture](./docs/leo-bot-slack-example.png)

## Installation

```bash
npm install
```

### Slack token

You need to set an environment variable:

```bash
export SLACK_BOT_TOKEN="xoxb-XXXXXXXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXX"
```

> You'll find `SLACK_BOT_TOKEN` at https://my.slack.com/apps/A0F7YS25R-bots.

### Slack channels

The bot daily message is sent to:
- `#test-bot` channel on **debug** mode
- `#leo` channel on **production** mode

## Usage

```bash
# Served with hot reload (+ ESLint verification).
npm run dev

# Run ESLint to check if code respects it's syntax.
npm run eslint

# Start server in production environment.
npm run start
```

### Supported commands

Just ask `help` to `@leo-bot`.

## Deploy

### Heroku

```bash
heroku create --buildpack https://github.com/heroku/heroku-buildpack-nodejs.git
heroku config:set SLACK_BOT_TOKEN=xoxb-XXXXXXXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXX
heroku config:set TZ=Europe/Paris
heroku ps:scale web=0 worker=1
```

## Development

This project uses ESLint for its syntax. You should read [some documentation before](http://eslint.org/docs/rules/).

## License

_leo-bot_ is a free software distributed under the terms of the [MIT license](http://opensource.org/licenses/MIT).

Copyright (c) 2017, Arnaud Ligny
