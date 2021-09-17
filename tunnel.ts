import { configAsModule, configStruct } from './conf'

export class Tunnel {
  protected readonly config: configStruct
  public readonly port: number
  public status: string
  public url: string

  constructor(port: number) {
    this.config = require(configAsModule)
    this.port = port
    this.status = 'idle'
    this.url = ''
  }

  protected setStatus(status: string) {
    this.status = status
  }
  
  public async connect(): Promise<void> {
    throw new Error("Not Implement Exception")
  }
  public reset(): Promise<void> {
    return this.disconnect().then(_ => this.connect())
  }
  public async disconnect(): Promise<void> {
    throw new Error("Not Implement Exception")
  }
}