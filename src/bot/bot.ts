import { GameApi, LobbyApi } from '../Api';
import { selectAccount, selectLastPlayedAccount } from './lobby/account';

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// @ts-ignore
const dumbLoop = async (game: GameApi) => {
    while (true) {
        console.log('fetching...');
        const resources = await game.resourcesList();
        const factory = await game.resourceFactoryList();
        const mines = Object.values(factory.mines);
        for (const mine of mines) {
            if (game.canUpgrade(mine.upgrade, resources)) {
                console.log('upgrade !');
                await game.makeUpgrade(mine.upgrade);
                break;
            }
        }
        console.log('sleeping');
        await sleep(60 * 1000);
    }
};

export async function bot(): Promise<void> {
    const api = new LobbyApi();
    await api.login('noe.rivals@gmail.com', 'Xr2Q1S5d@u8$O$rZ');
    const account = await selectLastPlayedAccount(api);
    const game = await api.loadGame(account);
    try {
        // await dumbLoop(game);
        // console.log(await game.facilitiesList());
        // console.log(await game.resourceFactoryList());
        // console.log(await game.researchList());
        const resources = await game.resourcesList();
        const defenses = await game.defenseList();
        if (game.canCreate(defenses.rocketLauncher, resources, 1)) {
            await game.createDefense(defenses.rocketLauncher, 1);
        }
    } finally {
        await game.stop();
    }
}