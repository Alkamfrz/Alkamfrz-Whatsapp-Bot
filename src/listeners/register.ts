/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs'

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
}

export default regUser
exports.userData = userData