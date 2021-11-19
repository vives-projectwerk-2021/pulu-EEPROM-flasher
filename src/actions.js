import serial from './serial/index.js'

function print_no_ports_available() {
    console.log('---------------------------\n'
    + 'No available ports detected\n'
    + '---------------------------\n')
    process.exit(0)
}
function print_port_not_available() {
    console.log('------------------------------\n'
    + 'Port not detected as available\n'
    + '------------------------------\n')
    process.exit(1)
}
function print_ports(defaultPort, otherPorts) {
    const separator = '-------------\n'
    let result = separator
    result += `DEfAULT PORT\n`
        + `path:\t\t${defaultPort.path}\n`
        + `manufacturer:\t${defaultPort.manufacturer}\n`
        + `serialNumber:\t${defaultPort.serialNumber}\n`
        + separator
    for(const port of otherPorts) {
        result += `path:\t\t${port.path}\n`
        + `manufacturer:\t${port.manufacturer}\n`
        + `serialNumber:\t${port.serialNumber}\n`
        + separator
    }
    console.log(result)
    process.exit(0)
}
function print_flash_success(uid) {
    console.log('------------------------------\n'
    + 'Config flashed\n'
    + `uid: ${uid}\n`
    + '------------------------------\n')
    process.exit(0)
}
function print_flash_failure(err) {
    console.log('----------------------\n'
    + 'Failed to flash config\n'
    + '----------------------')
    console.log('Error:\n\t' + err.message)
    process.exit(2)
}
function print_unexpected_error(err) {
    console.log("Unexpected error occured:\n")
    console.log(err)
    process.exit(100)
}

export default {
    print_available_ports: async () => {
        serial.available_ports()
        .then( ports => {
            if(ports.length) {
                const defaultPort = ports.find(x=>x.isDefault)
                const otherPorts = ports.filter(x=>!x.isDefault)
                print_ports(defaultPort, otherPorts)
            }
            else {
                print_no_ports_available()
            }
        })
        .catch( err => print_unexpected_error(err) )
    },
    flash: async (config) => {
        serial.available_ports()
        .then(ports => {
            if(!config.port) {
                const defaultPort = ports.find(x=>x.isDefault)
                if(defaultPort) {
                    config.port = defaultPort.path
                }
                else {
                    print_no_ports_available()
                    return
                }
            }
            else {
                if(!ports.map(p=>p.path).includes(config.port)) {
                    print_port_not_available()
                    return
                }
            }

            serial.flash(config)
            .then(uid => {
                print_flash_success(uid)
            })
            .catch((err) => print_flash_failure(err))
        })
        .catch(err => print_unexpected_error(err))
    }
}