/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';

import { config } from '../../lib/func';

const owner = config.botConfig.ownerNumber;

const regUser = async (msg: any) => {
    if (!fs.existsSync('./database')) {
        fs.mkdirSync('./database');
    }
    const userDataPath = './database/userData.json'
    if (!fs.existsSync(userDataPath))
        fs.writeFileSync(userDataPath, JSON.stringify({}, null, 2));
    const userData = JSON.parse(fs.readFileSync('./database/userData.json').toString());
    const from = msg.key.remoteJid;
    const pushname = msg.pushName;
    const sender = from.endsWith('@g.us') ? (msg.key.participant ? msg.key.participant : msg.participant) : from;
    const isOwner = sender === owner + '@s.whatsapp.net';
    userData[sender] = {
        Name: pushname,
        PhoneNumber: sender.split('@')[0],
        Owner: isOwner
    };
    fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
    userData[sender] = { isUser: true };
};

export default regUser;