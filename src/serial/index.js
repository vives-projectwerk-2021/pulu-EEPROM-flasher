import events from 'events'
import SerialPort from 'serialport'
import Readline from '@serialport/parser-readline'
import base64 from '../base64/index.js'

export default {
    available_ports: () => {
        return new Promise((resolve, reject) => {
            SerialPort.list()
            .then( portsInfo => {
                let ports = []
                let defaultPortSet = false
                if(portsInfo.length) {
                    for(const portInfo of portsInfo) {
                        const isSTM = (portInfo.manufacturer == "STMicroelectronics")
                        const isDefault = defaultPortSet?false:isSTM
                        if(isDefault) defaultPortSet = true
                        ports.push({
                            path: portInfo.path,
                            manufacturer: portInfo.manufacturer,
                            serialNumber: portInfo.serialNumber,
                            isDefault
                        })
                    }
                    if(!defaultPortSet) {
                        ports[0].isDefault = true
                    }
                }
                resolve(ports)
            })
            .catch( err => reject(err) )
        })
    },
    flash: (config) => {
        return new Promise((resolve, reject) => {
            let serialPort = new SerialPort(config.port, {baudRate: 115200}, (err) => {
                if(err) {
                    reject(err)
                }
            })
            const reader = serialPort.pipe(new Readline({ delimiter: '\n' }))

            let em = new events.EventEmitter()
            em.on('uid', (uid) => {
                clearTimeout(timer)
                // write config
                reader.on('data', (data) => {
                    let result = data.toString()
                    if(base64.decode_bytes(result) == uid) {
                        // bypass reading
                    }
                    else if(result[0] == '0') {
                        resolve(uid)
                    }
                    else {
                        reject(new Error('pulu-device error'))
                    }
                })
                serialPort.write(base64.encode_text('res'))     // send reset command
                const bytes = config.devEui + config.appEui + config.appKey
                    + config.wait_time.toString(16).padStart(4, '0').toUpperCase()
                serialPort.write(base64.encode_bytes(bytes))    // send config
            })
            
            reader.once('data', (data) => {
                em.emit('uid', base64.decode_bytes(data.toString()))
            })
            serialPort.write(base64.encode_text('id'))
            let timer = setTimeout(() => {
                reject(new Error('pulu-device not responding'))
            }, 5000)
        })
    }
}