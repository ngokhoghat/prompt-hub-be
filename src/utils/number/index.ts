export function generateOTP(lenght: number) {
    let digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < lenght; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

export function generatePassword(lenght: number) {
    let digits = 'aAbBcCdDeEfFgGhHiIkKlLmM0123456789';
    let OTP = '';
    for (let i = 0; i < lenght; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
const symbols = ['@', '#', '$', '%'];
const characterCodes = Array.from(Array(26)).map((_, i) => i + 97);
const lowercaseLetters = characterCodes.map(code => String.fromCharCode(code));
const uppercaseLetters = lowercaseLetters.map(letter => letter.toUpperCase());
const availableCharacter = [
    ...numbers,
    ...symbols,
    ...lowercaseLetters,
    ...uppercaseLetters
]

export function generateRandomString(length) {
    let randomPassword = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * availableCharacter.length);
        randomPassword += availableCharacter[randomIndex];
    }

    return randomPassword;
}

export function generateRandomNumber(length) {
    let randomNumber = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * numbers.length);
        randomNumber += numbers[randomIndex];
    }

    return randomNumber;
}