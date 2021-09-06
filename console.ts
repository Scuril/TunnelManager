import clear = require('clear')
import chalk = require('chalk')
import * as figlet from 'figlet'
import * as inquirer from 'inquirer'
import { TunnelManager } from './manager'

export class ConsoleTextManager {
  private defaultPort: number

  constructor() {
    this.defaultPort = 3000
  }

  public logo = () => {
    clear()
    console.log(
      chalk.yellow(
        figlet.textSync('Tunnel Manager', { horizontalLayout: 'full' })
      )
    )
  }
  
  public listTunnels = (manager: TunnelManager) => {
    const tunnels = manager.list()
    const format = chalk.blue
    const tunnelsM = format.bold('Port\t\tStatus\t\tRegion\t\tURL\n') + format(tunnels.map(x => `:${x.port}\t\t${x.status}\t\t${x.region}\t\t${x.url}`))
    const notunnelsM = format('There is no tunnels')
  
    this.logo()
    console.log(
      chalk.blue(
        tunnels.length ? tunnelsM : notunnelsM
      )
    )
  }

  private async createTunnelPort() {
    return (await inquirer.prompt([
      {
        name: 'port',
        type: 'input',
        message: 'Enter port',
        default: this.defaultPort,
        validate: (val) => {
          return !isNaN(parseInt(val)) ? true : 'Please enter valid port'
        }
      }
    ])).port
  }

  private async getTunnelPort(ports: number[]) {
    console.log(ports)
    return (await inquirer.prompt([
      {
        type: 'list',
        name: 'port',
        message: 'Choose port',
        choices: ports
      }
    ])).port
  }

  public async addTunnel(manager: TunnelManager) {
    const port = await this.createTunnelPort()
    if(port == this.defaultPort) {
      this.defaultPort++
    }
    await manager.add(port)
  }

  public async removeTunnel(manager: TunnelManager) {
    const ports = manager.list().map(x => x.port)
    const port = await this.getTunnelPort(ports)
    await manager.remove(port)
  }

  public async startTunnel(manager: TunnelManager) {
    const ports = manager.list().map(x => x.port)
    const port = await this.getTunnelPort(ports)
    await manager.start(port)
  }

  public async restartTunnel(manager: TunnelManager) {
    const ports = manager.list().map(x => x.port)
    const port = await this.getTunnelPort(ports)
    await manager.restart(port)
  }

  public async stopTunnel(manager: TunnelManager) {
    const ports = manager.list().map(x => x.port)
    const port = await this.getTunnelPort(ports)
    await manager.stop(port)
  }

  private commands(manager: TunnelManager) {
    let commands = new Map<string, Function>()
    commands.set('List tunnels', this.listTunnels)
    commands.set('Add tunnel', this.addTunnel)
    commands.set('Exit', () => {
      clear()
      process.exit()
    })

    const count = manager.list().length
    if(count) {
      commands.set('Remove tunnel', this.removeTunnel)
      commands.set('Start tunnel', this.startTunnel)
      commands.set('Restart tunnel', this.startTunnel)
      commands.set('Stop tunnel', this.stopTunnel)
    }

    [...commands.keys()].forEach(x => commands.set(x, (commands.get(x) as Function).bind(this)))

    return commands
  }

  private listCommands(commands: string[]) {
    console.log(
      chalk.green.bold(
        '#\t\tCommand\n'
      )
      +
      chalk.green(
        commands.map((x, i) => `${i}\t\t${x}`).join('\n')
      )
    )
  }

  public async waitCommand(manager: TunnelManager) {
    let i = 0
    let lastCommand
    while(true) {
      this.logo()
      await lastCommand?.(manager)
      const commands = this.commands(manager)
      const cKeys = [...commands.keys()]
      this.listCommands(cKeys)
      let answer: string | number = (await inquirer.prompt([
        {
          name: 'command',
          type: 'input',
          message: 'Enter command index or name',
          validate: (val) => {
            const isValidIndex = !isNaN(parseInt(val)) && +val < cKeys.length
            const isValidCommand = cKeys.includes(val)
            return isValidCommand || isValidIndex ? true : 'Please enter valid command name or index'
          }
        }
      ])).command
      if(!isNaN(parseInt(answer as string))) {
        answer = cKeys[answer as number]
      }
      lastCommand = commands.get(answer as string)
    }
    
  }
}
