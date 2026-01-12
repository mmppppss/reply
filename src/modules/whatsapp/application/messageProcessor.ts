import type { WAMessage } from 'baileys';

export interface Message {
	fromJid: string;
	fromLid: string;
	isGroup: boolean;
	groupJid?: string;
	text?: string;
	type: 'text' | 'image' | 'video' | 'audio' | 'document' | 'other';
	media?: Uint8Array;
	mediaName?: string;
	quotedText?: string;
	timestamp: number | Long;
	raw?: WAMessage | null;
}

export function processMessage(msg: WAMessage, includeRaw: boolean = false): Message | null {
	if (!msg.message) return null;

	const messageContent = msg.message;

	const isGroup = msg.key.remoteJid?.endsWith('@g.us') ?? false;


	const fromJid = isGroup
		? msg.key.participantAlt!
		: msg.key.remoteJidAlt!;

	const fromLid = isGroup
		? msg.key.participant!
		: msg.key.remoteJid!;

	const base: Message = {
		fromJid,
		fromLid,
		isGroup,
		type: 'other',
		timestamp: msg.messageTimestamp!,
	};

	if (includeRaw) {
		base.raw = msg;
	}
	if (isGroup) {
		base.groupJid = msg.key.remoteJid!;
	}

	if (messageContent.conversation) {
		base.type = 'text';
		base.text = messageContent.conversation;
	}
	else if (messageContent.extendedTextMessage) {
		base.type = 'text';
		base.text = messageContent.extendedTextMessage.text!;
		base.quotedText = messageContent.extendedTextMessage.contextInfo?.quotedMessage?.conversation!;
	}
	else if (messageContent.imageMessage) {
		base.type = 'image';
		base.text = messageContent.imageMessage.caption!;
		base.media = messageContent.imageMessage.jpegThumbnail!;
		base.mediaName = 'image.jpg';
	}
	else if (messageContent.videoMessage) {
		base.type = 'video';
		base.text = messageContent.videoMessage.caption!;
		base.media = messageContent.videoMessage.jpegThumbnail!;
		base.mediaName = 'video.mp4';
	}
	else if (messageContent.audioMessage) {
		base.type = 'audio';
		base.media = messageContent.audioMessage?.fileEncSha256!;
		base.mediaName = 'audio.ogg';
	}
	else if (messageContent.documentMessage) {
		base.type = 'document';
		base.mediaName = messageContent.documentMessage.fileName!;
	}
	return base;
}
