/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "../configs/config";

const ownerNumber = config.botConfig.ownerNumber;
const ownerName = config.botConfig.ownerName;

const ownerCommand = async (msg: any, sock: any) => {
    const from = msg.key.remoteJid;
    const vcard = 'BEGIN:VCARD\n'
        + 'VERSION:3.0\n'
        + `N:Alfariz;Alkam;Muhammad\n`
        + `FN:${ownerName}\n`
        + `TEL;type=CELL;type=VOICE;waid=${ownerNumber}:${ownerNumber}\n`
        + `EMAIL;Work:alkamfrz@gmail.com\n`
        + 'END:VCARD';
    await sock.sendMessage(from,
        {
            contacts: {
                displayName: ownerName,
                contacts: [{ vcard }],
            }
        }
    );
    await sock.sendMessage(from, { text: `Untuk menghubungi pemilik bot, silahkan klik tombol di atas. Atau klik link berikut: https://wa.me/${ownerNumber}?text=Assalamualaikum` }, { quoted: msg });
};

export default ownerCommand;