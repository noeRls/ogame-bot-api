const { LobbyApi } = require('ogame-bot-api');

async function main() {
    const api = new LobbyApi();
    await api.login('mail@gmail.com', 'password');
    const account = await api.selectLastPlayedAccount();
    const game = await api.loadGame(account);

    const factory = await game.resourceFactoryList();
    const mines = factory.mines;
    if (await game.canUpgrade(mines.crystalMine)) {
        await game.makeUpgrade(mines.crystalMine)
        console.log('Upgrading crystal mine !');
    } else {
        console.log(`Can't upgrade crystal mine`);
    }

    await game.stop();
}

main();
