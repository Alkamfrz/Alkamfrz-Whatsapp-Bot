/* eslint-disable @typescript-eslint/no-explicit-any */
import { config } from '../../lib/func';

const apiKey = config.apiKey.LoLHumanKey;

const ytsrcCommand = async (msg: any, sock: any) => {
    const from = msg.key.remoteJid;
    const type = Object.keys(msg.message)[0];
    const chats = (type === 'conversation' && msg.message.conversation) ? msg.message.conversation : (type == 'imageMessage') && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : (type == 'documentMessage') && msg.message.documentMessage.caption ? msg.message.documentMessage.caption : (type == 'videoMessage') && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : (type == 'extendedTextMessage') && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : (type == 'buttonsResponseMessage' && msg.message.buttonsResponseMessage.selectedButtonId) ? msg.message.buttonsResponseMessage.selectedButtonId : (type == 'templateButtonReplyMessage') && msg.message.templateButtonReplyMessage.selectedId ? msg.message.templateButtonReplyMessage.selectedId : '';
    const args = chats.trim().split(/ +/).slice(1);
    const query = args.join(' ');
    let num = args[args.length - 1];
    if (isNaN(num)) {
        num = 1;
    } else if (num > 10) {
        num = 10;
    }
    const query2 = query.replace(num, '');
    const getRes = await fetch(`https://api.lolhuman.xyz/api/ytsearch?apikey=${apiKey}&query=${query2}`);
    const res = await getRes.json();
    const { result } = res;
    const videoLink = "https://www.youtube.com/watch?v=";
    if (res.status == 200) {
        for (let i = 0; i < num; i++) {
            await sock.sendMessage(from, {
                image: { url: result[i].thumbnail }, caption: `*Title:* ${result[i].title}
*Published:* ${result[i].published}
*Views:* ${result[i].views}
*Link:* ${videoLink + result[i].videoId}`
            }, { quoted: msg });
        }
    } else {
        await sock.sendMessage(from, { text: "Tidak ada hasil yang cocok" }, { quoted: msg });
    }
};

export default ytsrcCommand;