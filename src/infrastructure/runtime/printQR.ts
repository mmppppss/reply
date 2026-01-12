import qrcode from 'qrcode-terminal';

export function printQR(qr: string): void {
    qrcode.generate(qr, { small: true });
}
