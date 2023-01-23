import fs from 'fs'

import gptCommand from '../commands/gpt'
import menuCommand from '../commands/menu'
import ownerCommand from '../commands/owner'
import { img, video } from '../commands/sticker'
import getRandomTips from '../commands/tips'
import config from '../configs/config'
import * as respond from './respond'

const prefix = config.botConfig.prefix
const owner = config.botConfig.ownerNumber

const userDataPath = './database/userData.json'
if (!fs.existsSync('./database')) {
    fs.mkdirSync('./database')
}
if (!fs.existsSync(userDataPath))
    fs.writeFileSync(userDataPath, JSON.stringify({}, null, 2))


const userData = JSON.parse(fs.readFileSync('./database/userData.json').toString())

const messageListener = async (m: any, sock: any) => {
    try {
        const msg = m.messages[0]
        const from = msg.key.remoteJid
        const pushname = msg.pushName
        const type = Object.keys(msg.message)[0]
        const chats = (type === 'conversation' && msg.message.conversation) ? msg.message.conversation : (type == 'imageMessage') && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : (type == 'documentMessage') && msg.message.documentMessage.caption ? msg.message.documentMessage.caption : (type == 'videoMessage') && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : (type == 'extendedTextMessage') && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : (type == 'buttonsResponseMessage' && msg.message.buttonsResponseMessage.selectedButtonId) ? msg.message.buttonsResponseMessage.selectedButtonId : (type == 'templateButtonReplyMessage') && msg.message.templateButtonReplyMessage.selectedId ? msg.message.templateButtonReplyMessage.selectedId : ''
        const msgId = msg.key.id
        const isMenu = msg?.message?.listResponseMessage?.singleSelectReply?.selectedRowId;
        const isGroup = from.endsWith('@g.us')
        const sender = isGroup ? (msg.key.participant ? msg.key.participant : msg.participant) : from
        const command = chats.toLowerCase().split(' ')[0] || ''
        const isCmd = command.startsWith(prefix)
        const isOwner = sender === owner + '@s.whatsapp.net'
        const isUser = sender in userData
        const content = JSON.stringify(msg.message)
        const isImage = (type == 'imageMessage')
        const isVideo = (type == 'videoMessage')
        const isQuotedMsg = (type == 'extendedTextMessage')
        const isQuotedImage = isQuotedMsg ? content.includes('imageMessage') ? true : false : false
        const isQuotedVideo = isQuotedMsg ? content.includes('videoMessage') ? true : false : false
        const emote = { react: { text: "", key: msg.key } }

        //register user
        if (!isUser && !isGroup) {
            userData[sender] = {
                name: pushname,
                number: sender.split('@')[0],
                owner: isOwner
            }
            fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2))
            sock.sendMessage(from, { text: respond.welcome(pushname) }, { quoted: msg })
            await menuCommand(msg, sock)
        }

        if (!isUser && isGroup) {
            if (isCmd || isMenu) {
                userData[sender] = {
                    name: pushname,
                    phoneNumber: sender.split('@')[0],
                    owner: isOwner
                }
                fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2))
                await sock.sendMessage(from, { text: respond.welcome(pushname) }, { quoted: msg })
                await menuCommand(msg, sock)
            }
        }

        //auto sticker
        if (isImage && !isGroup && isUser) {
            await img(msg, sock)
        }
        if (isVideo && !isGroup && isUser) {
            await video(msg, sock)
        }

        if (isUser && command.toLowerCase() === "assalamualaikum" ||
            command.toLowerCase() === "assalamu'alaikum"
        ) {
            await sock.sendMessage(from, { text: respond.salam }, { quoted: msg })
            emote.react.text = "🙏"
            await sock.sendMessage(from, emote)
            return
        }
        if (isUser && command.toLowerCase() === "hai") {
            await sock.sendMessage(from, { text: respond.hai + ` ${pushname}!` }, { quoted: msg })
            emote.react.text = "👋"
            await sock.sendMessage(from, emote)
            return
        }
        if (isUser && command.toLowerCase() === "p") {
            await sock.sendMessage(from, { text: respond.gakSopan }, { quoted: msg })
            emote.react.text = "😡"
            await sock.sendMessage(from, emote)
            return
        }
        if (isUser && isCmd || isMenu) {
            switch (command || isMenu) {
                case `${prefix}menu`:
                case `${prefix}help`:
                case `${prefix}list`:
                    menuCommand(msg, sock)
                    emote.react.text = "📖"
                    await sock.sendMessage(from, emote)

                    break

                case `${prefix}tips`:
                    await sock.sendMessage(from, { text: getRandomTips() }, { quoted: msg })
                    emote.react.text = "💡"
                    await sock.sendMessage(from, emote)
                    break

                case `${prefix}sticker`:
                case `${prefix}stiker`:
                case `${prefix}s`:
                    if (isImage || isQuotedImage) {
                        img(msg, sock)
                        emote.react.text = "🖼️"
                        await sock.sendMessage(from, emote)
                    }
                    else if (isVideo || isQuotedVideo) {
                        video(msg, sock)
                        emote.react.text = "🎞️"
                        await sock.sendMessage(from, emote)
                    }
                    else {
                        sock.sendMessage(from, { text: respond.stickerCommand }, { quoted: msg })
                        emote.react.text = "❗"
                        await sock.sendMessage(from, emote)
                    }
                    break

                case `${prefix}owner`:
                    ownerCommand(msg, sock)
                    emote.react.text = "👑"
                    await sock.sendMessage(from, emote)
                    break

                case `${prefix}gpt`:
                    gptCommand(msg, sock, chats, from)
                    emote.react.text = "🤖"
                    await sock.sendMessage(from, emote)
                    break

                case `${prefix}delete`:
                case `${prefix}del`:
                case `${prefix}d`:
                    if (isOwner) {
                        if (isQuotedMsg) {
                            sock.sendMessage(from, { delete: { remoteJid: from, fromMe: true, id: msg.message.extendedTextMessage.contextInfo.stanzaId } }, { quoted: msg })
                            emote.react.text = "🗑️"
                            await sock.sendMessage(from, emote)
                        }
                        else {
                            sock.sendMessage(from, { text: respond.deleteCommand }, { quoted: msg })
                            emote.react.text = "❗"
                            await sock.sendMessage(from, emote)
                        }
                    }
                    else {
                        sock.sendMessage(from, { text: respond.notOwner }, { quoted: msg })
                        emote.react.text = "🤣"
                        await sock.sendMessage(from, emote)
                    }
                    break

                default:
                    sock.sendMessage(from, { text: respond.defaultRespond }, { quoted: msg })
                    emote.react.text = "❗"
                    await sock.sendMessage(from, emote)
                    break
            }
        }
    }
    catch (e) {
        console.log(e)
    }
}

export default messageListener