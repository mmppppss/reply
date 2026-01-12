import { describe, it, expect, vi, beforeEach } from "vitest";
import { processMessage, type Message } from '../../../src/modules/whatsapp/application/messageProcessor';
import type { WAMessage } from 'baileys';

describe('processMessage', () => {

    it('should process private text message', () => {
        const msg = {
            key: {
                remoteJid: '59171234567@s.whatsapp.net',
                remoteJidAlt: '59171234567@s.whatsapp.net',
                fromMe: false,
                participant: undefined,
                participantAlt: undefined,
            },
            message: { conversation: 'Hola' },
            messageTimestamp: 1234567890,
        } as unknown as WAMessage;

        const result = processMessage(msg);

        expect(result).not.toBeNull();
        expect(result?.type).toBe('text');
        expect(result?.text).toBe('Hola');
        expect(result?.isGroup).toBe(false);
        expect(result?.fromJid).toBe('59171234567@s.whatsapp.net');
        expect(result?.fromLid).toBe('59171234567@s.whatsapp.net');
    });

    it('should process group text message', () => {
        const msg = {
            key: {
                remoteJid: '120363180489734029@g.us',
                remoteJidAlt: '59171234567@s.whatsapp.net',
                fromMe: false,
                participant: '151814276149394@lid',
                participantAlt: '59171234567@s.whatsapp.net',
            },
            message: { conversation: 'Mensaje de grupo' },
            messageTimestamp: 1234567891,
        } as unknown as WAMessage;

        const result = processMessage(msg);

        expect(result).not.toBeNull();
        expect(result?.isGroup).toBe(true);
        expect(result?.groupJid).toBe('120363180489734029@g.us');
        expect(result?.fromJid).toBe('59171234567@s.whatsapp.net');
        expect(result?.fromLid).toBe('151814276149394@lid');
        expect(result?.text).toBe('Mensaje de grupo');
    });

    it('should process extendedTextMessage with quoted text', () => {
        const msg = {
            key: {
                remoteJid: '120363180489734029@g.us',
                remoteJidAlt: '59171234567@s.whatsapp.net',
                fromMe: false,
                participant: '151814276149394@lid',
                participantAlt: '59171234567@s.whatsapp.net',
            },
            message: {
                extendedTextMessage: {
                    text: 'Respuesta',
                    contextInfo: {
                        quotedMessage: { conversation: 'Mensaje original' }
                    }
                }
            },
            messageTimestamp: 1234567892,
        } as unknown as WAMessage;

        const result = processMessage(msg);

        expect(result?.type).toBe('text');
        expect(result?.text).toBe('Respuesta');
        expect(result?.quotedText).toBe('Mensaje original');
    });

    it('should process image message', () => {
        const jpegThumbnail = new Uint8Array([1, 2, 3]);
        const msg = {
            key: { remoteJid: '59171234567@s.whatsapp.net', remoteJidAlt: '59171234567@s.whatsapp.net', fromMe: false },
            message: { imageMessage: { caption: 'Foto', jpegThumbnail } },
            messageTimestamp: 1234567893,
        } as unknown as WAMessage;

        const result = processMessage(msg);

        expect(result?.type).toBe('image');
        expect(result?.text).toBe('Foto');
        expect(result?.media).toEqual(jpegThumbnail);
        expect(result?.mediaName).toBe('image.jpg');
    });

    it('should process audio message', () => {
        const sha256 = new Uint8Array([4, 5, 6]);
        const msg = {
            key: { remoteJid: '59171234567@s.whatsapp.net', remoteJidAlt: '59171234567@s.whatsapp.net', fromMe: false },
            message: { audioMessage: { fileEncSha256: sha256 } },
            messageTimestamp: 1234567894,
        } as unknown as WAMessage;

        const result = processMessage(msg);

        expect(result?.type).toBe('audio');
        expect(result?.media).toEqual(sha256);
        expect(result?.mediaName).toBe('audio.ogg');
    });

    it('should include raw message if requested', () => {
        const msg = {
            key: { remoteJid: '59171234567@s.whatsapp.net', remoteJidAlt: '59171234567@s.whatsapp.net', fromMe: false },
            message: { conversation: 'Hola Raw' },
            messageTimestamp: 1234567895,
        } as unknown as WAMessage;

        const result = processMessage(msg, true);

        expect(result?.raw).toBe(msg);
    });

});
