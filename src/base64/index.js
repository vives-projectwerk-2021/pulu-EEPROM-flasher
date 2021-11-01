export default {
    encode_text(data) {
        return Buffer.from(data).toString('base64')
    },
    encode_bytes(data) {
        const buffer = Uint8Array.from(data.match(/(..)/g).map(b=>'0x'+b))
        return Buffer.from(String.fromCharCode(...buffer), 'binary').toString('base64')
    },
    decode_text(data) {
        return Buffer.from(data, 'base64').toString()
    },
    decode_bytes(data) {
        return Buffer.from(data, 'base64').toString('binary').split('').map(c=>c.charCodeAt(0).toString(16).padStart(2, '0').toUpperCase()).join('')
    }
}
