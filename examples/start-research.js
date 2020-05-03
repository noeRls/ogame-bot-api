const { LobbyApi } = require('ogame-bot-api');

async function main() {
    const api = new LobbyApi();
    await api.login('mail@gmail.com', 'password');
    const account = await api.selectLastPlayedAccount();
    const game = await api.loadGame(account);

    const research = await game.researchList();
    if (await game.canUpgrade(research.energyTechnology)) {
        await game.makeUpgrade(research.energyTechnology)
        console.log('Energy research started !');
    } else {
        console.log(`Can't make energy research`);
    }

    await game.stop();
}

main();
