import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailSenderService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: '',
                pass: ''
            }
        });
    }

    async sendEmail(to: string, subject: string, text: string) {
        await this.transporter.sendMail({
            from: '',
            to,
            subject,
            text
        });
    }
}
