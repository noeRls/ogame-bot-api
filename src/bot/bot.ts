import { GameApi, LobbyApi } from '../Api';
import { selectAccount, selectLastPlayedAccount } from './lobby/account';
import * as yargs from 'yargs';

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

const run = async (username: string, password: string) => {
    const api = new LobbyApi();
    await api.login(username, password);
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
};

export async function bot(): Promise<void> {
    const args = yargs
    .usage('Usage: $0 --mail [mail] --password [password]')
    .option('mail', {
      description: 'The mail of the ogame account',
      required: true,
      alias: 'm',
      type: 'string',
    })
    .option('password', {
      description: 'The password of the ogame account',
      alias: 'p',
      required: true,
      type: 'string',
    })
    .help()
    .alias('help', 'h')
    .argv;
    await run(args.mail, args.password);
}