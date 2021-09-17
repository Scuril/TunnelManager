import { configAsModule, configStruct } from "./conf"
import { Tunnel } from "./tunnel"
import * as fs from 'fs'
import { NgrokTunnel } from "./ngrok"

export class TunnelManager {
  private readonly conf: configStruct
  private tunnels: Map<number, Tunnel>
  private readonly TunnelType: typeof Tunnel

  constructor() {
    this.conf = require(configAsModule)
    this.tunnels = new Map<number, Tunnel>()
    this.TunnelType = NgrokTunnel
    if(this.conf.exposer === 'ngrok') {
      this.TunnelType = NgrokTunnel
    }

    this.conf.tunnels.forEach(x => {
      this.add(x)
    })
  }

  public async add(port: number) {
    const tunnel = new this.TunnelType(port)
    this.tunnels.set(port, tunnel)
    if (this.conf.autoconnect) {
      await this.start(port)
    }
  }

  public async remove(port: number) {
    if(this.tunnels.has(port)) {
      const tunnel = this.tunnels.get(port)!
      await tunnel.disconnect()
      this.tunnels.delete(port)
    }
  }

  public start(port: number) {
    if(this.tunnels.has(port)) {
      const tunnel = this.tunnels.get(port)!
      return tunnel.connect()
    }
  }

  public restart(port: number | undefined = undefined) {
    if(port !== undefined) {
      if(this.tunnels.has(port)) {
        const tunnel = this.tunnels.get(port)!
        return tunnel.reset()
      }
    }
    else {
      return [...this.tunnels.values()].map(x => {
        return x.disconnect().then(_ => x.connect())
      })
    }
  }

  public stop(port: number) {
    if(this.tunnels.has(port)) {
      const tunnel = this.tunnels.get(port)!
      return tunnel.disconnect()
    }
  }

  public reset() {
    return Promise.all([...this.tunnels.values()].map(x => x.disconnect())).then(_ => {
      this.tunnels = new Map<number, Tunnel>()
      this.conf.tunnels.forEach(x => this.add(x))
    })
  }

  public list() {
    return [...this.tunnels.keys()].map(key => {
      const t = this.tunnels.get(key)!
      return {port: t.port, url: t.url, status: t.status}
    })
  }
}