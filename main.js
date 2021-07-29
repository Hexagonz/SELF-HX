const {
    WAConnection,
    MessageType,
    Presence,
    Mimetype,
    GroupSettingChange
} = require('@adiwajshing/baileys')
const fs = require('fs')
const { banner, start, success } = require('./lib/functions')
const { color } = require('./lib/color')

require('./index.js')
nocache('./index.js', module => console.log(`${module} is now updated!`))

const starts = async (hexa = new WAConnection()) => {
    hexa.logger.level = 'warn'
    hexa.version = [2, 2123, 8]
    hexa.browserDescription = [ 'Hexagonz', 'Chrome', '3.0' ]
    console.log(banner.string)
    hexa.on('qr', () => {
        console.log(color('[','white'), color('!','red'), color(']','white'), color(' Scan bang'))
    })

    fs.existsSync('./session.json') && hexa.loadAuthInfo('./session.json')
    hexa.on('connecting', () => {
        start('2', 'Connecting...')
    })
    hexa.on('open', () => {
        success('2', 'Connected')
    })
    await hexa.connect({timeoutMs: 30*1000})
        fs.writeFileSync('./session.json', JSON.stringify(hexa.base64EncodedAuthInfo(), null, '\t'))

    hexa.on('chat-update', async (message) => {
        require('./index.js')(hexa, message)
    })
}

/**
 * Uncache if there is file change
 * @param {string} module Module name or path
 * @param {function} cb <optional> 
 */
function nocache(module, cb = () => { }) {
    console.log('Module', `'${module}'`, 'is now being watched for changes')
    fs.watchFile(require.resolve(module), async () => {
        await uncache(require.resolve(module))
        cb(module)
    })
}

/**
 * Uncache a module
 * @param {string} module Module name or path
 */
function uncache(module = '.') {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(module)]
            resolve()
        } catch (e) {
            reject(e)
        }
    })
}

starts()
