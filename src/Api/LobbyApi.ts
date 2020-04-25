import Axios from 'axios';
import { User, Server, Account, GameLoginResponse } from '../types';
import { GameApi } from './GameApi';

const axios = Axios.create({
  withCredentials: true,
  baseURL: 'https://lobby.ogame.gameforge.com/api',
});

export class Api {
  user: User
  __cookie: string
  constructor() {
  }

  async login(email: string, password: string): Promise<void> {
    const response = await axios.post('/users', {
      credentials: {
        email,
        password
      }
    });
    this.__cookie = response.headers['set-cookie'][0];
    axios.interceptors.request.use(config => {
      config.headers['cookie'] = this.__cookie;
      return config;
    });
    await this.__refreshUser();
  }

  async me(): Promise<User> {
    const { data } : { data: User } = await axios.get('/users/me');
    console.log(`Connected with ${data.email}`);
    return data;
  }

  async getAccounts(): Promise<Account[]> {
    const { data }: {data: Account[]} = await axios.get('/users/me/accounts')
    return data;
  }

  async listServers(): Promise<Server[]> {
    const { data }: {data: Server[]} = await axios.get('/servers')
    return data;
  }

  async __refreshUser() {
    this.user = await this.me();
    this.user.accounts = await this.getAccounts();
  }

  async loadGame(account: Account): Promise<GameApi> {
    console.log(`Loading game api ${account.server.number}...`);
    const { data: login } : { data: GameLoginResponse} = await axios.get(`/users/me/loginLink?id=${account.id}&server[language]=${account.server.language}&server[number]=${account.server.number}&clickedButton=account_list`);
    const api = new GameApi(this.__cookie, account, login.url);
    await api.init();
    return api;
  }
}
