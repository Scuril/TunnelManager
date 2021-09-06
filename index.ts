import { ConsoleTextManager } from './console'
import { TunnelManager } from './manager'

const manager = new TunnelManager()
const textManager = new ConsoleTextManager()

const main = async () => {
  await textManager.waitCommand(manager)
}

main()
