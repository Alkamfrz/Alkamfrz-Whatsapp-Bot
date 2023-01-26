/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";

import mainMenu from "../commands/mainMenu";
import regUser from "../utils/register";
import * as respond from "./respond";

const ansChat = async (msg: any, sock: any) => {
    const userData = JSON.parse(fs.readFileSync('./database/userData.json').toString())
    const from = msg.key.remoteJid
    const pushname = msg.pushName
    const type = Object.keys(msg.message)[0]
    const chats = (type === 'conversation' && msg.message.conversation) ? msg.message.conversation : (type == 'imageMessage') && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : (type == 'documentMessage') && msg.message.documentMessage.caption ? msg.message.documentMessage.caption : (type == 'videoMessage') && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : (type == 'extendedTextMessage') && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : (type == 'buttonsResponseMessage' && msg.message.buttonsResponseMessage.selectedButtonId) ? msg.message.buttonsResponseMessage.selectedButtonId : (type == 'templateButtonReplyMessage') && msg.message.templateButtonReplyMessage.selectedId ? msg.message.templateButtonReplyMessage.selectedId : ''
    const isGroup = from.endsWith('@g.us')
    const sender = isGroup ? (msg.key.participant ? msg.key.participant : msg.participant) : from
    const command = chats.toLowerCase().split(' ')[0] || ''
    const isUser = sender in userData
    const emote = { react: { text: "", key: msg.key } }

    switch (command.toLowerCase()) {
        case "assalamualaikum":
        case "assalamu'alaikum":
            if (!isUser) {
                await regUser(msg);
                await sock.sendMessage(from, { text: respond.welcome(pushname) }, { quoted: msg });
                await mainMenu(msg, sock);
                userData[sender] = { isUser: true };
            }
            emote.react.text = "🙏";
            await sock.sendMessage(from, { text: respond.salam }, { quoted: msg });
            await sock.sendMessage(from, emote);
            break;
        case "hai":
            if (!isUser) {
                await regUser(msg);
                await sock.sendMessage(from, { text: respond.welcome(pushname) }, { quoted: msg });
                await mainMenu(msg, sock);
                userData[sender] = { isUser: true };
            }
            emote.react.text = "👋";
            await sock.sendMessage(from, { text: respond.hai + ` ${pushname}!` }, { quoted: msg });
            await sock.sendMessage(from, emote);
            break;
        case "p":
            if (!isUser) {
                await regUser(msg);
                await sock.sendMessage(from, { text: respond.welcome(pushname) }, { quoted: msg });
                await mainMenu(msg, sock);
                userData[sender] = { isUser: true };
            }
            emote.react.text = "😡";
            await sock.sendMessage(from, { text: respond.gakSopan }, { quoted: msg });
            await sock.sendMessage(from, emote);
            break;
        default:
            break;
    }
}

export default ansChat