/* eslint-disable @typescript-eslint/no-explicit-any */
import { downloadContentFromMessage } from "@adiwajshing/baileys";

const waitCommand = async (msg: any, sock: any) => {
    const from = msg.key.remoteJid;
    const stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, 'image');
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    const getRes = await fetch("https://api.trace.moe/search", {
        method: "POST",
        body: buffer,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
    const res = await getRes.json();
    const { filename, episode, from: fromAnime, to, similarity, image: thumbnail, video } = res.result[0];
    if (similarity < 0.89) return sock.sendMessage(from, { text: 'Tidak ada hasil yang cocok\n\n*Tips:* Berikan screenshot full scene anime tanpa crop dan efek filter' }, { quoted: msg });
    const title = filename.replace('[Ohys-Raws] ', '').replace(/ - \d\d \(.+\)/, '').replace(/\.\w+$/, '');
    const fromAnimeFormatted = new Date(fromAnime * 1000).toISOString().substr(11, 8);
    const toFormatted = new Date(to * 1000).toISOString().substr(11, 8);
    const similarityFormatted = (similarity * 100).toFixed(0) + '%';
    const data = `*Title:* ${title}\n*Episode:* ${episode}\n*From:* ${fromAnimeFormatted}\n*To:* ${toFormatted}\n*Similarity:* ${similarityFormatted}`;
    await sock.sendMessage(from, { image: { url: thumbnail }, caption: data }, { quoted: msg }).then(() => {
        sock.sendMessage(from, { video: { url: video }, }, { quoted: msg });
    });
};

export default waitCommand