import { configPath, configAsModule, configStruct, defaultConfig } from './conf'
import { ConsoleTextManager } from './console'
import { TunnelManager } from './manager'
import { Command } from 'commander'
import * as fs from 'fs'

const delay = (ms: number) => new Promise((res, rej) => setTimeout(res, ms))

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
  const args = process.argv
  
  checkConfig()
  const manager = new TunnelManager()

  const program = new Command()
  program
    .option('-s, --silent', 'Run program with config')
  program.parse(args)

  const options = program.opts()
  if(options.silent) {
    const conf: configStruct = require(configAsModule)
    if(!conf.autoconnect) {
      await Promise.all(conf.tunnels.map(x => {
        return manager.start(x)
      }))
      manager.list().forEach(x => {
        console.log(`:${x.port} - ${x.url}`)
      })
      while(true) {
        await delay(100)
      }
    }
  }
  else {
    const textManager = new ConsoleTextManager()
    await textManager.waitCommand(manager)
  }
}

main()
