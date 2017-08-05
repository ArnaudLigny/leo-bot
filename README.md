# leo-bot

> A very simple bot based on [Botkit](https://github.com/howdyai/botkit) to inform you when it's time to get your child to school!

## Installation

```bash
npm install
```

### Slack token

You need to set a environment variable:

```bash
export SLACK_BOT_TOKEN="xoxb-XXXXXXXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXX"

> You'll find `SLACK_BOT_TOKEN` at https://`XXXXX`.slack.com/apps/A0F7YS25R-bots.

### Slack channels

The bot daily messages are sent to `#test-bot` on debug mode and on `#leo` on production mode.

## Usage

```bash
# Served with hot reload (also launches ESLint verification).
npm run dev

# Start server in production environment.
npm run start

# Launches ESLint to check if code respects it's syntax.
npm run eslint
```

### Supported commands

Just ask `help` to `@leo-bot`.

## Development

This project uses ESLint for its syntax. You should read [some documentation before](http://eslint.org/docs/rules/).

## License

_leo-bot_ is a free software distributed under the terms of the [MIT license](http://opensource.org/licenses/MIT).

Copyright (c) 2017, Arnaud Ligny
