const fs = require('fs')
const config = JSON.parse(fs.readFileSync(`./config.json`))
const axios = require('axios')
const fetch = require('node-fetch')

exports.start = async(lol, name) => {
    text = `Hello ${name}! Im a IoT Chatbot build with ❤️ by  [my master](${config.ownerLink})\n Start Menu : /help.`
    await lol.replyWithMarkdown(text, { disable_web_page_preview: true })
}

exports.helpto = async(lol, name, user_id) => {
    text = `Button Command Relay IoT Control\nCek relay Command : ketik "relay cek"`
    options = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Bin On', callback_data: 'binon-' + user_id },
                    { text: 'Bin Off', callback_data: 'binoff-' + user_id },
                    { text: 'Bin Cek', callback_data: 'bincek-' + user_id }
                ],
                [
                    { text: 'Relay 1', callback_data: 'relay1-' + user_id },
                    { text: 'Relay 2', callback_data: 'relay2-' + user_id },
                    { text: 'Relay 5', callback_data: 'relay5-' + user_id },
                    { text: 'Relay 6', callback_data: 'relay6-' + user_id }
                ],
                [
                    { text: 'Relay 3', callback_data: 'relay3-' + user_id },
                    { text: 'Relay 4', callback_data: 'relay4-' + user_id },
                    { text: 'Relay 7', callback_data: 'relay7-' + user_id },
                    { text: 'Relay 8', callback_data: 'relay8-' + user_id }
                ],
                [
                    { text: 'Manual Command', callback_data: 'manualc-' + user_id }
                ],

            ]
        }
    }
    try {
        await lol.editMessageText(text, options)
    } catch {
        await lol.reply(text, options)
    }
}

exports.bincek = async(lol, user_id) => {
    prefix = config.prefix
    tokenraspi = config.blynk_tokenr
    serverraspi = config.blynk_serverr
    const endpointcekbin = await fetch(`https://${serverraspi}/external/api/get?token=${tokenraspi}&V0&V1&V2&V3&V4&V5&V6&V7&V8`)
                    const cekbin = await endpointcekbin.json()
                    if (cekbin.V0.toString() === "1"){
                        var binstat = `ON` 
                    } else {
                        var binstat = `OFF`
                    }

                    const datadistancedalam = cekbin.V1
                    const datadistancetutup =  cekbin.V2
                    const datadistancedepan = cekbin.V3
                    const datacounter = cekbin.V4
                    const datatemperature = cekbin.V5
                    const datahumidity = cekbin.V6
                    const datadate = cekbin.V7
                    const datalevel = cekbin.V8
                   
const Vall = `
____________[Status SmartBin]___________

-> Status Switch : ${binstat}
-> Tank Level : ${datalevel}
-> Last Date : ${datadate}
-> Distance Dalam: ${datadistancedalam}
-> Distance Tutup: ${datadistancetutup}
-> Distance Depan: ${datadistancedepan}
-> Counter (tutup): ${datacounter}
-> Temperature: ${datatemperature}
-> Humidity: ${datahumidity}
________________________________________
`
    text = `${Vall}`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back', callback_data: 'helpto-' + user_id }
                ]
            ]
        }
    })
}

exports.binon = async(lol, user_id) => {
    prefix = config.prefix
    tokenraspi = config.blynk_tokenr
    serverraspi = config.blynk_serverr
    const endpointcekbin = await fetch(`https://${serverraspi}/external/api/get?token=${tokenraspi}&V0&V1`)
    const cekbin = await endpointcekbin.json()
    if (cekbin.V0.toString() === "1"){
        text = `SmartBin sudah hidup`
    } else {
        await axios.get(`https://${serverraspi}/external/api/update?token=${tokenraspi}&V0=1`)
        text = `SmartBin Berhasil dihidupkan!
    }
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Off', callback_data: 'binoff-' + user_id },
                    { text: 'Back', callback_data: 'helpto-' + user_id }
                ]
            ]
        }
    })
}

exports.binoff = async(lol, user_id) => {
    prefix = config.prefix
    tokenraspi = config.blynk_tokenr
    serverraspi = config.blynk_serverr
    const endpointcekbin = await fetch(`https://${serverraspi}/external/api/get?token=${tokenraspi}&V0&V1`)
    const cekbin = await endpointcekbin.json()
    if (cekbin.V0.toString() === "0"){
        text = `SmartBin sudah mati`
    } else {
        await axios.get(`https://${serverraspi}/external/api/update?token=${tokenraspi}&V0=0`)
        text = `SmartBin Berhasil dimatikan!
    }
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'On', callback_data: 'binon-' + user_id },
                    { text: 'Back', callback_data: 'helpto-' + user_id }
                ]
            ]
        }
    })
}

exports.binlog = async(lol, user_id) => {
    prefix = config.prefix
    tokenraspi = config.blynk_tokenr
    serverraspi = config.blynk_serverr
    const endpointcekbin = await fetch(`https://${serverraspi}/external/api/get?token=${tokenraspi}&V0&V1`)
    const cekbin = await endpointcekbin.json()
    if (cekbin.V0.toString() === "0"){
        text = `SmartBin sudah mati`
    } else {
        await axios.get(`https://${serverraspi}/external/api/update?token=${tokenraspi}&V0=0`)
        text = `SmartBin Berhasil dimatikan!
    }
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'On', callback_data: 'binon-' + user_id },
                    { text: 'Back', callback_data: 'helpto-' + user_id }
                ]
            ]
        }
    })
}

exports.relay1 = async(lol, user_id) => {
    prefix = config.prefix
    text = `Relay 1 Controll Button
Pin Metadata : V1(D0)    
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'On', callback_data: 'relay1on-' + user_id },
                    { text: 'Off', callback_data: 'relay1off-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay1on = async(lol, user_id) => {
    prefix = config.prefix
    token = config.blynk_token
    server = config.blynk_server
    on = config.on_value
    await axios.get(`https://${server}/external/api/update?token=${token}&V1=${on}`)
    text = `Relay 1 Dihidupkan!
Pin Metadata = V1(D0)
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Off', callback_data: 'relay1off-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay1off = async(lol, user_id) => {
    prefix = config.prefix
    token = config.blynk_token
    server = config.blynk_server
    off = config.off_value
    await axios.get(`https://${server}/external/api/update?token=${token}&V1=${off}`)
    text = `Relay 1 Dimatikan!
Pin Metadata = V1(D0)
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'On', callback_data: 'relay1on-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay2 = async(lol, user_id) => {
    prefix = config.prefix
    text = `Relay 2 Controll Button
Pin Metadata : V2(D1)    
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'On', callback_data: 'relay2on-' + user_id },
                    { text: 'Off', callback_data: 'relay2off-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay2on = async(lol, user_id) => {
    prefix = config.prefix
    token = config.blynk_token
    server = config.blynk_server
    on = config.on_value
    await axios.get(`https://${server}/external/api/update?token=${token}&V2=${on}`)
    text = `Relay 2 Dihidupkan!
Pin Metadata = V2(D1)
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Off', callback_data: 'relay2off-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay2off = async(lol, user_id) => {
    prefix = config.prefix
    token = config.blynk_token
    server = config.blynk_server
    off = config.off_value
    await axios.get(`https://${server}/external/api/update?token=${token}&V2=${off}`)
    text = `Relay 2 Dimatikan!
Pin Metadata = V2(D1)
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'On', callback_data: 'relay2on-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay3 = async(lol, user_id) => {
    prefix = config.prefix
    text = `Relay 3 Controll Button
Pin Metadata : V3(D2)    
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'On', callback_data: 'relay3on-' + user_id },
                    { text: 'Off', callback_data: 'relay3off-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay3on = async(lol, user_id) => {
    prefix = config.prefix
    token = config.blynk_token
    server = config.blynk_server
    on = config.on_value
    await axios.get(`https://${server}/external/api/update?token=${token}&V3=${on}`)
    text = `Relay 3 Dihidupkan!
Pin Metadata = V3(D2)
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Off', callback_data: 'relay3off-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay3off = async(lol, user_id) => {
    prefix = config.prefix
    token = config.blynk_token
    server = config.blynk_server
    off = config.off_value
    await axios.get(`https://${server}/external/api/update?token=${token}&V3=${off}`)
    text = `Relay 3 Dimatikan!
Pin Metadata = V3(D2)
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'On', callback_data: 'relay3on-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay4 = async(lol, user_id) => {
    prefix = config.prefix
    text = `Relay 1 Controll Button
Pin Metadata : V4(D3)    
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'On', callback_data: 'relay4on-' + user_id },
                    { text: 'Off', callback_data: 'relay4off-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay4on = async(lol, user_id) => {
    prefix = config.prefix
    token = config.blynk_token
    server = config.blynk_server
    on = config.on_value
    await axios.get(`https://${server}/external/api/update?token=${token}&V4=${on}`)
    text = `Relay 4 Dihidupkan!
Pin Metadata = V4(D3)
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Off', callback_data: 'relay4off-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay4off = async(lol, user_id) => {
    prefix = config.prefix
    token = config.blynk_token
    server = config.blynk_server
    off = config.off_value
    await axios.get(`https://${server}/external/api/update?token=${token}&V4=${off}`)
    text = `Relay 4 Dimatikan!
Pin Metadata = V4(D3)
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'On', callback_data: 'relay4on-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay5 = async(lol, user_id) => {
    prefix = config.prefix
    text = `Relay 5 Controll Button
Pin Metadata : V5(D5)    
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'On', callback_data: 'relay5on-' + user_id },
                    { text: 'Off', callback_data: 'relay5off-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay5on = async(lol, user_id) => {
    prefix = config.prefix
    token = config.blynk_token
    server = config.blynk_server
    on = config.on_value
    await axios.get(`https://${server}/external/api/update?token=${token}&V5=${on}`)
    text = `Relay 5 Dihidupkan!
Pin Metadata = V5(D5)
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Off', callback_data: 'relay5off-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay5off = async(lol, user_id) => {
    prefix = config.prefix
    token = config.blynk_token
    server = config.blynk_server
    off = config.off_value
    await axios.get(`https://${server}/external/api/update?token=${token}&V5=${off}`)
    text = `Relay 5 Dimatikan!
Pin Metadata = V5(D5)
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'On', callback_data: 'relay5on-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay6 = async(lol, user_id) => {
    prefix = config.prefix
    text = `Relay 5 Controll Button
Pin Metadata : V6(D6)    
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'On', callback_data: 'relay6on-' + user_id },
                    { text: 'Off', callback_data: 'relay6off-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay6on = async(lol, user_id) => {
    prefix = config.prefix
    token = config.blynk_token
    server = config.blynk_server
    on = config.on_value
    await axios.get(`https://${server}/external/api/update?token=${token}&V6=${on}`)
    text = `Relay 6 Dihidupkan!
Pin Metadata = V6(D6)
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Off', callback_data: 'relay6off-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay6off = async(lol, user_id) => {
    prefix = config.prefix
    token = config.blynk_token
    server = config.blynk_server
    off = config.off_value
    await axios.get(`https://${server}/external/api/update?token=${token}&V6=${off}`)
    text = `Relay 6 Dimatikan!
Pin Metadata = V6(D6)
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'On', callback_data: 'relay6on-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay7 = async(lol, user_id) => {
    prefix = config.prefix
    text = `Relay 1 Controll Button
Pin Metadata : V7(D7)    
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'On', callback_data: 'relay7on-' + user_id },
                    { text: 'Off', callback_data: 'relay7off-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay7on = async(lol, user_id) => {
    prefix = config.prefix
    token = config.blynk_token
    server = config.blynk_server
    on = config.on_value
    await axios.get(`https://${server}/external/api/update?token=${token}&V7=${on}`)
    text = `Relay 7 Dihidupkan!
Pin Metadata = V7(D7)
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Off', callback_data: 'relay7off-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay7off = async(lol, user_id) => {
    prefix = config.prefix
    token = config.blynk_token
    server = config.blynk_server
    off = config.off_value
    await axios.get(`https://${server}/external/api/update?token=${token}&V7=${off}`)
    text = `Relay 7 Dimatikan!
Pin Metadata = V7(D7)
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'On', callback_data: 'relay7on-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay8 = async(lol, user_id) => {
    prefix = config.prefix
    text = `Relay 8 Controll Button
Pin Metadata : V8(D8)    
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'On', callback_data: 'relay8on-' + user_id },
                    { text: 'Off', callback_data: 'relay8off-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay8on = async(lol, user_id) => {
    prefix = config.prefix
    token = config.blynk_token
    server = config.blynk_server
    on = config.on_value
    await axios.get(`https://${server}/external/api/update?token=${token}&V8=${on}`)
    text = `Relay 8 Dihidupkan!
Pin Metadata = V8(D8)
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Off', callback_data: 'relay8off-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay8off = async(lol, user_id) => {
    prefix = config.prefix
    token = config.blynk_token
    server = config.blynk_server
    off = config.off_value
    await axios.get(`https://${server}/external/api/update?token=${token}&V8=${off}`)
    text = `Relay 8 Dimatikan!
Pin Metadata = V8(D8)
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'On', callback_data: 'relay8on-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}


exports.manualc = async(lol, user_id) => {
    prefix = config.prefix
    text = `Manual Menu :

❏ ${prefix}relay cek
❏ ${prefix}relay on
❏ ${prefix}relay off
❏ ${prefix}relay 1 on
❏ ${prefix}relay 1 off
❏ ${prefix}relay 2 on
❏ ${prefix}relay 2 off
❏ ${prefix}relay 3 on
❏ ${prefix}relay 3 off
❏ ${prefix}relay 4 on
❏ ${prefix}relay 4 off
❏ ${prefix}relay 5 on
❏ ${prefix}relay 5 off
❏ ${prefix}relay 6 on
❏ ${prefix}relay 6 off
❏ ${prefix}relay 7 on
❏ ${prefix}relay 7 off
❏ ${prefix}relay 8 on
❏ ${prefix}relay 8 off
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.messageError = async(lol) => {
    await lol.reply(`Error! Please report to the [${config.owner}](${config.ownerLink}) about this`, { parse_mode: "Markdown", disable_web_page_preview: true })
}