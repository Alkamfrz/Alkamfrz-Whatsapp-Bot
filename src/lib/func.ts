import fs, { readFileSync } from 'fs';

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

//get current time
export const getCurrentTime = () => {
    const date = new Date();
    const day = date.getDay();
    const dayList = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const dayName = dayList[day];
    const dateNumber = date.getDate();
    const month = date.getMonth();
    const monthList = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const monthName = monthList[month];
    const year = date.getFullYear();
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');
    return `${dayName}, ${dateNumber} ${monthName} ${year} ${hour}:${minute}:${second}`;
};