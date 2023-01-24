/* eslint-disable @typescript-eslint/no-explicit-any */
import gptCommand from '../commands/gpt'
import menuCommand from '../commands/menu'
import ownerCommand from '../commands/owner'
import { img, video } from '../commands/sticker'
import getRandomTips from '../commands/tips'
import config from '../configs/config'
import userData from './register'
import regUser from './register'
import * as respond from './respond'

const prefix = config.botConfig.prefix
const owner = config.botConfig.ownerNumber

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
        const isStatus = sender === 'status@broadcast'
        const content = JSON.stringify(msg.message)
        const isImage = (type == 'imageMessage')
        const isVideo = (type == 'videoMessage')
        const isQuotedMsg = (type == 'extendedTextMessage')
        const isQuotedImage = isQuotedMsg ? content.includes('imageMessage') ? true : false : false
        const isQuotedVideo = isQuotedMsg ? content.includes('videoMessage') ? true : false : false
        const emote = { react: { text: "", key: msg.key } }

        //read message
        const readMsg = {
            remoteJid: from,
            id: msgId,
            participant: sender ? sender : undefined
        }
        await sock.readMessages([readMsg])

        //register user
        if (!isUser && !isGroup) { //user not registered and not in group
            if (isStatus) return
            await regUser(msg, sock, from, pushname, isOwner, sender)
            sock.sendMessage(from, { text: respond.welcome(pushname) }, { quoted: msg })
            await menuCommand(msg, sock)
        }

        if (!isUser && isGroup) { //user not registered and in group
            if (isStatus) return
            if (isCmd || isMenu) { //only register user if command or menu is used
                await regUser(msg, sock, from, pushname, isOwner, sender)
                sock.sendMessage(from, { text: respond.welcome(pushname) }, { quoted: msg })
                await menuCommand(msg, sock)
            }
        }

        //auto sticker
        if (isImage && !isGroup && isUser && !isCmd) {
            await img(msg, sock)
        }
        if (isVideo && !isGroup && isUser && !isCmd) {
            await video(msg, sock)
        }

        //auto reply some message
        if (isUser && command.toLowerCase() === "assalamualaikum" ||
            command.toLowerCase() === "assalamu'alaikum"
        ) {
            if (!isUser) {
                await regUser(msg, sock, from, pushname, isOwner, sender)
                sock.sendMessage(from, { text: respond.welcome(pushname) }, { quoted: msg })
                await menuCommand(msg, sock)
            }
            emote.react.text = "🙏"
            await sock.sendMessage(from, { text: respond.salam }, { quoted: msg })
            await sock.sendMessage(from, emote)
            return
        }
        if (isUser && command.toLowerCase() === "hai") {
            if (!isUser) {
                await regUser(msg, sock, from, pushname, isOwner, sender)
                sock.sendMessage(from, { text: respond.welcome(pushname) }, { quoted: msg })
                await menuCommand(msg, sock)
            }
            emote.react.text = "👋"
            await sock.sendMessage(from, { text: respond.hai + ` ${pushname}!` }, { quoted: msg })
            await sock.sendMessage(from, emote)
            return
        }
        if (isUser && command.toLowerCase() === "p") {
            if (!isUser) {
                await regUser(msg, sock, from, pushname, isOwner, sender)
                sock.sendMessage(from, { text: respond.welcome(pushname) }, { quoted: msg })
                await menuCommand(msg, sock)
            }
            emote.react.text = "😡"
            await sock.sendMessage(from, { text: respond.gakSopan }, { quoted: msg })
            await sock.sendMessage(from, emote)
            return
        }

        //command handler
        if (isUser && isCmd || isMenu) {
            switch (command || isMenu) {
                case `${prefix}menu`:
                case `${prefix}help`:
                case `${prefix}list`:
                    emote.react.text = "📖"
                    await menuCommand(msg, sock)
                    await sock.sendMessage(from, emote)

                    break

                case `${prefix}tips`:
                    emote.react.text = "💡"
                    await sock.sendMessage(from, { text: getRandomTips() }, { quoted: msg })
                    await sock.sendMessage(from, emote)
                    break

                case `${prefix}sticker`:
                case `${prefix}stiker`:
                case `${prefix}s`:
                    if (isImage || isQuotedImage) {
                        emote.react.text = "🖼️"
                        await img(msg, sock)
                        await sock.sendMessage(from, emote)
                    }
                    else if (isVideo || isQuotedVideo) {
                        emote.react.text = "🎞️"
                        await video(msg, sock)
                        await sock.sendMessage(from, emote)
                    }
                    else {
                        emote.react.text = "❗"
                        await sock.sendMessage(from, { text: respond.stickerCommand }, { quoted: msg })
                        await sock.sendMessage(from, emote)
                    }
                    break

                case `${prefix}owner`:
                    emote.react.text = "👑"
                    await ownerCommand(msg, sock)
                    await sock.sendMessage(from, emote)
                    break

                case `${prefix}gpt`:
                    emote.react.text = "🤖"
                    gptCommand(msg, sock, chats, from)
                    await sock.sendMessage(from, emote)
                    break

                case `${prefix}delete`:
                case `${prefix}del`:
                case `${prefix}d`:
                    if (isOwner) {
                        if (isQuotedMsg) {
                            emote.react.text = "🗑️"
                            await sock.sendMessage(from, { delete: { remoteJid: from, fromMe: true, id: msg.message.extendedTextMessage.contextInfo.stanzaId } }, { quoted: msg })
                            await sock.sendMessage(from, emote)
                        }
                        else {
                            emote.react.text = "❗"
                            await sock.sendMessage(from, { text: respond.deleteCommand }, { quoted: msg })
                            await sock.sendMessage(from, emote)
                        }
                    }
                    else {
                        emote.react.text = "🤣"
                        await sock.sendMessage(from, { text: respond.notOwner }, { quoted: msg })
                        await sock.sendMessage(from, emote)
                    }
                    break

                default:
                    emote.react.text = "❗"
                    await sock.sendMessage(from, { text: respond.defaultRespond }, { quoted: msg })
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