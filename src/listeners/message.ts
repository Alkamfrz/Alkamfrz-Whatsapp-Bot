/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';

import animeSearchCommand from '../commands/anime/animeSearch';
import waitCommand from '../commands/anime/wait';
import spotifyCommand from '../commands/downloader/spotify';
import mainMenu from '../commands/mainMenu';
import gptCommand from '../commands/misc/gpt';
import ownerCommand from '../commands/misc/owner';
import { img, video } from '../commands/misc/sticker';
import getRandomTips from '../commands/misc/tips';
import { config } from '../lib/func';
import regUser from '../utils/register';
import ansChat from './ansChat';
import * as respond from './respond';

const prefix = config.botConfig.prefix;
const owner = config.botConfig.ownerNumber;

if (!fs.existsSync('./database')) {
    fs.mkdirSync('./database');
}

const userDataPath = './database/userData.json';

if (!fs.existsSync(userDataPath))
    fs.writeFileSync(userDataPath, JSON.stringify({}, null, 2));

const userData = JSON.parse(fs.readFileSync('./database/userData.json').toString());

const messageListener = async (m: any, sock: any) => {
    try {
        const msg = m.messages[0];
        const from = msg.key.remoteJid;
        const pushname = msg.pushName;
        const type = Object.keys(msg.message)[0];
        const chats = (type === 'conversation' && msg.message.conversation) ? msg.message.conversation : (type == 'imageMessage') && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : (type == 'documentMessage') && msg.message.documentMessage.caption ? msg.message.documentMessage.caption : (type == 'videoMessage') && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : (type == 'extendedTextMessage') && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : (type == 'buttonsResponseMessage' && msg.message.buttonsResponseMessage.selectedButtonId) ? msg.message.buttonsResponseMessage.selectedButtonId : (type == 'templateButtonReplyMessage') && msg.message.templateButtonReplyMessage.selectedId ? msg.message.templateButtonReplyMessage.selectedId : '';
        const msgId = msg.key.id;
        const isMenu = msg?.message?.listResponseMessage?.singleSelectReply?.selectedRowId;
        const isGroup = from.endsWith('@g.us');
        const sender = isGroup ? (msg.key.participant ? msg.key.participant : msg.participant) : from;
        const command = chats.toLowerCase().split(' ')[0] || '';
        const args = chats.trim().split(/ +/).slice(1);
        const isCmd = command.startsWith(prefix);
        const isOwner = sender === owner + '@s.whatsapp.net';
        const isUser = sender in userData;
        const isStatus = sender === 'status@broadcast';
        const content = JSON.stringify(msg.message);
        const isImage = (type == 'imageMessage');
        const isVideo = (type == 'videoMessage');
        const isQuotedMsg = (type == 'extendedTextMessage');
        const isQuotedImage = isQuotedMsg ? content.includes('imageMessage') ? true : false : false;
        const isQuotedVideo = isQuotedMsg ? content.includes('videoMessage') ? true : false : false;
        const emote = { react: { text: "", key: msg.key } };

        //Auto read message
        const readMsg = {
            remoteJid: from,
            id: msgId,
            participant: isGroup ? sender : undefined
        }
        await sock.readMessages([readMsg]);

        //register user for first time
        if ((!isUser && !isGroup) || (!isUser && isGroup && (isCmd || isMenu))) {
            if (isStatus) return;
            await regUser(msg);
            await sock.sendMessage(from, { text: respond.welcome(pushname) }, { quoted: msg });
            await mainMenu(msg, sock);
        }
        userData[sender] = { isUser: true };

        //auto sticker
        if ((isImage || isVideo) && !isGroup && isUser && !isCmd) {
            emote.react.text = isImage ? "🖼️" : "🎞️";
            await (isImage ? img : video)(msg, sock);
            await sock.sendMessage(from, emote);
        }

        //regular chat response
        await ansChat(msg, sock);

        //command handler
        if (isUser && isCmd || isMenu) {
            switch (command || isMenu) {
                case `${prefix}menu`:
                case `${prefix}help`:
                    emote.react.text = "📖";
                    await mainMenu(msg, sock);
                    await sock.sendMessage(from, emote);
                    break;

                case `${prefix}tips`:
                    emote.react.text = "💡";
                    await sock.sendMessage(from, { text: getRandomTips() }, { quoted: msg });
                    await sock.sendMessage(from, emote);
                    break;

                case `${prefix}sticker`:
                case `${prefix}stiker`:
                case `${prefix}s`:
                    if (isImage || isQuotedImage) {
                        emote.react.text = "🖼️";
                        await img(msg, sock);
                        await sock.sendMessage(from, emote);
                    }
                    else if (isVideo || isQuotedVideo) {
                        emote.react.text = "🎞️";
                        await video(msg, sock);
                        await sock.sendMessage(from, emote);
                    }
                    else {
                        emote.react.text = "❗"
                        await sock.sendMessage(from, { text: respond.stickerCommand }, { quoted: msg });
                        await sock.sendMessage(from, emote);
                    }
                    break;

                case `${prefix}owner`:
                    emote.react.text = "👑";
                    await ownerCommand(msg, sock);
                    await sock.sendMessage(from, emote);
                    break;

                case `${prefix}gpt`:
                    emote.react.text = "🤖";
                    await gptCommand(msg, sock);
                    await sock.sendMessage(from, emote);
                    break;

                case `${prefix}spotify`:
                    if (args.length < 1) {
                        emote.react.text = "❗";
                        await sock.sendMessage(from, { text: respond.spotifyCommand }, { quoted: msg });
                        await sock.sendMessage(from, emote);
                        break
                    }
                    emote.react.text = "🎵"
                    await spotifyCommand(msg, sock);
                    await sock.sendMessage(from, emote);
                    break

                case `${prefix}wait`:
                case `${prefix}whatanime`:
                    if (isImage || isQuotedImage) {
                        emote.react.text = "🖼️";
                        await waitCommand(msg, sock);
                        await sock.sendMessage(from, emote);
                    }
                    else {
                        emote.react.text = "❗"
                        await sock.sendMessage(from, { text: respond.waitCommand }, { quoted: msg });
                        await sock.sendMessage(from, emote);
                    }
                    break;

                case `${prefix}anime`:
                case `${prefix}animesearch`:
                    if (args.length < 1) {
                        emote.react.text = "❗";
                        await sock.sendMessage(from, { text: respond.animeSearchCommand }, { quoted: msg });
                        await sock.sendMessage(from, emote);
                        break
                    }
                    emote.react.text = "🔎";
                    await animeSearchCommand(msg, sock);
                    await sock.sendMessage(from, emote);
                    break;

                case `${prefix}delete`:
                case `${prefix}del`:
                case `${prefix}d`:
                    if (isOwner) {
                        if (isQuotedMsg) {
                            emote.react.text = "🗑️";
                            await sock.sendMessage(from, { delete: { remoteJid: from, fromMe: true, id: msg.message.extendedTextMessage.contextInfo.stanzaId } }, { quoted: msg });
                            await sock.sendMessage(from, emote);
                        }
                        else {
                            emote.react.text = "❗";
                            await sock.sendMessage(from, { text: respond.deleteCommand }, { quoted: msg });
                            await sock.sendMessage(from, emote);
                        }
                    }
                    else {
                        emote.react.text = "🤡";
                        await sock.sendMessage(from, { text: respond.notOwner }, { quoted: msg });
                        await sock.sendMessage(from, emote);
                    }
                    break;

                default:
                    emote.react.text = "❗";
                    await sock.sendMessage(from, { text: respond.defaultRespond }, { quoted: msg });
                    await sock.sendMessage(from, emote);
                    break
            }
        }
    }

    catch (e) {
        console.log(e);
    }
}

export default messageListener