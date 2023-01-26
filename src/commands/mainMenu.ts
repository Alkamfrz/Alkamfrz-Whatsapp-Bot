/* eslint-disable @typescript-eslint/no-explicit-any */

import { appVersion, config, getCurrentTime, getUptime } from '../lib/func';

const prefix = config.botConfig.prefix;

const menuAnime = async (msg: any, sock: any) => {
    const sections = [
        {
            title: "Menu Anime",
            rows: [
                { title: "What Anime Is This", rowId: `${prefix}whatanime`, description: "Mencari judul anime dari screenshot scene anime" },
            ]
        },
        {
            title: "Menu Downloader",
            rows: [
                { title: "Spotify Downloader", rowId: `${prefix}spotify`, description: "Mendownload lagu dari spotify menggunakan link" },
            ]
        },
        {
            title: "Menu Lain-lain",
            rows: [
                { title: "Stiker", rowId: `${prefix}sticker`, description: "Merubah gambar, gif, dan video menjadi stiker" },
                { title: "ChatGPT", rowId: `${prefix}gpt`, description: "Mencari informasi apa saja menggunakan chatbot GPT-3" },
                { title: "Tips", rowId: `${prefix}tips`, description: "Mendapatkan tips random yang mungkin dapat berguna dalam menggunakan bot ini" },
                { title: "Owner", rowId: `${prefix}owner`, description: "Berkenalan dengan pencipta serta majikan bot" },
            ]
        },
        {
            title: "Menu Owner",
            rows: [
                { title: "Hapus Pesan", rowId: `${prefix}delete`, description: "Menghapus pesan dari bot" },
            ]
        }
    ];

    const text = `*Bot Version*: ${appVersion}
*Current Time*: ${getCurrentTime()}
*Uptime*: ${getUptime()}\n
Selamat datang di menu utama, enjoy!`;

    const listMessage = {
        text: text,
        footer: "Silahkan klik tombol dibawah ini untuk melihat list command yang tersedia",
        title: "Menu Utama",
        buttonText: "Never regret your choice",
        sections
    };

    await sock.sendMessage(msg.key.remoteJid, listMessage);
};

export default menuAnime;