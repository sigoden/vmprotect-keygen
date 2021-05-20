import * as crypto from "crypto";
import * as BigInt from "big-integer";
export interface ProductInfo {
    algorithm: string;
    bits: number;
    private: string;
    modulus: string;
    productCode: string; 
}

export interface SerialNumberInfo {
  userName?: string;
  email?: string;
  expDate?: Date;
  maxBuildDate?: Date;
  runningTimeLimit?: number;
  hardwardId?: Buffer;
  userData?: Buffer;
}

export function createKeyGen(productInfo: ProductInfo) {
  return (serialInfo: SerialNumberInfo) => {
    let serial = packSerial(serialInfo, Buffer.from(productInfo.productCode, "base64"));
    const hash = sha1(serial);
    serial = Buffer.concat([serial, packUint8(255), hash.slice(0, 4).reverse()]);
    serial = paddingSerial(serial, productInfo.bits);
    const res = BigInt(serial.toString("hex"), 16).modPow(toBitInt(productInfo.private), toBitInt(productInfo.modulus));
    return Buffer.from(res.toString(16), "hex").toString("base64"); 
  }
}

function packSerial(info: SerialNumberInfo, productCode: Buffer) {
  const {
    userName,
    email,
    expDate,
    maxBuildDate,
    runningTimeLimit,
    hardwardId,
    userData,
  } = info;
  const pieces: Buffer[] = [];
  pieces.push(packUint8(1));
  pieces.push(packUint8(1));
  if (userName) {
    if (userName.length > 255) throw new Error("userName is too long");
    pieces.push(packUint8(2));
    pieces.push(packString(userName));
  }
  if (email) {
    if (email.length > 255) throw new Error("email is too long");
    pieces.push(packUint8(3));
    pieces.push(packString(email));
  }
  if (hardwardId) {
    if (hardwardId.length > 255) throw new Error("hardwareId is too long");
    if (hardwardId.length % 4 !== 0) throw new Error("hardwareId has bad size");
    pieces.push(packUint8(4));
    pieces.push(packUint8(hardwardId.length));
    pieces.push(hardwardId);
  }
  if (expDate) {
    pieces.push(packUint8(5));
    pieces.push(packDate(expDate));
  }
  if (runningTimeLimit) {
    if (runningTimeLimit < 0 || runningTimeLimit > 255) throw new Error("runningTimeLImit is incorrect");
    pieces.push(packUint8(6));
    pieces.push(packUint8(runningTimeLimit));
  }
  pieces.push(packUint8(7));
  if (productCode.length !== 8) throw new Error("productCode has invalid size");
  pieces.push(productCode);
  if (userData) {
    pieces.push(packUint8(8));
    pieces.push(packUint8(userData.length));
    pieces.push(userData);
  }
  if (maxBuildDate) {
    pieces.push(packUint8(9));
    pieces.push(packDate(maxBuildDate));
  }
  return Buffer.concat(pieces);
}

function paddingSerial(serial: Buffer, bits: number) {
  const frontPieces: Buffer[] = [];
  frontPieces.push(Buffer.from([0x0, 0x2]));
  frontPieces.push(Buffer.from(Array.from(Array(randN(8) + 8)).map(_ => randN(254) + 1)));
  frontPieces.push(Buffer.from([0]));
  const paddingFront = Buffer.concat(frontPieces);
  const contentSize = serial.length + paddingFront.length;
  const rest = Math.floor(bits / 8) - contentSize;
  if (rest < 0) {
    throw new Error("serial is to big to fit in key");
  }
  const paddingBack = Buffer.from(Array.from(Array(rest)).map(_ => randN(255)));
  const finialSerial = Buffer.concat([paddingFront, serial, paddingBack]);
  return finialSerial;
}

function toBitInt(value: string) {
  return BigInt(Buffer.from(value, "base64").toString("hex"), 16);
}

function packString(data: string) {
  return Buffer.concat([packUint8(data.length), Buffer.from(data, "utf8")]);
}

function packDate(date: Date) {
  const buf = Buffer.alloc(4);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const value = (year << 16) | (month << 8) | day;
  buf.writeUInt32LE(value);
  return buf;
}

function packUint8(byte: number) {
  return Buffer.from([byte]);
}

function sha1(buf: Buffer) {
  const sha1 = crypto.createHash("sha1", { encoding: "binary" });
  sha1.update(buf);
  return sha1.digest();
}

function randN(n: number) {
  return Math.floor(Math.random() * n);
}
