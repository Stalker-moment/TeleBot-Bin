const { fetchJson, range, parseMarkdown } = require('./lib/function')
const { Telegraf } = require('telegraf')
const relay = require('./lib/relay')
//const SmartBin = require('./lib/SmartBin')
const tele = require('./lib/tele')
const chalk = require('chalk')
const axios = require('axios')
const fetch = require('node-fetch')
const os = require('os')
const fs = require('fs')
const cron = require('node-cron')
const moment = require('moment-timezone')
//const { config } = require('process')

const { 
    sleep
    } = require('./lib/functions')

let config = JSON.parse(fs.readFileSync('./config.json'))

let {
    bot_token,
    blynk_token,
    blynk_server,
    blynk_serverr,
    blynk_tokenr,
    blynk_serverb,
    blynk_tokenb,
    on_value,
    off_value,
    owner,
    ownerLink,
    version,
    prefix
} = JSON.parse(fs.readFileSync(`./config.json`))

if (bot_token == "") {
    return console.log("=== BOT TOKEN CANNOT BE EMPTY ===")
}

const time = moment().format('HH:mm:ss');
const date = moment().format('YYYY-MM-DD');

function convertMilisecondsToTime(miliseconds) {
    const seconds = Math.floor((miliseconds / 1000) % 60);
    const minutes = Math.floor((miliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((miliseconds / (1000 * 60 * 60)) % 24);
  
    const timeString = [hours, minutes, seconds]
      .map((value) => value < 10 ? `0${value}` : `${value}`)
      .join(':');
  
    return timeString;
  }
  

const bot = new Telegraf(bot_token)

bot.command('start', async(lol) => {
    user = tele.getUser(lol.message.from)
    await relay.start(lol, user.full_name)
    await lol.deleteMessage()
})

bot.command('help', async(lol) => {
    user = tele.getUser(lol.message.from)
    await relay.help(lol, user.full_name, lol.message.from.id.toString())
})

bot.on("callback_query", async(lol) => {
    cb_data = lol.callbackQuery.data.split("-")
    user_id = Number(cb_data[1])
    if (lol.callbackQuery.from.id != user_id) return lol.answerCbQuery("Sorry, You do not have the right to access this button.", { show_alert: true })
    callback_data = cb_data[0]
    user = tele.getUser(lol.callbackQuery.from)
    const isGroup = lol.chat.type.includes("group")
    const groupName = isGroup ? lol.chat.title : ""
    if (!isGroup) console.log(chalk.whiteBright("├"), chalk.cyanBright("[ ACTIONS ]"), chalk.whiteBright(callback_data), chalk.greenBright("from"), chalk.whiteBright(user.full_name))
    if (isGroup) console.log(chalk.whiteBright("├"), chalk.cyanBright("[ ACTIONS ]"), chalk.whiteBright(callback_data), chalk.greenBright("from"), chalk.whiteBright(user.full_name), chalk.greenBright("in"), chalk.whiteBright(groupName))
    if (callback_data == "help" || callback_data == "helpto") return await relay[callback_data](lol, user.full_name, user_id)
    await relay[callback_data](lol, user_id.toString())
})

bot.on("message", async(lol) => {
    try {
        const body = lol.message.text || lol.message.caption || ""
        comm = body.trim().split(" ").shift().toLowerCase()
        cmd = false
        if (prefix != "" && body.startsWith(prefix)) {
            cmd = true
            comm = body.slice(1).trim().split(" ").shift().toLowerCase()
        }
        const command = comm
        const args = await tele.getArgs(lol)
        const user = tele.getUser(lol.message.from)

        const reply = async(text) => {
            for (var x of range(0, text.length, 4096)) {
                return await lol.replyWithMarkdown(text.substr(x, 4096), { disable_web_page_preview: true })
            }
        }

        const isCmd = cmd
        const isGroup = lol.chat.type.includes("group")
        const groupName = isGroup ? lol.chat.title : ""

        const isImage = lol.message.hasOwnProperty("photo")
        const isVideo = lol.message.hasOwnProperty("video")
        const isAudio = lol.message.hasOwnProperty("audio")
        const isSticker = lol.message.hasOwnProperty("sticker")
        const isContact = lol.message.hasOwnProperty("contact")
        const isLocation = lol.message.hasOwnProperty("location")
        const isDocument = lol.message.hasOwnProperty("document")
        const isAnimation = lol.message.hasOwnProperty("animation")
        const isMedia = isImage || isVideo || isAudio || isSticker || isContact || isLocation || isDocument || isAnimation

        const quotedMessage = lol.message.reply_to_message || {}
        const isQuotedImage = quotedMessage.hasOwnProperty("photo")
        const isQuotedVideo = quotedMessage.hasOwnProperty("video")
        const isQuotedAudio = quotedMessage.hasOwnProperty("audio")
        const isQuotedSticker = quotedMessage.hasOwnProperty("sticker")
        const isQuotedContact = quotedMessage.hasOwnProperty("contact")
        const isQuotedLocation = quotedMessage.hasOwnProperty("location")
        const isQuotedDocument = quotedMessage.hasOwnProperty("document")
        const isQuotedAnimation = quotedMessage.hasOwnProperty("animation")
        const isQuoted = lol.message.hasOwnProperty("reply_to_message")

        var typeMessage = body.substr(0, 50).replace(/\n/g, '')
        if (isImage) typeMessage = "Image"
        else if (isVideo) typeMessage = "Video"
        else if (isAudio) typeMessage = "Audio"
        else if (isSticker) typeMessage = "Sticker"
        else if (isContact) typeMessage = "Contact"
        else if (isLocation) typeMessage = "Location"
        else if (isDocument) typeMessage = "Document"
        else if (isAnimation) typeMessage = "Animation"

        if (!isGroup && !isCmd) console.log(chalk.whiteBright("├"), chalk.cyanBright("[ PRIVATE ]"), chalk.whiteBright(typeMessage), chalk.greenBright("from"), chalk.whiteBright(user.full_name))
        if (isGroup && !isCmd) console.log(chalk.whiteBright("├"), chalk.cyanBright("[  GROUP  ]"), chalk.whiteBright(typeMessage), chalk.greenBright("from"), chalk.whiteBright(user.full_name), chalk.greenBright("in"), chalk.whiteBright(groupName))
        if (!isGroup && isCmd) console.log(chalk.whiteBright("├"), chalk.cyanBright("[ COMMAND ]"), chalk.whiteBright(typeMessage), chalk.greenBright("from"), chalk.whiteBright(user.full_name))
        if (isGroup && isCmd) console.log(chalk.whiteBright("├"), chalk.cyanBright("[ COMMAND ]"), chalk.whiteBright(typeMessage), chalk.greenBright("from"), chalk.whiteBright(user.full_name), chalk.greenBright("in"), chalk.whiteBright(groupName))

        var file_id = ""
        if (isQuoted) {
            file_id = isQuotedImage ? lol.message.reply_to_message.photo[lol.message.reply_to_message.photo.length - 1].file_id :
                isQuotedVideo ? lol.message.reply_to_message.video.file_id :
                isQuotedAudio ? lol.message.reply_to_message.audio.file_id :
                isQuotedDocument ? lol.message.reply_to_message.document.file_id :
                isQuotedAnimation ? lol.message.reply_to_message.animation.file_id : ""
        }
        var mediaLink = file_id != "" ? await tele.getLink(file_id) : ""

        switch (command) {
            case 'help':
                await relay.help(lol, user.full_name, lol.message.from.id.toString())
                break
            case 'helpto':
                await relay.helpto(lol, user.full_name, lol.message.from.id.toString())
                break
            case 'helpdev':
                await relay.helpdev(lol, user.full_name, lol.message.from.id.toString())
                break
            case 'playhere':
                try{
                if (args.length == 0) return await reply(`Example: ${prefix + command} `)
				query = args.join(' ')
                const getquery = await axios.get(`https://api.lolhuman.xyz/api/ytsearch?apikey=RuiWithTier&query=${query}`)
                const getIDyt = getquery.data.result[0].videoId
                const serverplaying = await axios.get(`https://api.lolhuman.xyz/api/ytaudio?apikey=RuiWithTier&url=https://www.youtube.com/watch?v=${getIDyt}`)
                const collectdataplay = serverplaying.data.result

                const TXTPLAY = `
            [YT PLAY]

*Title :* ${collectdataplay.title}
*Uploader :* ${collectdataplay.uploader}
*Duration :* ${collectdataplay.duration}
*Bitrate :* 128bit
*Size :* ${collectdataplay.link.size}

wait until audio sending...
`
                    await lol.replyWithPhoto({ url: collectdataplay.thumbnail }, { caption: TXTPLAY })
                    await lol.replyWithAudio({ url: collectdataplay.link.link }, { title: collectdataplay.title, thumb: collectdataplay.thumbnail })
                } catch (err){
                    lol.reply('Not Found, try other title')
                    console.log(err)
                }
                break

            case 'playbin':
                try{
                    if (args.length == 0) return await reply(`Example: ${prefix + command} `)
                    query = args.join(' ')
                    const getquery = await axios.get(`https://api.lolhuman.xyz/api/ytsearch?apikey=RuiWithTier&query=${query}`)
                    const getIDyt = getquery.data.result[0].videoId
                    const serverplaying = await axios.get(`https://api.lolhuman.xyz/api/ytaudio?apikey=RuiWithTier&url=https://www.youtube.com/watch?v=${getIDyt}`)
                    const collectdataplay = serverplaying.data.result
                    const TXTPLAY = `
            [YT PLAY]

*Title :* ${collectdataplay.title}
*Uploader :* ${collectdataplay.uploader}
*Duration :* ${collectdataplay.duration}
*Bitrate :* 128
*Size :* ${collectdataplay.link.size}

Music Injected at Blynk API...
`
                            await lol.replyWithPhoto({ url: collectdataplay.thumbnail }, { caption: TXTPLAY })
                            const LINKAUDIOYT = collectdataplay.link.link
                            const injecturlyt = await axios.get(`https://${config.serverb}/external/api/batch/update?token=${config.tokenb}&V0=1&V1=${LINKAUDIOYT}`)
                            console.log(`Injected ${LINKAUDIOYT} at blynk API`)
                            //tobz.reply(from, `Music Injected at blynk API`, id)
                            await sleep(60000) 
                            const reinjecturlyt = await axios.get(`https://${config.serverb}/external/api/batch/update?token=${config.tokenb}&V0=0&V1=`)
                            console.log(`Switch off/reinjected`)
                            lol.reply(`Music Reinjected at blynk API`)
                } catch (err){
                    lol.reply('something error')
                    console.log(err)
                }

            case 'spotifysearch':
                try{
                    if (args.length == 0) return await reply(`Example: ${prefix + command} `)
                    query = args.join(' ')
                    const dataplai = await axios.get(`https://api.lolhuman.xyz/api/spotifysearch?apikey=RuiWithTier&query=${query}`)
                    const dataplay = dataplai.data
                    let keluarplay = `「 SPOTIFY SEARCH 」\n\nHasil Pencarian : ${query}\n`
                    for (let i = 0; i < dataplay.result.length; i++) {
                        keluarplay += `\n─────────────────\n\n• *Title* : ${dataplay.result[i].title}\n• *Artis* : ${dataplay.result[i].artists}\n• *Durasi* : ${dataplay.result[i].duration} detik\n• *Link Track* : ${dataplay.result[i].link}\n`
                    }
                    await lol.reply(keluarplay)
                } catch (err){
                    console.log(err)
                }
            break

            case 'bin':
                try{
                    if(args[0].toLowerCase() === 'cek'){
                        const endpointcekbin = await fetch(`https://${blynk_serverr}/external/api/get?token=${blynk_tokenr}&V0&V1&V2&V3&V4&V5&V6&V7&V8`)
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
                        await lol.reply(text)
                    } else if(args[0].toLowerCase() === 'on'){
                        const endpointcekbin = await fetch(`https://${blynk_serverr}/external/api/get?token=${blynk_tokenr}&V0&V1`)
                        const cekbin = await endpointcekbin.json()
                        if (cekbin.V0.toString() === "1"){
                            text = `SmartBin sudah hidup`
                        } else {
                            await axios.get(`https://${blynk_serverr}/external/api/update?token=${blynk_tokenr}&V0=1`)
                            text = `SmartBin Berhasil dihidupkan!`
                        }
                        await lol.reply(text)
                    } else if(args[0].toLowerCase() === 'off'){
                        const endpointcekbin = await fetch(`https://${blynk_serverr}/external/api/get?token=${blynk_tokenr}&V0&V1`)
                        const cekbin = await endpointcekbin.json()
                        if (cekbin.V0.toString() === "0"){
                            text = `SmartBin sudah mati`
                        } else {
                            await axios.get(`https://${blynk_serverr}/external/api/update?token=${blynk_tokenr}&V0=0`)
                            text = `SmartBin Berhasil dimatikan!`
                        }
                        await lol.reply(text)
                    } else {
                        const commandbin =`
available commands :

bin cek
bin on
bin off
`
                        await lol.reply(commandbin)
                    }
                } catch(err){
                    const commandbin =`
available commands :

bin cek
bin on
bin off
`
                    console.log(err)
                    await lol.reply(commandbin)
                }
                break
            
            case 'change':
                try{
                    console.log(`changed : ${args[0]} -> ${args[1]}`)
                    if(args[0] === '1'){ //server relay
                        if(!args[1].includes('blynk.cloud')) return lol.reply('Server harus mengandung domain blynk.cloud')
                        const last_data = config.blynk_server
                        config.blynk_server = `${args[1]}`
                        blynk_server = `${args[1]}` 
                        fs.writeFileSync('./config.json', JSON.stringify(config))
                        text = `
Succes Changed Server Relay!
Last : ${last_data}
New : ${args[1]}
`
                        lol.reply(text)
                    } else if(args[0] === '2'){ //token relay
                        if(!args[1]) return lol.reply('harap masukkan token')
                        const last_data = config.blynk_token
                        config.blynk_token = `${args[1]}`
                        blynk_token = `${args[1]}` 
                        fs.writeFileSync('./config.json', JSON.stringify(setting))
                        text = `
Succes Changed Token Relay!
Last : ${last_data}
New : ${args[1]}
`
                        lol.reply(text)
                    } else if(args[0]  === '3'){ //server raspberry
                        if(!args[1].includes('blynk.cloud')) return lol.reply('Server harus mengandung domain blynk.cloud')
                        const last_data = config.blynk_serverr
                        config.blynk_serverr = `${args[1]}`
                        blynk_serverr = `${args[1]}` 
                        fs.writeFileSync('./config.json', JSON.stringify(config))
                        text = `
Succes Changed Server Raspberry!
Last : ${last_data}
New : ${args[1]}
`
                        lol.reply(text)
                    } else if(args[0]  === '4'){ //token raspberry
                        if(!args[1]) return lol.reply('harap masukkan token')
                        const last_data = config.blynk_tokenr
                        config.blynk_tokenr = `${args[1]}`
                        blynk_tokenr = `${args[1]}` 
                        fs.writeFileSync('./config.json', JSON.stringify(setting))
                        text = `
Succes Changed Token Raspberry!
Last : ${last_data}
New : ${args[1]}
`
                        lol.reply(text)
                    } else if(args[0] === '5'){ //server bot
                        if(!args[1].includes('blynk.cloud')) return lol.reply('Server harus mengandung domain blynk.cloud')
                        const last_data = config.blynk_serverb
                        config.blynk_serverb = `${args[1]}`
                        blynk_serverb = `${args[1]}` 
                        fs.writeFileSync('./config.json', JSON.stringify(config))
                        text = `
Succes Changed Server Bot!
Last : ${last_data}
New : ${args[1]}
`
                        lol.reply(text)
                    } else if(args[0]  === '6'){ //token bot
                        if(!args[1]) return lol.reply('harap masukkan token')
                        const last_data = config.blynk_tokenb
                        config.blynk_tokenb = `${args[1]}`
                        blynk_tokenb = `${args[1]}` 
                        fs.writeFileSync('./config.json', JSON.stringify(setting))
                        text = `
Succes Changed Token Bot!
Last : ${last_data}
New : ${args[1]}
`
                        lol.reply(text)
                    } else {
                        lol.reply('bad requestS')
                    }
                } catch (err){
                    lol.reply(err)
                    console.log(err)
                }
            break

            case 'infoapi':
                prefix = config.prefix

                const getcheckingAPI = await axios.get(`https://api.lolhuman.xyz/api/checkapikey?apikey=RuiWithTier`)
                const getinfoAPI = getcheckingAPI.data.result
            
                text = `
API USAGE INFORMATION :

- Username : ${getinfoAPI.username}
- Today Request : ${getinfoAPI.today}
- Total Request : ${getinfoAPI.requests}
- Account Type : ${getinfoAPI.account_type}
- Expired : ${getinfoAPI.expired}
`
                await lol.reply(text)
            break

            case 'relay': //IoT Function
            try{
                if (args[0].toLowerCase() === 'cek') {
                    const cekrelay = await fetchJson(`https://${blynk_server}/external/api/get?token=${blynk_token}&V1&V2&V3&V4&V5&V6&V7&V8`)
                    const cekmcu = await fetchJson(`https://${blynk_server}/external/api/isHardwareConnected?token=${blynk_token}`)
                    console.log(cekmcu)
                    if (cekmcu === true){
                        var nodemcustat = `Online`
                    } else if (cekmcu === false){
                        var nodemcustat = `offline`    
                    } else {
                        var nodemcustat = `Device Not Installed`
                    }
                    if (cekrelay.V1 === 1){
                        var V1stat = `Hidup`
                    } else if (cekrelay.V1 === 0){
                        var V1stat = `Mati`
                    } else {
                        var V1stat = `Pin Tidak Terdeteksi`
                    }
                    if (cekrelay.V2 === 1){
                        var V2stat = `Hidup`
                    } else if (cekrelay.V2 === 0){
                        var V2stat = `Mati`
                    } else {
                        var V2stat = `Pin Tidak Terdeteksi`
                    }
                    if (cekrelay.V3 === 1){
                        var V3stat = `Hidup`
                    } else if (cekrelay.V3 === 0){
                        var V3stat = `Mati`
                    } else {
                        var V3stat = `Pin Tidak Terdeteksi`
                    }
                    if (cekrelay.V4 === 1){
                        var V4stat = `Hidup`
                    } else if (cekrelay.V4 === 0){
                        var V4stat = `Mati`
                    } else {
                        var V4stat = `Pin Tidak Terdeteksi`
                    }
                    if (cekrelay.V5 === 1){
                        var V5stat = `Hidup`
                    } else if (cekrelay.V5 === 0){
                        var V5stat = `Mati`
                    } else {
                        var V5stat = `Pin Tidak Terdeteksi`
                    }
                    if (cekrelay.V6 === 1){
                        var V6stat = `Hidup`
                    } else if (cekrelay.V6 === 0){
                        var V6stat = `Mati`
                    } else {
                        var V6stat = `Pin Tidak Terdeteksi`
                    }
                    if (cekrelay.V7 === 1){
                        var V7stat = `Hidup`
                    } else if (cekrelay.V7 === 0){
                        var V7stat = `Mati`
                    } else {
                        var V7stat = `Pin Tidak Terdeteksi`
                    }
                    if (cekrelay.V8 === 1){
                        var V8stat = `Hidup`
                    } else if (cekrelay.V8 === 0){
                        var V8stat = `Mati`
                    } else {
                        var V8stat = `Pin Tidak Terdeteksi`
                    }
const Vall = `
NODEMCU : ${nodemcustat}

RELAY STATUS :
Relay 1 : ${V1stat}
Relay 2 : ${V2stat}
Relay 3 : ${V3stat}
Relay 4 : ${V4stat}
Relay 5 : ${V5stat}
Relay 6 : ${V6stat}
Relay 7 : ${V7stat}
Relay 8 : ${V8stat}
`
                    await reply(Vall)
                } else if (args[0].toLowerCase() === 'on') {    
                    const ONall = await axios.get(`https://${blynk_server}/external/api/batch/update?token=${blynk_token}&V1=1&V2=1&V3=1&V4=1&V5=1&V6=1&V7=1&V8=1`)
                    await reply(`Semua Relay Dinyalakan!`)
                } else if (args[0].toLowerCase() === 'off') {
                    const OFFall = await axios.get(`https://${blynk_server}/external/api/batch/update?token=${blynk_token}&V1=0&V2=0&V3=0&V4=0&V5=0&V6=0&V7=0&V8=0`)
                    await reply(`Semua Relay Dimatikan!`)
                } else if (args[0].toLowerCase() === '1') {
                    if (args[1].toLowerCase() === 'on'){
                        const V1on = await axios.get(`https://${blynk_server}/external/api/update?token=${blynk_token}&V${args[0]}=${on_value}`)
                        await reply(`Relay 1 On!`)
                    } else if (args[1].toLowerCase() === 'off'){
                        const V1off = await axios.get(`https://${blynk_server}/external/api/update?token=${blynk_token}&V${args[0]}=${off_value}`)
                        await reply(`Relay 1 Off!`)
                    } else {
                        await reply(`Option : On/Off\nExample : relay 1 on`)
                    }
                } else if (args[0].toLowerCase() === '2') {
                    if (args[1].toLowerCase() === 'on'){
                        const V2on = await axios.get(`https://${blynk_server}/external/api/update?token=${blynk_token}&V${args[0]}=${on_value}`)
                        await reply(`Relay 2 On!`)
                    } else if (args[1].toLowerCase() === 'off'){
                        const V2off = await axios.get(`https://${blynk_server}/external/api/update?token=${blynk_token}&V${args[0]}=${off_value}`)
                        await reply(`Relay 2 Off!`)
                    } else {
                        await reply(`Option : On/Off\nExample : relay 2 on`)
                    }
                } else if (args[0].toLowerCase() === '3') {
                    if (args[1].toLowerCase() === 'on'){
                        const V3on = await axios.get(`https://${blynk_server}/external/api/update?token=${blynk_token}&V${args[0]}=${on_value}`)
                        await reply(`Relay 3 On!`)
                    } else if (args[1].toLowerCase() === 'off'){
                        const V3off = await axios.get(`https://${blynk_server}/external/api/update?token=${blynk_token}&V${args[0]}=${off_value}`)
                        await reply(`Relay 3 Off!`)
                    } else {
                        await reply(`Option : On/Off\nExample : relay 3 on`)
                    }
                } else if (args[0].toLowerCase() === '4') {
                    if (args[1].toLowerCase() === 'on'){
                        const V4on = await axios.get(`https://${blynk_server}/external/api/update?token=${blynk_token}&V${args[0]}=${on_value}`)
                        await reply(`Relay 4 On!`)
                    } else if (args[1].toLowerCase() === 'off'){
                        const V4off = await axios.get(`https://${blynk_server}/external/api/update?token=${blynk_token}&V${args[0]}=${off_value}`)
                        await reply(`Relay 4 Off!`)
                    } else {
                        await reply(`Option : On/Off\nExample : relay 4 on`)
                    }
                } else if (args[0].toLowerCase() === '5') {
                    if (args[1].toLowerCase() === 'on'){
                        const V5on = await axios.get(`https://${blynk_server}/external/api/update?token=${blynk_token}&V${args[0]}=${on_value}`)
                        await reply(`Relay 5 On!`)
                    } else if (args[1].toLowerCase() === 'off'){
                        const V5off = await axios.get(`https://${blynk_server}/external/api/update?token=${blynk_token}&V${args[0]}=${off_value}`)
                        await reply(`Relay 5 Off!`)
                    } else {
                        await reply(`Option : On/Off\nExample : relay 5 on`)
                    }
                } else if (args[0].toLowerCase() === '6') {
                    if (args[1].toLowerCase() === 'on'){
                        const V6on = await axios.get(`https://${blynk_server}/external/api/update?token=${blynk_token}&V${args[0]}=${on_value}`)
                        await reply(`Relay 6 On!`)
                    } else if (args[1].toLowerCase() === 'off'){
                        const V6off = await axios.get(`https://${blynk_server}/external/api/update?token=${blynk_token}&V${args[0]}=${off_value}`)
                        await reply(`Relay 6 Off!`)
                    } else {
                        await reply(`Option : On/Off\nExample : relay 6 on`)
                    }
                } else if (args[0].toLowerCase() === '7') {
                    if (args[1].toLowerCase() === 'on'){
                        const V7on = await axios.get(`https://${blynk_server}/external/api/update?token=${blynk_token}&V${args[0]}=${on_value}`)
                        await reply(`Relay 7 On!`)
                    } else if (args[1].toLowerCase() === 'off'){
                        const V7off = await axios.get(`https://${blynk_server}/external/api/update?token=${blynk_token}&V${args[0]}=${off_value}`)
                        await reply(`Relay 7 Off!`)
                    } else {
                        await reply(`Option : On/Off\nExample : relay 7 on`)
                    }
                } else if (args[0].toLowerCase() === '8') {
                    if (args[1].toLowerCase() === 'on'){
                        const V8on = await axios.get(`https://${blynk_server}/external/api/update?token=${blynk_token}&V${args[0]}=${on_value}`)
                        await reply(`Relay 8 On!`)
                    } else if (args[1].toLowerCase() === 'off'){
                        const V8off = await axios.get(`https://${blynk_server}/external/api/update?token=${blynk_token}&V${args[0]}=${off_value}`)
                        await reply(`Relay 8 Off!`)
                    } else {
                        await reply(`Option : On/Off\nExample : relay 8 on`)
                    }
                } else {
const commandrelay =`
available commands :

relay cek
relay on
relay off
relay 1-8 on/off
`
                    await reply(commandrelay)
                }             
            } catch(err) {
                console.log(err)
const commandrelay =`
available commands :

relay cek
relay on
relay off
relay 1-8 on/off
                `
            await reply(commandrelay)  
            }
            break
            default:
                if (!isGroup && !isCmd && !isMedia) {
                    await reply(`Use /help for command`)
                }
        }
    } catch (e) {
        console.log(chalk.whiteBright("├"), chalk.cyanBright("[  ERROR  ]"), chalk.redBright(e))
    }
})

bot.launch()
bot.telegram.getMe().then((getme) => {
    itsPrefix = (prefix != "") ? prefix : "No Prefix"
    console.log(chalk.greenBright(' ===================================================='))
    console.log(chalk.greenBright(" │ + Owner    : " + owner || ""))
    console.log(chalk.greenBright(" │ + Bot Name : " + getme.first_name || ""))
    console.log(chalk.greenBright(" │ + Version  : " + version || ""))
    console.log(chalk.greenBright(" │ + Host     : " + os.hostname() || ""))
    console.log(chalk.greenBright(" │ + Platfrom : " + os.platform() || ""))
    console.log(chalk.greenBright(" │ + Prefix   : " + itsPrefix))
    console.log(chalk.greenBright(' ===================================================='))
    console.log(chalk.whiteBright('╭─── [ LOG ]'))
})

//CRONJOB PERGANTIAN VALUE ONLINE/OFFLINE

let prevdataon = null;
let cronJobOn = null;


cronJobOn = cron.schedule('*/5 * * * * *', async (lol) => {
    try {
        axios.get(`https://${blynk_serverr}/external/api/isHardwareConnected?token=${blynk_tokenr}`)
            .then(async response => {
                const data = response.data;
                const newDataon = Boolean(data);
        

                if(newDataon === true){
                    const endpointcekbin = await fetch(`https://${blynk_serverr}/external/api/get?token=${blynk_tokenr}&V0&V1&V2&V3&V4&V5&V6&V7&V8&V9`)
                    const cekbin = await endpointcekbin.json()
                    if (cekbin.V0.toString() === "1"){
                        var binstat = `ON` 
                    } else {
                        var binstat = `OFF`
                    }

                    if (cekbin.V9.toString() === "1"){
                        var resetcount = `in reset`
                    } else {
                        var resetcount = `counting`
                    }

                    const datadistancedalam = cekbin.V1
                    const datadistancetutup =  cekbin.V2
                    const datadistancedepan = cekbin.V3
                    const datacounter = cekbin.V4.split("|")
                    const datatemperature = cekbin.V5
                    const datahumidity = cekbin.V6
                    const datamoving = cekbin.V7.split("|")
                    const datalevel = cekbin.V8

const Vall = `
\n____________[${date} - ${time}]___________

----> Device Online

-> Status Switch : ${binstat}
-> On Auto Mode : ${datacounter[1]}
-> Tank Level : ${datalevel}
-> Distance Dalam: ${datadistancedalam}
-> Distance Tutup: ${datadistancetutup}
-> Distance Depan: ${datadistancedepan}
-> Counter (index): ${datacounter[0]} (${resetcount})
-> Value Right : ${datamoving[0]}
-> Value Center : ${datamoving[1]}
-> Value Left : ${datamoving[2]}
-> Index Moving : ${datamoving[3]}
-> Temperature: ${datatemperature}
-> Humidity: ${datahumidity}
________________________________________
`

                    fs.appendFileSync('./lib/database/datasensor.txt', Vall);
                
                }

        if (newDataon !== prevdataon) {
            prevdataon = newDataon;
            
            if (newDataon === true) {
            console.log('Device: Online');
            //await relay.helponline(lol, user.full_name, lol.message.from.id.toString())
            } else if (newDataon === false) {
            console.log('Device: Offline');
            await axios.get(`https://${blynk_serverr}/external/api/update?token=${blynk_tokenr}&V0=0`)
            //await relay.helpoffline(lol, user.full_name, lol.message.from.id.toString())
            }
        }
    })
    } catch (error) {
    console.error('Terjadi kesalahan:', error.message);
    }
});

 //CRONJOB PERGANTIAN VALUE SWITCH

 let prevdataswitch = null;
 let cronJobOnSwitch = null;

        
 let prevSwitchTime = null; 


cronJobOnSwitch = cron.schedule('*/5 * * * * *', async () => {
  try {
    const endpointcekbin = await fetch(`https://${blynk_serverr}/external/api/get?token=${blynk_tokenr}&V0&V1`);
    const cekbin = await endpointcekbin.json();

    if (cekbin.V0 !== prevdataswitch) {
      prevdataswitch = cekbin.V0;

      const currentTime = new Date(); 

      let logText = '';
      let durationText = '';

      if (cekbin.V0 === 1) {
        console.log('Switch: Turn On');

        if (prevSwitchTime) {
          const duration = currentTime - prevSwitchTime; 
          const thetime = convertMilisecondsToTime(duration)
          console.log('Durasi Terakhir On:', thetime);
          durationText = `Durasi Terakhir On: ${thetime}`;
        }
        logText = `\n--> [${date} - ${time}] Switch On, `;
        //await relay.binon(lol, user.full_name, lol.message.from.id.toString());
      } else if (cekbin.V0 === 0) {
        console.log('Switch: Turn Off');
        if (prevSwitchTime) {
          const duration = currentTime - prevSwitchTime; 
          const thetime = convertMilisecondsToTime(duration)
          console.log('Durasi Terakhir Off:', thetime);
          durationText = `Durasi Terakhir Off: ${thetime}`;
        }
        logText = `\n--> [${date} - ${time}] Switch Off, `;
        //await relay.binoff(lol, user.full_name, lol.message.from.id.toString());
      }

      prevSwitchTime = currentTime; 

      const logEntry = `${logText} ${durationText}`;
      fs.appendFileSync('./lib/database/logswitch.txt', logEntry);
    }

  } catch (error) {
    console.error('Terjadi kesalahan:', error.message);
  }
});


//CRONJOB PERGANTIAN COUNTER

let previousCounter = null;
let cronjobCounter = null;

cronjobCounter = cron.schedule('*/5 * * * * *', async () => {
  try {
    const response = await axios.get(`https://${blynk_serverr}/external/api/get?token=${blynk_tokenr}&V1&V4&V8`);
    const data = response.data;

    const dataCount = data.V4.split("|");
    const counter = dataCount[0];
    const jarak = data.V1;
    const tankLevel = data.V8;

    if (counter !== previousCounter) {
      previousCounter = counter;

      const time = new Date().toISOString();
      const logEntry = `[${time}] opened in: ${counter} | distance: ${jarak} | capacity: ${tankLevel}`;

      fs.appendFileSync('./lib/database/logcount.txt', `\n--> ${logEntry}`);
      console.log('Data saved:', logEntry);
    }
  } catch (error) {
    console.error('Terjadi kesalahan:', error.message);
  }
});


//function totally stop
process.once('SIGINT', () => {
    console.log('Proses dihentikan secara manual');
    cronJobOn.stop();
    cronJobOnSwitch.stop();
    cronjobCounter.stop();
    bot.stop('SIGINT')
    process.exit();
  });
  
  process.once('SIGTERM', () => {
    console.log('Proses dihentikan oleh sinyal SIGTERM');
    cronJobOn.stop();
    cronJobOnSwitch.stop();
    cronjobCounter.stop();
    bot.stop('SIGTERM')
    process.exit();
  });


/*
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
*/