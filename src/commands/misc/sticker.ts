/* eslint-disable @typescript-eslint/no-explicit-any */
import { downloadContentFromMessage } from '@adiwajshing/baileys';
import { Sticker, StickerTypes } from 'wa-sticker-formatter';

export const img = async (msg: any, sock: any) => {
    const from = msg.key.remoteJid;
    const stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, 'image');
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    const sticker = new Sticker(buffer, {
        pack: 'Curry Ayam',
        author: 'Alkamfrz Bot',
        type: StickerTypes.FULL,
    })
    await sock.sendMessage(from, await sticker.toMessage())
}

export const video = async (msg: any, sock: any) => {
    const from = msg.key.remoteJid;
    const stream = await downloadContentFromMessage(msg.message.videoMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.videoMessage, 'video');
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    const sticker = new Sticker(buffer, {
        pack: 'Curry Ayam',
        author: 'Alkamfrz Bot',
        type: StickerTypes.FULL,
        quality: 85,
    });
    await sock.sendMessage(from, await sticker.toMessage());
};