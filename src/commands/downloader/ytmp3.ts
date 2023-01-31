/* eslint-disable @typescript-eslint/no-explicit-any */

import { config } from '../../lib/func';

const apiKey = config.apiKey.LoLHumanKey;

const ytmp3Command = async (msg: any, sock: any) => {
    const from = msg.key.remoteJid;
    const type = Object.keys(msg.message)[0];
    const chats = (type === 'conversation' && msg.message.conversation) ? msg.message.conversation : (type == 'imageMessage') && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : (type == 'documentMessage') && msg.message.documentMessage.caption ? msg.message.documentMessage.caption : (type == 'videoMessage') && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : (type == 'extendedTextMessage') && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : (type == 'buttonsResponseMessage' && msg.message.buttonsResponseMessage.selectedButtonId) ? msg.message.buttonsResponseMessage.selectedButtonId : (type == 'templateButtonReplyMessage') && msg.message.templateButtonReplyMessage.selectedId ? msg.message.templateButtonReplyMessage.selectedId : '';
    const args = chats.trim().split(/ +/).slice(1);
    const url = args[0];
    const getRes = await fetch(`https://api.lolhuman.xyz/api/ytaudio?apikey=${apiKey}&url=${url}`);
    const res = await getRes.json();
    const { result } = res;
    const { title, thumbnail, duration, } = result;
    const { link, size } = result.link;
    const status = res.status;
    const linkOnly = `*Title:* ${title}
*Duration:* ${duration}
*Size:* ${size}
*Download Link:* ${link}

File terlalu besar untuk dikirim. Silahkan download sendiri!`;
    const linkAudio = `*Title:* ${title}
*Duration:* ${duration}
*Size:* ${size}
*Download Link:* ${link}`;
const sizeMB = size.split(' ')[0];
    if (status === 200) {
        if (sizeMB >= 10) {
            await sock.sendMessage(from, { image: { url: thumbnail }, caption: linkOnly }, { quoted: msg });
        }
        else {
            await sock.sendMessage(from, { image: { url: thumbnail }, caption: linkAudio }, { quoted: msg }).then(() => {
                sock.sendMessage(from, { audio: { url: link }, mimetype: 'audio/mp4', fileName: `${title}.mp3` }, { quoted: msg });
            });
        }
    }
    else {
        await sock.sendMessage(from, { text: 'Terjadi kesalahan.' }, { quoted: msg })
    }
};

export default ytmp3Command;