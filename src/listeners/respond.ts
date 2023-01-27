import { config } from '../lib/func';

const prefix = config.botConfig.prefix;

//welcome
export const welcome = (pushname: string) => `Halo ${pushname}, sepertinya kamu baru pertama kali menggunakan bot ini.\n
\`\`\`⚠️ Harap dibaca, teliti dan taati peraturan penggunaan bot ini dengan baik. ⚠️\`\`\`\n
1. Dilarang keras menggunakan bot ini untuk hal-hal yang tidak baik.\n
2. Dilarang melakukan spam pesan atau melakukan panggilan telepon pada bot ini.\n
3. Dilarang mengirim perintah yang berlebihan pada bot ini.\n\n
Jika kamu melanggar peraturan di atas, owner dan bot berhak untuk melakukan blacklist terhadap nomor kamu.\n
Jika kamu ingin mengajukan pertanyaan, kamu bisa menghubungi owner dengan menggunakan perintah *${prefix}owner*
Selamat menikmati bot ini!`;

//salam
export const salam = `Waalaikumsalam`;

//jawab hai
export const hai = `Hai juga`;

//gak sopan
export const gakSopan = `Ciri-ciri orang yang ngajak ngobrol tapi gak sopan:
1. Tidak mengucapkan salam
2. Tidak memperkenalkan diri
3. Memulai percakapan dengan mengetik "P"`;

//sticker command
export const stickerCommand = `*Penggunaan perintah sticker*:
${prefix}sticker <gambar> 
${prefix}sticker <video>
${prefix}sticker <gif>`;

//delete command
export const deleteCommand = `*Penggunaan perintah delete*:
${prefix}delete <balas pesan bot>`;

//join command
export const joinCommand = `*Penggunaan perintah join*:
${prefix}join <link grup>

*Contoh*:
${prefix}join https://chat.whatsapp.com/xxxxxxxxxxxxx`;

//gpt command
export const gptCommand = `*Penggunaan perintah gpt*:
${prefix}gpt <kalimat>

*Contoh*:
${prefix}gpt Perbedaan wibu dan otaku`;

//spotify command
export const spotifyCommand = `*Penggunaan perintah spotify*:
${prefix}spotify <link spotify>

*Contoh*:
${prefix}spotify https://open.spotify.com/track/xxxxxxxxxxxxx`;

//wait command
export const waitCommand = `*Penggunaan perintah What Anime Is This*:
${prefix}wait <gambar>`;

//anime search command
export const animeSearchCommand = `*Penggunaan perintah anime search*:
${prefix}anime <judul anime>

*Contoh*:
${prefix}anime Lycoris Recoil`;

//not owner
export const notOwner = 'Maaf, kamu bukan majikan saya';

//default respond
export const defaultRespond = `Ketik ${prefix}help untuk melihat daftar perintah`;