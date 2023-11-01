import EventEmitter from 'events'
import {
  authenticate,
  createHttp1Request,
  createWebSocketConnection,
  Credentials,
  EventCallback,
  LeagueClient,
  LeagueWebSocket,
} from 'league-connect'
import pRetry from 'p-retry'
import { check } from 'tcp-port-used'

type LeagueAPIClientEvents = 'ready' | 'disconnect' | 'connect' | 'in-game'

export class LeagueAPIClient {
  private credentials: Credentials | null = null
  private ws: LeagueWebSocket | null = null
  private emitter = new EventEmitter()
  public isInGame = false

  /**
   * LeagueAPIClient를 초기화합니다.
   *
   * 현재 롤 클라이언트가 켜져있어서 API 연결이 되었다면 true, 아니면 false를 반환합니다.
   * (반환값이 false인 경우 나중에 롤 클라이언트가 켜지면 'ready' 이벤트가 발생합니다.)
   *
   * @returns 롤 클라이언트 API 연결 여부
   */
  public async initialize() {
    this.intervalCheckInGame()

    try {
      await Promise.all([this.connectAuth(), this.connectWS()])

      this.registerCredentialsListener()
      await this.waitLCUReady()
      this.emitter.emit('ready')

      return true
    } catch {
      this.initializePollConnections()
      return false
    }
  }

  private async initializePollConnections() {
    await Promise.all([this.pollConnectionAuth(), this.pollConnectionWS()])

    this.registerCredentialsListener()
    await this.waitLCUReady()
    this.emitter.emit('ready')
  }

  private async connectAuth() {
    this.credentials = await authenticate()
  }

  private async connectWS() {
    this.ws = await createWebSocketConnection()
  }

  private async pollConnectionAuth() {
    this.credentials = await authenticate({
      awaitConnection: true,
    })
  }

  private async pollConnectionWS() {
    this.ws = await createWebSocketConnection({
      authenticationOptions: {
        awaitConnection: true,
      },
    })
  }

  private async checkInGame() {
    const isUsed = await check(2999, '127.0.0.1')
    if (isUsed !== this.isInGame) {
      this.isInGame = isUsed
      this.emitter.emit('in-game', isUsed)
    }
  }

  private async intervalCheckInGame() {
    await this.checkInGame()
    setTimeout(() => this.intervalCheckInGame(), 1000)
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
      await this.pollConnectionWS()
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
          this.get('/lol-summoner/v1/current-summoner')
            .then(data => {
              if (!data || data.httpStatus === 404) return reject(new Error('Not logged in'))
              if (!data.summonerId) return reject(new Error('Summoner not found'))
              resolve(data)
            })
            .catch(reject)
        }),
      {
        // @ts-ignore: 라이브러리 자체 타입 오류 무시
        retries: 100,
      },
    )
  }

  public isReady() {
    return this.credentials !== null
  }

  public async get(url: string) {
    if (!this.credentials) return null

    const res = await createHttp1Request(
      {
        method: 'GET',
        url,
      },
      this.credentials,
    )

    return res.json()
  }

  public async post(url: string, body?: any) {
    if (!this.credentials) throw new Error('Credentials not found')

    const res = await createHttp1Request(
      {
        method: 'POST',
        url,
        body,
      },
      this.credentials,
    )

    return res
  }

  public async put(url: string, body?: any) {
    if (!this.credentials) throw new Error('Credentials not found')

    const res = await createHttp1Request(
      {
        method: 'PUT',
        url,
        body,
      },
      this.credentials,
    )

    return res
  }

  public async patch(url: string, body?: any) {
    if (!this.credentials) throw new Error('Credentials not found')

    const res = await createHttp1Request(
      {
        method: 'PATCH',
        url,
        body,
      },
      this.credentials,
    )

    return res
  }

  public async delete(url: string, body?: any) {
    if (!this.credentials) throw new Error('Credentials not found')

    const res = await createHttp1Request(
      {
        method: 'DELETE',
        url,
        body,
      },
      this.credentials,
    )

    return res
  }

  public async subscribe(path: string, effect: EventCallback) {
    if (!this.ws) throw new Error('WebSocket not found')
    this.ws.subscribe(path, effect)
  }

  public on(event: LeagueAPIClientEvents, effect: EventCallback) {
    this.emitter.on(event, effect)
  }

  public off(event: LeagueAPIClientEvents, effect: EventCallback) {
    this.emitter.off(event, effect)
  }
}
