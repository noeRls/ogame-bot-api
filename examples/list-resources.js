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
