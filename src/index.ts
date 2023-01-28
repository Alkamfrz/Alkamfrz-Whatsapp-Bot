import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@adiwajshing/baileys'
import { Boom } from '@hapi/boom'
import NodeCache from 'node-cache'
import pino from 'pino'

import messageListener from './listeners/message'

async function connectToWhatsApp() {

    const { state, saveCreds } = await useMultiFileAuthState('auth')
    const sock = makeWASocket({
        printQRInTerminal: true,
        auth: state,
        logger: pino({ level: 'fatal' }),
        browser: ["Alkamfrz Bot", "MacOS", "3.0"],
        generateHighQualityLinkPreview: true,
        mediaCache: new NodeCache({
            stdTTL: 60 * 5,
            useClones: false
        }),
        syncFullHistory: false,
        userDevicesCache: new NodeCache({
            stdTTL: 60 * 10,
            useClones: false
        }),
        patchMessageBeforeSending: (message) => {
            const requiresPatch = !!(
                message.buttonsMessage ||
                // || message.templateMessage
                message.listMessage
            );
            if (requiresPatch) {
                message = {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadataVersion: 2,
                                deviceListMetadata: {},
                            },
                            ...message,
                        },
                    },
                };
            }
            return message;
        },
    })

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect)
            if (shouldReconnect) {
                connectToWhatsApp()
            }
        } else if (connection === 'open') {
            console.log('opened connection')
        }
    })

    sock.ev.on('messages.upsert', async m => {
        if (m.messages[0].key.fromMe) return
        await messageListener(m, sock)
    })
}
connectToWhatsApp()