# ogame-bot-api

Api to create a bot for [ogame](https://ogame.fr)

This Api allow direct intercation on user account.

It is writen in **typescript**

It uses [puppeteer](https://github.com/puppeteer/puppeteer) to simulate user interactions and get game informations.

### installation

Install from npm to your dependencies [ogame-bot-api](https://www.npmjs.com/package/ogame-bot-api)

```sh
npm install --save ogame-bot-api
```

## Api

There is two API:
- the `LobbyApi` that is used to login the user and get user servers info
- the `GameApi` that is used to interact with the game itself, create and list ressources/ship/research...

Documentation can be found [here](https://htmlpreview.github.io/noeRls/ogame-bot-api/tree/master/docs/modules/_index_.html)

### Supported feature

- `LobbyApi`
  - Login
  - List servers
  - List user servers
  - Connect to game api
- `GameApi`
  - list and upgrade
    - resources
    - mines
    - storage
    - researsh
  - lists and create
    - ships
    - defenses

### Examples

Multiples examples can be found in `examples` folder

Here is a simple one to list user resources.
```js
const { LobbyApi } = require('ogame-bot-api');

async function main() {
    const api = new LobbyApi();
    await api.login('mail@gmail.com', 'password');
    const account = await api.selectLastPlayedAccount();
    const game = await api.loadGame(account);

    const resources = await game.resourcesList();
    console.log(resources);

    await game.stop();
}

main();
```

A simple one to create a ship
```js
const { LobbyApi } = require('ogame-bot-api');

function main() {
    const api = new LobbyApi();
    await api.login('mail@gmail.com', 'password');
    const account = await api.selectLastPlayedAccount();
    const game = await api.loadGame(account);

    const ships = await game.shipList();
    if (await game.canCreate(ships.fighterLight)) {
        await game.createShip(ships.fighterLight);
        console.log('Ship created !');
    } else {
        console.log(`Can't create ship`);
    }

    await game.stop();
}
```

## Bot

A bot is currently in development

#### installation

Install it globally from npm [ogame-bot-api](https://www.npmjs.com/package/ogame-bot-api)

```sh
npm install -g ogame-bot-api
```

Then start it:
```sh
ogame-bot --mail [mail] --password [password]
```

# Contribute

If you have any issues or want some new feature don't esitate to create an issue

Fell free to contrubite, particullary on the bot, fork the repo and create a pull request
