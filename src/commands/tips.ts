import config from "../configs/config";
const prefix = config.botConfig.prefix;

const tipsList = [
    `Kamu bisa membuat stiker tanpa menggunakan command di private chat bot.`,
    `Maksimal durasi video yang dapat dijadikan stiker adalah 5 detik.`,
    `Pencipta bot ini adalah seorang wibu`,
    `Lapor masalah atau bug yang kamu temukan ke pemilik bot dengan menggunakan perintah *${prefix}owner*`,
    `Bot ini masih dalam tahap pengembangan, jadi mungkin masih banyak bug`,
    `Jika kamu memiliki ide untuk fitur baru, kamu bisa menghubungi pemilik bot dengan menggunakan perintah *${prefix}owner*`,
    `perintah *${prefix}sticker* dapat disingkat menjadi *${prefix}s*`,
    `Sampai bulan Maret, bot ini bisa menggunakan fitur *${prefix}gpt*. Fitur ini akan dihapus pada bulan April`,
    `Kamu tidak bisa menggunakan perintah yang hanya bisa dilakukan oleh pemilik bot`,
];

let lastTips = ``;
export default function getRandomTips() {
    let tips = lastTips;
    while (tips == lastTips) {
        tips = tipsList[Math.floor(Math.random() * tipsList.length)];
    }
    lastTips = tips;
    return tips;
}