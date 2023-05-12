import EventEmitter from 'events'
import {
  authenticate,
  createHttp1Request,
  createWebSocketConnection,
  Credentials,
  EventCallback,
  HttpRequestOptions,
  LeagueClient,
  LeagueWebSocket,
} from 'league-connect'
import pRetry from 'p-retry'

type LeagueAPIClientEvents = 'ready' | 'disconnect' | 'connect'

class LeagueAPIClient {
  private credentials: Credentials | null = null
  private ws: LeagueWebSocket | null = null
  private emitter = new EventEmitter()

  constructor() {
    this.initializeConnection()
  }

  private async initializeConnection() {
    await Promise.all([this.connectAuth(), this.connectWS()])

    this.registerCredentialsListener()
    await this.waitLCUReady()
    this.emitter.emit('ready')
  }

  private async connectAuth() {
    this.credentials = await authenticate({
      awaitConnection: true,
    })
  }

  private async connectWS() {
    this.ws = await createWebSocketConnection({
      authenticationOptions: {
        awaitConnection: true,
      },
    })
  }

  /**
   * League Client가 켜지거나 꺼질 때 자동으로 credentials를 업데이트해주는 함수입니다.
   */
  private registerCredentialsListener() {
    if (!this.credentials) throw new Error('Credentials not found')

    const client = new LeagueClient(this.credentials)

    client.on('connect', async newCredentials => {
      this.credentials = newCredentials
      await this.waitLCUReady()
      await this.connectWS()
      this.emitter.emit('connect')
      this.emitter.emit('ready')
    })

    client.on('disconnect', () => {
      this.credentials = null
      this.emitter.emit('disconnect')
    })

    client.start()
  }

  /**
   * LCU가 사용 가능한 상태가 될 때까지 대기해주는 함수입니다.
   */
  private async waitLCUReady() {
    if (!this.credentials) throw new Error('Credentials not found')

    await pRetry(
      () =>
        new Promise((resolve, reject) => {
          this.request({
            method: 'GET',
            url: '/lol-summoner/v1/current-summoner',
          })
            .then(response => {
              const data = response.json()

              if (data.httpStatus === 404) return reject(new Error('Not logged in'))
              if (!data.summonerId) return reject(new Error('Summoner not found'))
              resolve(data)
            })
            .catch(reject)
        }),
      {
        // @ts-ignore
        retries: 100,
      },
    )
  }

  public isReady() {
    return this.credentials !== null
  }

  public async request(options: HttpRequestOptions) {
    if (!this.credentials) throw new Error('Credentials not found')

    return await createHttp1Request(options, this.credentials)
  }

  public async subscribe(path: string, effect: EventCallback) {
    if (!this.ws) throw new Error('WebSocket not found')
    this.ws.subscribe(path, effect)
  }

  public async on(event: LeagueAPIClientEvents, effect: EventCallback) {
    this.emitter.on(event, effect)
  }
}

export default LeagueAPIClient
