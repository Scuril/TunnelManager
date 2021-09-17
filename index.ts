import { configPath, configAsModule, configStruct, defaultConfig } from './conf'
import { ConsoleTextManager } from './console'
import { TunnelManager } from './manager'
import * as fs from 'fs'

const checkConfig = () => {
  if(fs.existsSync(configPath) && fs.lstatSync(configPath).isFile()) {
    const conf: configStruct = require(configAsModule)
    Object.keys(defaultConfig).map(x => x as keyof configStruct).forEach((k: keyof configStruct) => {
      if(conf[k] === undefined) {
        conf[k] = defaultConfig[k] as never // just don't know why it's necessary
        fs.writeFileSync(configPath, JSON.stringify(conf, void 0, 2))
      }
    })
  }
  else {
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, void 0, 2))
  }
}

const main = async () => {
  checkConfig()
  const textManager = new ConsoleTextManager()
  const manager = new TunnelManager()

  await textManager.waitCommand(manager)
}

main()
