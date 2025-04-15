import fingerPrint from "@fingerprintjs/fingerprintjs";
import { AES, enc } from "crypto-js";
import localforage from "localforage";

localforage.config({
    driver: localforage.INDEXEDDB,
    name: "lensix",
});

export const addSessionToUrl = async (url: string) => {
    const newUrl = new URL(url);
    const encrypted_lensix_web_ession: string =
        (await localforage.getItem("lensix_web_session")) ?? "";
    const decrypted_lensix_web_session = await decryptData(
        encrypted_lensix_web_ession,
    );
    newUrl.searchParams.set("lensix_web_session", decrypted_lensix_web_session);
    newUrl.searchParams.set("origin", window.location.origin);
    return newUrl.href;
};

export async function encryptData(data: string) {
    const key = await getFinterPrint();
    const encryptedData = AES.encrypt(data, key).toString();
    return encryptedData;
}

export async function decryptData(encryptedData: string) {
    try {
        const key = await getFinterPrint();
        const bytes = AES.decrypt(encryptedData, key);
        const decryptedData = bytes.toString(enc.Utf8);
        return decryptedData;
    } catch {
        return "null";
    }
}

export async function getFinterPrint(): Promise<string> {
    return new Promise((resolve) => {
        fingerPrint
            .load()
            .then((fp) => fp.get())
            .then((result) => {
                const visitorId = result.visitorId;
                resolve(visitorId);
            });
    });
}



export function convertTimestamp(isoTimestamp: string) {
    if (!isoTimestamp) {
        return {formatedDate: null, formatedTime: null}
    }
    const date = new Date(isoTimestamp);

    // Extract components
    const day = date.getUTCDate();
    const month = date.toLocaleString('en-US', { month: 'short' }); // e.g., "Nov"
    const year = date.getUTCFullYear();
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();

    // Convert 24-hour time to 12-hour time with AM/PM
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12; // Adjust hour to 12-hour format

    // Format components as required
    const formatedDate = `${day} ${month} ${year} `;
    const formatedTime = `${hour12}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${period}`;

    return {formatedDate, formatedTime};
}



export const getObjectFromListKeyValue = (
  key: string,
  value: string,
  objectList: any[]
) => {
  return objectList?.find((o: any) => o[key] === value) || null;
};
