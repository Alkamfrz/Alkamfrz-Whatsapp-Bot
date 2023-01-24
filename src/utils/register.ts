import fs from 'fs'

import config from '../configs/config'

const owner = config.botConfig.ownerNumber
const userDataPath = './database/userData.json'
const userData = JSON.parse(fs.readFileSync('./database/userData.json').toString())

const regUser = async (msg: any, sock: any) => {
    const from = msg.key.remoteJid
    const pushname = msg.pushName
    const sender = from.endsWith('@g.us') ? (msg.key.participant ? msg.key.participant : msg.participant) : from
    const isOwner = sender === owner + '@s.whatsapp.net'
    userData[sender] = {
        name: pushname,
        number: sender.split('@')[0],
        owner: isOwner
    }
    fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2))
}

export default regUser