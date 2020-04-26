import { Api } from './Api/LobbyApi';
import * as readline from 'readline';
import { Account, Server } from './types';
import { GameApi } from './Api/GameApi';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.pause();

const input = (question: string): Promise<string> => new Promise((res, rej) => {
    rl.resume();
    rl.question(question, (data) => {
        res(data);
        rl.pause();
    });
});

const multiSelect = async (choices: string[]): Promise<number> => {
    let stringChoices = choices.map((s, i) => `${i + 1} - ${s}`).join('\n')
    stringChoices += '\n';
    while (true) {
        const selected = Number(await input(stringChoices));
        if (isNaN(selected) || selected < 1 || selected > choices.length)
            console.log('Enter a correct value');
        else
            return selected - 1;
    }
}

const pickServer = async (api: Api): Promise<Server> => {
    const servers = await api.listServers();
    servers.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    let offset = 0;
    while (true) {
        const serverRange = servers.slice(offset, offset + 10);
        let selections = serverRange.map(s => `${s.name} - start date: ${s.startDate} - player count: ${s.playerCount} - player online: ${s.playersOnline}`);
        selections = ['Previous page', ...selections, 'Next page'];
        const choice = await multiSelect(selections);
        if (choice === 0) {
            offset = Math.max(0, offset - 10);
        } else if (choice === 11) {
            offset = Math.min(servers.length - 10, offset + 10);
        } else {
            return servers[offset + choice - 1];
        }
    }
}

// @ts-ignore
const createNewAccount = async (api: Api): Promise<Account> => {
    await pickServer(api);
}

const selectAccount = async (api: Api): Promise<Account> => {
    const accounts = await api.getAccounts();
    const selected = 1 // await multiSelect(['Create a new account', ...accounts.map(a => `${a.name} - last login: ${a.lastLogin}`)]);
    // @ts-ignore
    if (selected === 0) {
        return createNewAccount(api);
    } else {
        return accounts[selected - 1];
    }
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const dumbLoop = async (game: GameApi) => {
    while (true) {
        console.log('fetching...')
        const resources = await game.listRessources();
        const factory = await game.ressourceFactoryList();
        const mines = Object.values(factory.mines);
        for (let i = 0; i < mines.length; i++) {
            const mine = mines[i];
            if (game.canUpgrade(mine.upgrade, resources)) {
                console.log('upgrade !');
                await game.makeUpgrade(mine.upgrade);
                break;
            }
        }
        console.log('sleeping');
        await sleep(60 * 1000);
    }
}

export async function bot(): Promise<void> {
    const api = new Api();
    await api.login('noe.rivals@gmail.com', 'Xr2Q1S5d@u8$O$rZ');
    const account = await selectAccount(api);
    const game = await api.loadGame(account);
    try {
        // await dumbLoop(game);
        // console.log(await game.facilitiesList());
        const resources = await game.listRessources();
        // console.log(await game.ressourceFactoryList());
        // console.log(await game.researchList());
        const ships = await game.shipList();
        if (game.canCreate(ships.fighterLight, resources, 1)) {
            await game.createShip(ships.fighterLight, 1);
        }
    } finally {
        await game.stop();
    }
}