# pulu config flasher

Flash the configuration of a pulu-device to it's EEPROM.

## Setup

```bash
npm install
```

## Execute

### Get available serial ports

```bash
node . ports
```

### Flash config

- Use the first available serial port:

    ```bash
    node . flash <devEui> <appEui> <appKey> <wait-time>
    ```

- Use a specific serial port:

    ```bash
    node . flash <devEui> <appEui> <appKey> <wait-time> --port <port>
    ```
