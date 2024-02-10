import cron from "node-cron";
import fs from "fs/promises";
import axios from "axios";
import { get_sessionId, get_token } from "./router/gateway";
export { refresh_sid, refresh_remid, refresh_sessionId, refresh_token };

export interface Account {
    sid: string;
    remid: string;
    sessionId: string;
    authCode: string;
    token: string;
    personaId: string;
    name: string;
}

export async function refresh() {
    console.log('执行获取remid')
    await refresh_remid()
    console.log('执行获取sid')
    await refresh_sid();
    console.log('执行获取sessionId')
    await refresh_sessionId();
    console.log('执行获取token')
    await refresh_token();
    console.log('获取完毕')

    cron.schedule("0 0 */12 * * *", () => {
        console.log(new Date().toLocaleString() + "每12小时刷新sessionId");
        refresh_sessionId();
    });
    cron.schedule("0 0 0 */7 * *", () => {
        console.log(new Date().toLocaleString() + "每7天刷新sid");
        refresh_sid();
    });

    cron.schedule("0 0 */3 * * *", () => {
        console.log(new Date().toLocaleString() + "每3小时刷新token");
        refresh_token();
    });
}

async function refresh_sid() {
    //通过获取sid可刷新sid的有效期，同时获取authcode
    let account: Account = await get_account()
    const Cookie = { Cookie: `sid=${account.sid};}` };
    let result: any = await req_cookies(Cookie);
    let location = result.headers.location;
    if (location.match("fid=")) {
        console.log("sid失效,执行刷新remid来获取sid");
        refresh_remid()
    }
    let newCookie = result.headers.get("set-cookie");
    let matchsid = newCookie[0].match(/sid=([^;]+)/);
    account.sid = matchsid[1];
    account.authCode = location.replace(/.*code=(.*)/, "$1");
    write_account(account)
}

async function refresh_remid() {
    let account: Account = await get_account()
    const Cookie = { Cookie: `remid=${account.remid};` };
    let result: any = await req_cookies(Cookie);
    let location = result.headers.location;
    if (location.match("fid="))
        throw Error("remid失效");
    let newCookie = result.headers.get("set-cookie");
    let matchremid = newCookie[0].match(/remid=([^;]+)/)
    account.remid = matchremid[1]
    let matchsid = newCookie[1].match(/sid=([^;]+)/)
    account.sid = matchsid[1];
    account.authCode = location.replace(/.*code=(.*)/, "$1");
    write_account(account)
}

async function refresh_sessionId() {
    //返回sessionId和personaId
    try {
        let account: Account = await get_account()
        let info = await get_sessionId(account.authCode)
        account.sessionId = info.sessionId;
        account.personaId = info.personaId;
        write_account(account)
    } catch (error) {

    }

}

async function refresh_token() {
    //返回token
    let account: Account = await get_account()
    let token = await get_token({ sid: account.sid });
    account.token = token
    write_account(account)
}

export let get_account = async () => {
    return JSON.parse(
        await fs.readFile("./assets/config/accounts.json", "utf-8")
    ) as Account
}

let write_account = async (account: Account) => {
    await fs.writeFile(
        "./assets/config/accounts.json",
        JSON.stringify(account),
        "utf-8"
    );
}

let req_cookies = async (Cookie: object) => {
    return await axios({
        url: "https://accounts.ea.com/connect/auth?response_type=code&locale=zh_CN&client_id=sparta-backend-as-user-pc&display=junoWeb%2Flogin",
        method: "get",
        headers: Cookie,
        validateStatus: () => true, // 返回所有响应
        maxRedirects: 0, // 禁止重定向
    })
}