/* eslint-disable @typescript-eslint/no-explicit-any */
import { downloadContentFromMessage } from "@adiwajshing/baileys";

import { config } from "../../lib/func";

const apiKey = config.apiKey.LoLHumanKey;

const toPDFCommand = async (msg: any, sock: any) => {
    const from = msg.key.remoteJid;
    const stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, 'image');
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('file', blob, 'AlkamfrzBot.jpg');
    const getRes = await fetch('https://tmpfiles.org/api/v1/upload', {
        method: 'POST',
        body: formData,
    });
    const res = await getRes.json();
    const { data: { url: fileUrl } } = res;
    const fileUrl2 = fileUrl.replace('https://tmpfiles.org/', 'https://tmpfiles.org/dl/');
    const getRes2 = await fetch(`https://api.lolhuman.xyz/api/convert2pdf?apikey=${apiKey}&filename=AlkamfrzBot.jpg&file=${fileUrl2}`, {
        method: 'GET',
    });
    const res2 = await getRes2.json();
    const { result: pdfUrl } = res2;
    await sock.sendMessage(from, { document: { url: pdfUrl }, mimetype: 'application/pdf', filename: 'AlkamfrzBot.pdf' }, { quoted: msg });
};

export default toPDFCommand