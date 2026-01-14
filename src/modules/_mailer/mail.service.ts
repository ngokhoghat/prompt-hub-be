// import { Injectable } from '@nestjs/common';
// import { MailerService } from '@nestjs-modules/mailer';

// @Injectable()
// export class MailService {
//     constructor(private readonly mailerService: MailerService) { }

//     async sendMail(to: string, subject: string, context: Object, template: string = 'confirmation') {
//         await this.mailerService.sendMail({
//             to: to,
//             subject: subject,
//             template: template,
//             context: context
//         });
//     }
// }