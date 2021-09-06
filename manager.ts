import { Region, Tunnel } from "./tunnel"
import * as fs from 'fs'

type TunnelManagerConfig = {
  tunnels: number[] | undefined,
  autoconnect: boolean | undefined,
  region: Region | undefined
}

export class TunnelManager {
  private tunnels: Map<number, Tunnel>
  private autoconnect: boolean
  private region: Region

  constructor(path: string = 'config.json') {
    this.autoconnect = true
    this.region = 'eu'
    this.tunnels = new Map<number, Tunnel>()
    if(fs.existsSync(path) && fs.lstatSync(path).isFile()) {
      const data = fs.readFileSync(path).toString()

      let localConf: TunnelManagerConfig
      try {
        localConf = JSON.parse(data)
      }
      catch {
        return
      }

      if(localConf.autoconnect !== undefined) {
        this.autoconnect = localConf.autoconnect
      }
      if(localConf.region !== undefined) {
        this.region = localConf.region
      }
      if(localConf.tunnels !== undefined) {
        for (let i = 0; i < localConf.tunnels.length; i++) {
          this.add(localConf.tunnels[i])
        }
      }
    }
  }

  public async add(port: number, region: Region = this.region, autoconnect: boolean = this.autoconnect) {
    const tunnel = new Tunnel(port, region)
    this.tunnels.set(port, tunnel)
    if (autoconnect) {
      await tunnel.connect()
    }
  }

  public async remove(port: number) {
    if(this.tunnels.has(port)) {
      const tunnel = this.tunnels.get(port)!
      await tunnel.disconnect()
      this.tunnels.delete(port)
    }
  }

  public stop(port: number) {
    if(this.tunnels.has(port)) {
      const tunnel = this.tunnels.get(port)!
      return tunnel.disconnect()
    }
  }

  public list() {
    return [...this.tunnels.keys()].map(key => {
      const t = this.tunnels.get(key)!
      return {port: t.port, url: t.url, status: t.status, region: t.region}
    })
  }
}