/* eslint-disable @typescript-eslint/no-explicit-any */
import { config } from '../../lib/func';

const apiKey = config.apiKey.LoLHumanKey;

const pinterestCommand = async (msg: any, sock: any) => {
    const from = msg.key.remoteJid;
    const type = Object.keys(msg.message)[0];
    const chats = (type === 'conversation' && msg.message.conversation) ? msg.message.conversation : (type == 'imageMessage') && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : (type == 'documentMessage') && msg.message.documentMessage.caption ? msg.message.documentMessage.caption : (type == 'videoMessage') && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : (type == 'extendedTextMessage') && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : (type == 'buttonsResponseMessage' && msg.message.buttonsResponseMessage.selectedButtonId) ? msg.message.buttonsResponseMessage.selectedButtonId : (type == 'templateButtonReplyMessage') && msg.message.templateButtonReplyMessage.selectedId ? msg.message.templateButtonReplyMessage.selectedId : '';
    const args = chats.trim().split(/ +/).slice(1);
    const query = args.join(' ');
    const getRes = await fetch(`https://api.lolhuman.xyz/api/pinterest?apikey=${apiKey}&query=${query}`);
    const res = await getRes.json();
    const { result, status } = res;
    if (status === 200) {
        await sock.sendMessage(from, { image: { url: result }, caption: `*Pencarian:* ${query}` }, { quoted: msg });
    }
    else {
        sock.sendMessage(from, { text: 'Terjadi kesalahan.' }, { quoted: msg })
    }
};

export default pinterestCommand;