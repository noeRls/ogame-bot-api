const { LobbyApi } = require('ogame-bot-api');

async function main() {
    const api = new LobbyApi();
    await api.login('mail@gmail.com', 'password');
    const account = await api.selectLastPlayedAccount();
    const game = await api.loadGame(account);

    const defenses = await game.defenseList();
    if (await game.canCreate(defenses.rocketLauncher, 3)) {
        await game.createDefense(defenses.rocketLauncher, 3);
        console.log('3 rocket launcher created !');
    } else {
        console.log(`Can't create rocket launcher`);
    }

    await game.stop();
}

main();
