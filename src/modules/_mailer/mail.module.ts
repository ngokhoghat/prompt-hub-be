// import { join } from 'path';
// import { Global, Module } from '@nestjs/common';
// import { MailService } from './mail.service';
// import { MailerModule } from '@nestjs-modules/mailer';
// import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

// @Global()
// @Module({
//     imports: [
//         MailerModule.forRootAsync({
//             useFactory: () => {
//                 return {
//                     transport: {
//                         service: 'gmail',
//                         auth: {
//                             user: process.env.MAIL_USER,
//                             pass: process.env.MAIL_PASS,
//                         },
//                     },
//                     defaults: {
//                         from: `${process.env.MAIL_BRAND} <noreply@example.com>`,
//                     },
//                     template: {
//                         dir: join(__dirname, 'templates'),
//                         adapter: new HandlebarsAdapter(),
//                         options: {
//                             strict: true,
//                         },
//                     },
//                 }
//             }
//         }),
//     ],
//     providers: [MailService],
//     exports: [MailService],
// })
// export class MailModule { }