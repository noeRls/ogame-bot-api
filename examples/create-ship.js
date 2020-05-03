const { LobbyApi } = require('ogame-bot-api');

async function main() {
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

main();
