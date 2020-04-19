export interface Account {
  server: {
    language: string,
    number: number
  },
  id: number,
  gameAccountId: number,
  name: string,
  lastPlayed: string,
  lastLogin: string,
  blocked: Boolean,
  bannedUntil?: string,
  bannedReason?: string,
  details: [any],
  sitting: { shared: Boolean, endTime?: string, cooldownTime?: number },
  trading: { trading: Boolean, cooldownTime?: number }
}

export interface User {
  id: number,
  userId: number,
  gameforgeAccountId: string,
  ownershipIds: [string],
  validated: Boolean,
  portable: Boolean,
  unlinkedAccounts: Boolean,
  migrationRequired: Boolean,
  fakeEmail?: Boolean,
  email: string,
  unportableName: string,
  mhash: string
  accounts?: Account[]
}

export interface Server {
  language: string,
  number: number,
  name: string,
  playerCount: number,
  playersOnline: number,
  opened: string,
  startDate: string,
  endDate?: string,
  serverClosed: number,
  prefered: number,
  signupClosed: number,
  settings: {
    aks: number,
    fleetSpeed: number,
    wreckField: number,
    serverLabel: string,
    economySpeed: number,
    planetFields: number,
    universeSize: number,
    serverCategory: 'miner' | 'fleeter' | 'balanced',
    espionageProbeRaids: number,
    premiumValidationGift: number,
    debrisFieldFactorShips: number,
    debrisFieldFactorDefence: number
  }
}