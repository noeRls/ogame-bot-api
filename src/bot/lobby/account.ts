
import { LobbyApi } from '../../Api/lobby/LobbyApi';
import { Account, Server } from '../../Api/lobby/types';
import { multiSelect } from '../utils/input';

const pickServer = async (api: LobbyApi): Promise<Server> => {
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
};

// @ts-ignore
const createNewAccount = async (api: LobbyApi): Promise<Account> => {
    await pickServer(api);
};

export const selectAccount = async (api: LobbyApi): Promise<Account> => {
    const accounts = await api.getAccounts();
    const selected = await multiSelect(accounts.map(a => `${a.name} - last login: ${a.lastLogin}`));
    return accounts[selected];
};