import Axios from 'axios';
import { User, Server, Account, GameLoginResponse } from './types';
import { GameApi } from '../game/GameApi';

const axios = Axios.create({
  withCredentials: true,
  baseURL: 'https://lobby.ogame.gameforge.com/api',
});

const sortAccountByLastLogin = (accounts: Account[]): Account[] => {
  return accounts.sort((a, b) => {
      const da = new Date(a.lastLogin);
      const db = new Date(b.lastLogin);
      return db.getTime() - da.getTime();
  });
};

/**
 * The LobbyApi is used to login, get servers informations and load the GameApi
 */
export class LobbyApi {
  private user: User;
  private cookie: string;

  /**
   *
   * @param email Email of the ogame account
   * @param password Password of the ogame account
   */
  async login(email: string, password: string): Promise<void> {
    try {
      const response = await axios.post('https://gameforge.com/api/v1/auth/thin/sessions', {
        autoGameAccountCreation: false,
        gameEnvironmentId: "0a31d605-ffaf-43e7-aa02-d06df7116fc8",
        gfLang: "en",
        identity: email,
        locale: "en_GB",
        password,
        platformGameId: "1dfd8e7e-6e1a-4eb1-8c64-03c3b62efd2f",
      });
      const { token } = response.data;
      this.cookie = response.headers['set-cookie'][0];
      axios.interceptors.request.use(config => {
        config.headers.cookie = this.cookie;
        config.headers.authorization = `Bearer ${token}`;
        return config;
      });
      await this.refreshUser();
    } catch (e) {
      throw new Error('Failed to login');
    }
  }

  /**
   * @returns Returns the gloabl user informations
   */
  async me(): Promise<User> {
    const { data } : { data: User } = await axios.get('/users/me');
    return data;
  }

  /**
   * @returns Returns the user accounts. The user accounts are the
   * differents server which the user is already connected at least one time
   */
  async getAccounts(): Promise<Account[]> {
    const { data }: {data: Account[]} = await axios.get('/users/me/accounts');
    return sortAccountByLastLogin(data);
  }

  /**
   * @returns Returns the list of all ogame servers.
   */
  async listServers(): Promise<Server[]> {
    const { data }: {data: Server[]} = await axios.get('/servers');
    return data;
  }

  /**
   * @hidden
   */
  private async refreshUser() {
    this.user = await this.me();
    console.log(`Connected with ${this.user.email}`);
    this.user.accounts = await this.getAccounts();
  }

  /**
   * Select last account played by the user
   */
  async selectLastPlayedAccount(): Promise<Account> {
    const accounts = sortAccountByLastLogin(await this.getAccounts());
    if (accounts.length === 0) throw new Error(`User don't have accounts`);
    return accounts[0];
  }


  /**
   * Load the GameApi
   * @param account The selected account to load the game
   */
  async loadGame(account: Account): Promise<GameApi> {
    console.log(`Loading game api with server s${account.server.number}-${account.server.language}`);
    const { data: login } : { data: GameLoginResponse} = await axios.get(`/users/me/loginLink?id=${account.id}&server[language]=${account.server.language}&server[number]=${account.server.number}&clickedButton=account_list`);
    const api = new GameApi(this.cookie, account, login.url);
    await api.start();
    return api;
  }
}
