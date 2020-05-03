const { LobbyApi } = require('ogame-bot-api');

async function main() {
    const api = new LobbyApi();
    await api.login('mail@gmail.com', 'password');
    const account = await api.selectLastPlayedAccount();
    const game = await api.loadGame(account);

    const facilities = await game.facilitiesList();
    if (await game.canUpgrade(facilities.roboticsFactory)) {
        await game.makeUpgrade(facilities.roboticsFactory)
        console.log('Upgrading robotic factory !');
    } else {
        console.log(`Can't upgrade robotic factory`);
    }

    await game.stop();
}

main();
