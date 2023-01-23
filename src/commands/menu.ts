import config from "../configs/config"

const prefix = config.botConfig.prefix
const owner = config.botConfig.ownerName
const bot = config.botConfig.botName

const menuCommand = async (msg: any, sock: any) => {
    const sections = [
        {
        title: "Menu Utama",
        rows: [
            {title: "Menampilkan Menu", rowId: `${prefix}menu`, description: "Menampilkan list command yang tersedia"},
            {title: "Menampilkan Tips", rowId: `${prefix}tips`, description: "Mencari tahu fitur-fitur bot yang mungkin belum kamu ketahui"},
            {title: "Membuat Sticker", rowId: `${prefix}sticker`, description: "Membuat sticker dari gambar, video, atau gif yang kamu kirim"},
            {title: "Menggunakan ChatGPT OpenAI", rowId: `${prefix}gpt`, description: "Mendapatkan informasi yang kamu inginkan dengan menggunakan ChatGPT"},
            {title: `Berkenalan dengan majikan ${bot}`, rowId: `${prefix}owner`, description: "Silahkan berkenalan dengan majikan saya"},
        ]
        },
       {
        title: `Only obey ${owner} (owner) `,
        rows: [
            {title: "Hapus pesan", rowId: `${prefix}delete`, description: "Hapus pesan dari bot"},
        ]
        },
    ]
    
    const listMessage = {
      text: "Berikut adalah list command yang dapat kamu gunakan",
      footer: "Silahkan klik tombol dibawah ini untuk melihat list command yang tersedia",
      title: "Menu Utama",
      buttonText: "Never regret your choices",
      sections
    }

      await sock.sendMessage(msg.key.remoteJid, listMessage)
}

export default menuCommand