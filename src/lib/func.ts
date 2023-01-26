import 'moment-timezone';

import fs, { readFileSync } from 'fs';
import moment from 'moment';

//get bot config
export const config = JSON.parse(readFileSync('./config.json', 'utf8'));

//get app version
export const appVersion = JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;

//get uptime
export const getUptime = () => {
    const uptime = process.uptime();
    const days = Math.floor(uptime / (60 * 60 * 24));
    const hours = Math.floor(uptime / (60 * 60)) % 24;
    const minutes = Math.floor(uptime / 60) % 60;
    const seconds = Math.floor(uptime % 60);
    return `${days} hari, ${hours} jam, ${minutes} menit, ${seconds} detik`;
};

//get current time in id (Indonesia)
export const getCurrentTime = () => {
    moment.locale('id');
    return moment().tz('Asia/Jakarta').format('LLLL');
}