import * as localtunnel from 'localtunnel'
import { Tunnel } from '../tunnel'

export class LocalTunnel extends Tunnel {
  private localtunnel: localtunnel.Tunnel | undefined
  public readonly subdomain: string

  constructor(port: number) {
    super(port)

    this.subdomain = this.config.subdomain
    this.localtunnel = undefined
  }

  public async connect(): Promise<void> {
    this.setStatus('connecting')
    if(this.localtunnel === undefined) {
      this.localtunnel = require('localtunnel')(this.port, {
        subdomain: this.subdomain + this.port
      }, (error: any, client: localtunnel.Tunnel) => {
        this.setStatus('connected')
        this.url = client.url
        if(!this.url.includes(this.subdomain)) {
          this.reset()
        }
      })
    }
  }
  
  public async disconnect(): Promise<void> {
    this.setStatus('idle')
    this.url = ''
    this.localtunnel?.close?.()
    this.localtunnel = undefined
  }
}