import * as ngrok from 'ngrok'

export type Region = 'us' | 'eu' | 'au' | 'ap' | 'sa' | 'jp' | 'in'

export class Tunnel {
  public readonly port: number
  public readonly region: Region
  public url: string
  public status: 'closed' | 'connected' | 'idle'

  constructor(port: number, region: Region) {
    this.port = port
    this.region = region
    this.url = ''
    this.status = 'idle'
  }

  public async connect(): Promise<void> {
    if (this.status === 'idle') {
      return
    }
    this.url = await ngrok.connect({
      proto: 'http', // http|tcp|tls
      addr: this.port, // port
      region: this.region, // (us, eu, au, ap, sa, jp, in)
      onStatusChange: status => {
        this.status = status
        if(status === 'connected') {
          console.log(`Connection :${this.port} was reset ${this.url}`)
        }
        else {
          console.warn(`Connection :${this.port} was unexpectedly closed`)
        }
      }, // 'closed' - connection is lost, 'connected' - reconnected
      onLogEvent: data => {
        //console.log(data)
      }, // returns stdout messages from ngrok process
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
      return new Promise<void>((_, r) => r())
    }
    this.status = 'idle'
    this.url = ''
    return ngrok.disconnect(this.url)
  }
}
