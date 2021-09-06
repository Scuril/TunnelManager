import clear = require('clear')
import chalk = require('chalk')
import * as figlet from 'figlet'
import { TunnelManager } from './manager'
import { Tunnel } from './tunnel'

const manager = new TunnelManager()

const showLogo = () => {
  clear()
  console.log(
    chalk.yellow(
      figlet.textSync('Tunnel Manager', { horizontalLayout: 'full' })
    )
  )
}

const listTunnels = () => {
  const tunnels = manager.list()
  const tunnelsM = 'Port\t\tStatus\t\tRegion\t\tURL\n' + tunnels.map(x => `:${x.port}\t\t${x.status}\t\t${x.region}\t\t${x.url}`)
  const notunnelsM = 'There is no tunnels'

  showLogo()
  console.log(
    chalk.blue(
      tunnels.length ? tunnelsM : notunnelsM
    )
  )
}

const main = () => {
  listTunnels()
  setTimeout(() => {
    manager.add(3000, 'eu', false)
  listTunnels()
  }, 2000)
}

main()
