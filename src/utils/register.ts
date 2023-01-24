/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs'

import menuCommand from '../commands/menu'
import * as respond from '../listeners/respond'

const regUser = async (msg: any, sock: any) => {
    const { from, sender, isGroup, isCmd, isMenu, isUser, isOwner, pushname } = msg
    const userDataPath = './database/userData.json'
    if (!fs.existsSync('./database')) {
        fs.mkdirSync('./database')
    }
    if (!fs.existsSync(userDataPath))
        fs.writeFileSync(userDataPath, JSON.stringify({}, null, 2))

    const userData = JSON.parse(fs.readFileSync('./database/userData.json').toString())

    if (!isUser && !isGroup) {
        userData[sender] = {
            name: pushname,
            number: sender.split('@')[0],
            owner: isOwner
        }
        fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2))
        sock.sendMessage(from, { text: respond.welcome(pushname) }, { quoted: msg })
        await menuCommand(msg, sock)
    }

    if (!isUser && isGroup) {
        if (isCmd || isMenu) {
            userData[sender] = {
                name: pushname,
                phoneNumber: sender.split('@')[0],
                owner: isOwner
            }
            fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2))
            await sock.sendMessage(from, { text: respond.welcome(pushname) }, { quoted: msg })
            await menuCommand(msg, sock)
        }
    }
}

export default regUser