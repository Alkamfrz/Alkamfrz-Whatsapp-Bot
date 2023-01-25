/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";

import config from "../configs/config";

const apiKey = config.apiKey.LoLHumanKey;

const spotifyCommand = async (msg: any, sock: any) => {
    const from = msg.key.remoteJid
    const type = Object.keys(msg.message)[0]
    const chats = (type === 'conversation' && msg.message.conversation) ? msg.message.conversation : (type == 'imageMessage') && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : (type == 'documentMessage') && msg.message.documentMessage.caption ? msg.message.documentMessage.caption : (type == 'videoMessage') && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : (type == 'extendedTextMessage') && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : (type == 'buttonsResponseMessage' && msg.message.buttonsResponseMessage.selectedButtonId) ? msg.message.buttonsResponseMessage.selectedButtonId : (type == 'templateButtonReplyMessage') && msg.message.templateButtonReplyMessage.selectedId ? msg.message.templateButtonReplyMessage.selectedId : ''
    const args = chats.trim().split(/ +/).slice(1)
    const url = args[0]
    const getRes = await fetch(`https://api.lolhuman.xyz/api/spotify?apikey=${apiKey}&url=${url}`)
    const res = await getRes.json()
    const { result } = res
    const { title, artists, duration, popularity, thumbnail, link } = result
    const text = `*Title:* ${title}
*Artists:* ${artists}
*Duration:* ${duration}
*Popularity:* ${popularity}
*Download Link:* ${link}`
    if (res.error) return await sock.sendMessage(from, { text: "Apikey tidak valid atau belum diisi" }, { quoted: msg })
    const thumbnailRes = await axios.get(thumbnail, { responseType: 'arraybuffer' })
    await sock.sendMessage(from, { image: thumbnailRes.data, caption: text }, { quoted: msg })
    const audioRes = await axios.get(link, { responseType: 'arraybuffer' })
    await sock.sendMessage(from, { audio: audioRes.data, mimetype: 'audio/mp4' }, { quoted: msg })
}

export default spotifyCommand