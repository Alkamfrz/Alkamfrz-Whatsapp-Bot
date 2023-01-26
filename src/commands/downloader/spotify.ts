/* eslint-disable @typescript-eslint/no-explicit-any */

import { config } from '../../lib/func';

const apiKey = config.apiKey.LoLHumanKey;

const spotifyCommand = async (msg: any, sock: any) => {
    const from = msg.key.remoteJid;
    const type = Object.keys(msg.message)[0];
    const chats = (type === 'conversation' && msg.message.conversation) ? msg.message.conversation : (type == 'imageMessage') && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : (type == 'documentMessage') && msg.message.documentMessage.caption ? msg.message.documentMessage.caption : (type == 'videoMessage') && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : (type == 'extendedTextMessage') && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : (type == 'buttonsResponseMessage' && msg.message.buttonsResponseMessage.selectedButtonId) ? msg.message.buttonsResponseMessage.selectedButtonId : (type == 'templateButtonReplyMessage') && msg.message.templateButtonReplyMessage.selectedId ? msg.message.templateButtonReplyMessage.selectedId : '';
    const args = chats.trim().split(/ +/).slice(1);
    const url = args[0];
    const getRes = await fetch(`https://api.lolhuman.xyz/api/spotify?apikey=${apiKey}&url=${url}`);
    const res = await getRes.json();
    const { result } = res;
    const { title, artists, duration, popularity, thumbnail, link } = result;
    const status = res.status;
    const minutes = Math.floor(duration / 60);
    const seconds = duration - minutes * 60;
    const totalD = `${minutes} minutes ${seconds} seconds`;
    const data = `*Title:* ${title};
*Artists:* ${artists}
*Duration:* ${totalD}
*Popularity:* ${popularity}
*Download Link:* ${link}`;
    if (status === 200) {
        await sock.sendMessage(from, { image: { url: thumbnail }, caption: data }, { quoted: msg }).then(() => {
            sock.sendMessage(from, { audio: { url: link }, mimetype: 'audio/mp4', fileName: `${title}.mp3` }, { quoted: msg });
        });
    }
    else {
        sock.sendMessage(from, { text: 'No results found' }, { quoted: msg })
    }
};

export default spotifyCommand;