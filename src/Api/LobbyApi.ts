import Axios from 'axios';
import { User, Server, Account } from '../types';
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
    const { data } = await axios.get('/users/me');
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

  loadGame(account: Account): GameApi {
    return new GameApi(this.__cookie, account);
  }
}
