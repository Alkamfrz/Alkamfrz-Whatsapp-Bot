/* eslint-disable @typescript-eslint/no-explicit-any */
import { config } from '../../lib/func';

const apiKey = config.apiKey.LoLHumanKey;

const animeSearchCommand = async (msg: any, sock: any) => {
    const from = msg.key.remoteJid;
    const type = Object.keys(msg.message)[0];
    const chats = (type === 'conversation' && msg.message.conversation) ? msg.message.conversation : (type == 'imageMessage') && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : (type == 'documentMessage') && msg.message.documentMessage.caption ? msg.message.documentMessage.caption : (type == 'videoMessage') && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : (type == 'extendedTextMessage') && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : (type == 'buttonsResponseMessage' && msg.message.buttonsResponseMessage.selectedButtonId) ? msg.message.buttonsResponseMessage.selectedButtonId : (type == 'templateButtonReplyMessage') && msg.message.templateButtonReplyMessage.selectedId ? msg.message.templateButtonReplyMessage.selectedId : '';
    const args = chats.trim().split(/ +/).slice(1);
    const query = args.join(' ');
    const getRes = await fetch(`https://api.lolhuman.xyz/api/anime?apikey=${apiKey}&query=${query}`);
    const res = await getRes.json();
    const { result } = res;
    const { title, description, episodes, seasonYear, status: animeStatus, genres, source, coverImage, averageScore } = result;
    const status = res.status;
    if (status !== 200) return sock.sendMessage(from, { text: 'No results found' }, { quoted: msg });
    const airingAt = result.nextAiringEpisode ? result.nextAiringEpisode.airingAt : 'No data';
    const date = new Date(airingAt * 1000);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const nextAiring = result.nextAiringEpisode ? `${day}/${month}/${year} ${hours}:${minutes}` : 'No data';
    const nextEpisode = result.nextAiringEpisode ? result.nextAiringEpisode.episode : 'No data';
    const synopsis = description ? description.replace(/<br>/g, ' ') : 'No Data';
    const data = `*Romaji:* ${title.romaji ? title.romaji : 'No data'}
*English:* ${title.english ? title.english : 'No data'}
*Native:* ${title.native ? title.native : 'No data'}\n
*Synopsis:* ${synopsis ? synopsis : 'No data'}\n
*Total Episodes:* ${episodes ? episodes : 'No data'}
*Year:* ${seasonYear ? seasonYear : 'No data'}
*Score:* ${averageScore ? averageScore : 'No data'}
*Status:* ${animeStatus ? animeStatus : 'No data'}
*Source:* ${source ? source : 'No data'}
*Genres:* ${genres ? genres : 'No data'}
*Next Airing:* ${nextAiring ? nextAiring : 'No data'}
*Next Episode:* ${nextEpisode ? nextEpisode : 'No data'}`;
    if (status === 200) {
        await sock.sendMessage(from, { image: { url: coverImage.large, }, caption: data },'image', { quoted: msg });
    }
    else {
        await sock.sendMessage(from, { text: 'No results found' }, { quoted: msg })
    }
};

export default animeSearchCommand;