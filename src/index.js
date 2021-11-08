#!/usr/bin/env node

import { program, Option, Argument } from 'commander'
import actions from './actions.js'

program.version('1.0.0')

program.command('ports')
    .description('list all available serial ports')
    .action(() => {
        actions.print_available_ports()
    })
   
program.command('flash')
    .description('flash config to pulu-device')
    .addArgument(
        new Argument('<devEui>', 'LoRaWAN devEui')
        .argRequired()
        .argParser(x=>{return x.match('^[A-Fa-f0-9]{16}')? x.toUpperCase() : null})
    )
    .addArgument(
        new Argument('<appEui>', 'LoRaWAN appEui')
        .argRequired()
        .argParser(x=>{return x.match('^[A-Fa-f0-9]{16}')? x.toUpperCase() : null})
    )
    .addArgument(
        new Argument('<appKey>', 'LoRaWAN appKey')
        .argRequired()
        .argParser(x=>{return x.match('^[A-Fa-f0-9]{32}')? x.toUpperCase() : null})
    )
    .addArgument(
        new Argument('<wait-time>', 'time to wait between measurements')
        .argRequired()
        .argParser(x=>{return x.match('^[0-9]{1,9}$')? parseInt(x) : null})
    )
    .addOption(
        new Option('-p, --port <port>', 'serial port to connect')
        .default(null, 'first available port')
    )
    .action( (devEui, appEui, appKey, wait_time, options) => {
        let config = {
            devEui,
            appEui,
            appKey,
            wait_time,
            port: options.port
        }
        actions.flash(config)
    })

program.parse();