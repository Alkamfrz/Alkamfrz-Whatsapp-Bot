/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs'

import menuCommand from '../commands/menu'
import * as respond from '../listeners/respond'

const userDataPath = './database/userData.json'
if (!fs.existsSync('./database')) {
    fs.mkdirSync('./database')
}
if (!fs.existsSync(userDataPath))
    fs.writeFileSync(userDataPath, JSON.stringify({}, null, 2))

const userData = JSON.parse(fs.readFileSync('./database/userData.json').toString())

const regUser = async (msg: any, sock: any, from: any, pushname: any, isOwner: any, sender: any) => {
    userData[sender] = {
        name: pushname,
        number: sender.split('@')[0],
        owner: isOwner
    }
    fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2))
    sock.sendMessage(from, { text: respond.welcome(pushname) }, { quoted: msg })
    await menuCommand(msg, sock)
}

export default regUser
exports.userData = userData