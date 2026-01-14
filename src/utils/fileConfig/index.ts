import * as fs from 'fs';
import { lookup } from 'mime-types';
import { diskStorage } from 'multer';
import { basename, extname } from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';

export const getStorage = (path: string = '') => {
  return diskStorage({
    destination: function (req, file, cb) {
      if (!fs.existsSync(`./public/tmp/${path}`)) {
        fs.mkdirSync(`./public/tmp/${path}`, { recursive: true });
      }
      cb(null, `./public/tmp/${path}`);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    },
  });
};

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new HttpException(`Unsupported file type${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
  }
  if (file.originalname.length > 50) {
    return callback(
      new HttpException('File name to long', HttpStatus.BAD_REQUEST),
      false,
    );
  }
  callback(null, true);
};

export const unlinkFile = (path: string) => {
  return fs.unlinkSync(path);
};

export const unlinkFileAsync = async (path: string) => {
  let success = false, msg = "";
  try {
    fs.unlinkSync(path);
    success = true;
  } catch (error) {
    console.log(error.message);
    msg = error.message;
  }
  return { success, msg };
};

export const moveFile = async (oldPath: string) => {
  let success = false, msg = "", filePath = "";
  try {
    const isTmp = oldPath.includes("tmp");
    const newPath = oldPath.replace("tmp", "uploads");
    fs.renameSync(oldPath, newPath);
    filePath = newPath;
    success = true;

    if (!isTmp) { success = false; msg = "File is not tmp file" }
  } catch (error) {
    console.log(error.message);
    msg = error.message;
  }
  return { success, msg, filePath };
}

export const getFileInformation = (filePath: string) => {
  try {
    const file = fs.statSync(filePath);
    const fileName = basename(filePath);
    const fileType = extname(filePath);
    const fileMimeType = lookup(fileType);
    return {
      fileType,
      fileMimeType,
      fileName: fileName,
      fileSize: file.size,
      fileMtime: file.mtime
    };
  } catch (error) {
    throw new Error(error.message);
  }
}