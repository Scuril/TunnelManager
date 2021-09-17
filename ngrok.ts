import { ngrokRegions } from './conf'
import { Tunnel } from './tunnel'

export class NgrokTunnel extends Tunnel {
  private readonly ngrok: any
  public readonly authtoken: string
  public readonly region: ngrokRegions

  constructor(port: number) {
    super(port)

    this.ngrok = require('ngrok')
    this.authtoken = this.config.ngrokSettings.authtoken
    this.region = this.config.ngrokSettings.region
  }

  public async connect(): Promise<void> {
    this.setStatus('connecting')
    this.url = await this.ngrok.connect({
      authtoken: this.authtoken,
      proto: 'http',
      addr: this.port,
      region: this.region,
      onStatusChange: (status: string) => this.setStatus(status),
      onLogEvent: (data: any) => { }
    })
  }
  public disconnect(): Promise<void> {
    this.setStatus('idle')
    this.url = ''
    return this.ngrok.kill()
  }
}