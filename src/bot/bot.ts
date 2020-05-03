import { LobbyApi } from '../Api';
import * as yargs from 'yargs';
import { compute } from './compute';

const run = async (username: string, password: string) => {
    const api = new LobbyApi();
    await api.login(username, password);
    const account = await api.selectLastPlayedAccount();
    const game = await api.loadGame(account);
    try {
        await compute(game);
        const defenses = await game.defenseList();
        if (await game.canCreate(defenses.rocketLauncher, 1)) {
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