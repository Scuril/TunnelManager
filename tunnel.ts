export type Region = 'us' | 'eu' | 'au' | 'ap' | 'sa' | 'jp' | 'in'

export class Tunnel {
  private readonly ngrok: any
  public readonly authtoken: string
  public readonly port: number
  public readonly region: Region
  public url: string
  public status: 'closed' | 'connected' | 'idle'

  constructor(port: number, region: Region, authtoken: string) {
    this.ngrok = require('ngrok')
    this.port = port
    this.region = region
    this.url = ''
    this.status = 'idle'
    this.authtoken = authtoken
  }

  public async connect(): Promise<void> {
    if (this.status !== 'idle') {
      return
    }
    this.url = await this.ngrok.connect({
      authtoken: this.authtoken,
      proto: 'http', // http|tcp|tls
      addr: this.port, // port
      region: this.region, // (us, eu, au, ap, sa, jp, in)
      onStatusChange: (status: 'closed' | 'connected' | 'idle') => {
        this.status = status
      }, // 'closed' - connection is lost, 'connected' - reconnected
      onLogEvent: (data: any) => { }, // returns stdout messages from ngrok process
    })
  }

  public async reset(): Promise<void> {
    if(this.status === 'connected') {
      await this.disconnect()
    }
    await this.connect()
  }

  public disconnect(): Promise<void> {
    if(this.status !== 'connected') {
      return new Promise<void>((r) => r())
    }
    this.status = 'idle'
    this.url = ''
    return this.ngrok.kill()
  }
}
