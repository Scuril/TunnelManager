import { ConsoleTextManager } from './console'
import { TunnelManager } from './manager'

const main = async () => {
  const textManager = new ConsoleTextManager()
  const manager = new TunnelManager('config.json')

  await textManager.waitCommand(manager)
}

main()
