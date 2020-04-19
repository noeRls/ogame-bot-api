import Axios, { AxiosInstance } from 'axios';
import { User, Server, Account } from '../types';

export class GameApi {
    account: Account
    axios: AxiosInstance
    constructor(cookie: string, account: Account) {
        this.account = account;
        this.axios = Axios.create({
          withCredentials: true,
          baseURL: `https://s${account.server.number}-${account.server.language}.ogame.gameforge.com/game`,
        });
        this.axios.interceptors.request.use(config => {
            if (!config.headers['cookie']) {
                config.headers['cookie'] = '';
            }
            config.headers['cookie'] += cookie;
            return config;
        });
    }

    async listRessources() {
        const { data } = await this.axios.get('/index.php?page=ingame&component=supplies');
        console.log(data);
    }
}