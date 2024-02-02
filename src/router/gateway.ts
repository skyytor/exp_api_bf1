import axios from 'axios'

export { native_ea_api }


export { get_account, get_sessionId, get_token, get_personaId, post }

const native_ea_api: string = 'https://sparta-gw.battlelog.com/jsonrpc/pc/api'


let error_code_collection :object= {
    "-32501": "session失效,请注意刷新session",
    "-32504": "连接超时",
    "-34501": "找不到服务器",
    "-32601": "方法不存在",
    "-32602": "请求无效/格式错误",
    "-35150": "战队不存在",
    "-35160": "无权限",
    "-32603": "该账号可能没有对应的权限，也可能是其他问题",
    "-32850": "服务器栏位已满/玩家已在栏位",
    "-32851": "服务器不存在/已过期",
    "-32856": "该玩家没玩过bf1",
    "-32857": "无法处置管理员",
    "-32858": "服务器未开启",
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function error_handle(error_code: string) {
    const keys = Object.keys(error_code_collection)
    if (keys.indexOf(error_code) > -1)
        return {
            data: error_code,
            error: error_code_collection[error_code] 
        }
    else return {
        data: null,
        error: '出现错误，但未找到该错误代码所对应的问题，错误代码:' + error_code
    }
}

//此处的ctx不能声明为context类型，原因未知
async function get_account({ remid, sid }: any = {}) {
    try {
        if (!remid && !sid) throw new Error('未提供Cookie')
        const Cookie = `${remid ? `remid=${remid};` : ''}${sid ? `sid=${sid};` : ''}`
        let result: any = await axios({
            url: 'https://accounts.ea.com/connect/auth?response_type=code&locale=zh_CN&client_id=sparta-backend-as-user-pc&display=junoWeb%2Flogin',
            method: 'get',
            headers: { Cookie: Cookie },
            validateStatus: () => true, // 返回所有响应
            maxRedirects: 0 // 禁止重定向
        })
        if (remid && !sid) {
            try {
                let location = result.headers.location
                if (location.match('fid=')) {
                    console.log('remid失效')
                    return {
                        remid: null,
                        sid: null,
                        authCode: null
                    }
                }
                let authCode = location.replace(/.*code=(.*)/, '$1')
                let newCookie = result.headers.get('set-cookie')
                const matchremid = newCookie[0].match(/remid=([^;]+)/)
                remid = matchremid[1]
                let matchsid = newCookie[1].match(/sid=([^;]+)/)
                sid = matchsid[1]
                return {
                    remid: remid,
                    sid: sid,
                    authCode: authCode
                }
            } catch (error) {
                console.log('根据remid获取session时出错')
            }
        } else if (sid && !remid) {
            try {
                let location = result.headers.location
                if (location.match('fid=')) {
                    console.log('sid失效')
                    return {
                        remid: null,
                        sid: null,
                        authCode: null
                    }
                }
                let authCode = location.replace(/.*code=(.*)/, '$1')
                let newCookie = result.headers.get('set-cookie')
                let matchsid = newCookie[0].match(/sid=([^;]+)/)
                sid = matchsid[1]
                return {
                    remid: null,
                    sid: sid,
                    authCode: authCode
                }
            } catch (error) {
                console.log('根据sid获取session时出错')
            }
        }
    } catch (error) {
        console.log('自动获取sid,authcode时出错')
        console.log(error)
    }
}
//根据authcode来获取sessionId,pid
async function get_sessionId(authCode: string) {
    try {
        let login = await axios({
            url: native_ea_api,
            method: 'post',
            data: {
                jsonrpc: '2.0',
                method: 'Authentication.getEnvIdViaAuthCode',
                params: {
                    game: 'tunguska',
                    authCode: authCode,
                    locale: 'zh-tw'
                },
                id: 'null'
            }
        })
        const sessionId = login.data.result.sessionId
        const personaId = login.data.result.personaId
        return {
            sessionId: sessionId,
            personaId: personaId
        }
    } catch (error) {
        console.log('自动获取sessionId时出错')
    }
}

//根据remid或者sid来获取token
async function get_token({ remid, sid }: any = {}) {

    if (!remid && !sid) throw new Error('未提供Cookie')
    const Cookie = `${remid ? `remid=${remid};` : ''}${sid ? `sid=${sid};` : ''}`
    let result = await axios({
        url: 'https://accounts.ea.com/connect/auth?response_type=token&locale=zh_CN&client_id=ORIGIN_JS_SDK&redirect_uri=nucleus%3Arest',
        method: 'get',
        headers: { Cookie: Cookie },
        validateStatus: () => true,
        maxRedirects: 0
    })
    return result.data.access_token
}

//根据token来从name获取pid
async function get_personaId(playername: string, token: string) {

    try {
        let result = await axios({
            url: 'https://gateway.ea.com/proxy/identity/personas?namespaceName=cem_ea_id&displayName=' + playername,
            method: 'get',
            headers: {
                Host: 'gateway.ea.com',
                Accept: 'application/json',
                'X-Expand-Results': true,
                Authorization: 'Bearer ' + token
            }
        })
        console.log(result.data.personas.persona)
        return result.data.personas.persona
    } catch (error) {
        console.log('出错了,可能是token失效')
        console.log(error)
        return 'error,token expired'
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//api函数部分



async function post(data: object) {
    try {
        let sessionId:string = '3daa374f-e0b6-4b1b-b807-5bbf67270cf6'
        let result = await axios({
            url: native_ea_api,
            method: 'post',
            headers: {
                'Content-Type': 'text/json',
                'X-Gatewaysession': sessionId
            },
            data: data,
            timeout: 60000,
        })
        return {
            data: result.data.result,
            error: null
        }
    } catch (error) {
        console.log('通用post请求出错')
        console.log(error.response)

    }
}

export async function playerlist13(gameid: string) {
    try {
        let result = await axios({
            url: 'http://127.0.0.1:5000/blaze/getPlayerList',
            method: 'post',
            data: {
                game_ids: [gameid],//这里填写服务器的gameid
                origin: true,
                platoon: false
            },
            timeout: 3000
        })
        return {
            data: result.data,
            error: null
        }
    } catch (error) {
        console.log('error with bf1playerlist13')
        //console.log(error)
        return {
            data: null,
            error: error
        }
    }
}

export async function serverinfo(filter_json: object) {

    return await post({
        jsonrpc: '2.0',
        method: 'GameServer.searchServers',
        params: {
            game: 'tunguska',
            filterJson: JSON.stringify(filter_json),
            limit: 200
        },
        id: null
    })

}

//服管部分
export async function kick(gameId: string, personaId: string, reason = '違反規則') {

    return await post({
        jsonrpc: '2.0',
        method: 'RSP.kickPlayer',
        params: {
            game: 'tunguska',
            gameId: gameId,
            personaId: personaId,
            reason: reason,
        },
        id: null
    })

}

export async function ban(serverId: string, personaId: string) {

    return await post({
        jsonrpc: '2.0',
        method: 'RSP.addServerBan',
        params: {
            game: 'tunguska',
            serverId: serverId,
            personaId: personaId
        },
        id: null
    })

}

export async function unban(serverId: string, personaId: string) {

    return await post({
        jsonrpc: '2.0',
        method: 'RSP.removeServerBan',
        params: {
            game: 'tunguska',
            serverId: serverId,
            personaId: personaId
        },
        id: null
    })
}

export async function vip(serverId: string, personaId: string) {


    return await post({
        jsonrpc: '2.0',
        method: 'RSP.addServerVip',
        params: {
            game: 'tunguska',
            serverId: serverId,
            personaId: personaId
        },
        id: null
    })
}

export async function unvip(serverId, personaId) {

    return await post({
        jsonrpc: '2.0',
        method: 'RSP.removeServerVip',
        params: {
            game: 'tunguska',
            serverId: serverId,
            personaId: personaId
        },
        id: null
    })
}

export async function addadmin(serverId, personaId) {

    return await post({
        jsonrpc: '2.0',
        method: 'RSP.addServerAdmin',
        params: {
            game: 'tunguska',
            serverId: serverId,
            personaId: personaId
        },
        id: null
    })
}

export async function removeadmin(serverId, personaId) {

    return await post({
        jsonrpc: '2.0',
        method: 'RSP.removeServerAdmin',
        params: {
            game: 'tunguska',
            serverId: serverId,
            personaId: personaId
        },
        id: null
    })
}

export async function chooseLevel(persistedGameId, levelIndex) {

    return await post({
        jsonrpc: '2.0',
        method: 'RSP.chooseLevel',
        params: {
            game: 'tunguska',
            persistedGameId: persistedGameId,
            levelIndex: levelIndex
        },
        id: null
    })
}

//活动交换部分
export async function exchange() {

    return await post({
        jsonrpc: '2.0',
        method: 'ScrapExchange.getOffers',
        params: {
            game: 'tunguska',
        },
        id: null
    })
}

export async function campaign() {

    return await post({
        jsonrpc: '2.0',
        method: 'CampaignOperations.getPlayerCampaignStatus',
        params: {
            game: 'tunguska',
        },
        id: null
    })
}

//服务器信息部分
export async function getServerDetails(gameId: string) {

    return await post({
        jsonrpc: '2.0',
        method: 'GameServer.getFullServerDetails',
        params: {
            game: 'tunguska',
            gameId: gameId

        },
        id: null
    })
}

export async function playerinfo(personaIds: [number|string]) {
    
    return await post({
        jsonrpc: '2.0',
        method: 'RSP.getPersonasByIds',
        params: {
            game: 'tunguska',
            personaIds: personaIds

        },
        id: null
    })
}

//战绩部分
export async function stat(personaId: string) {

    return await post({
        jsonrpc: '2.0',
        method: 'Stats.detailedStatsByPersonaId',
        params: {
            game: 'tunguska',
            personaId: personaId

        },
        id: null
    })
}

export async function weapon(personaId: string) {

    return await post({
        jsonrpc: '2.0',
        method: 'Progression.getWeaponsByPersonaId',
        params: {
            game: 'tunguska',
            personaId: personaId

        },
        id: null
    })
}

export async function vehicle(personaId: string) {

    return await post({
        jsonrpc: '2.0',
        method: 'Progression.getVehiclesByPersonaId',
        params: {
            game: 'tunguska',
            personaId: personaId

        },
        id: null
    })
}

export async function recent_history(personaId: string) {

    return await post({
        jsonrpc: '2.0',
        method: 'ServerHistory.mostRecentServers',
        params: {
            game: 'tunguska',
            personaId: personaId

        },
        id: null
    })
}

export async function is_playing(personaId: string) {


    return await post({
        jsonrpc: '2.0',
        method: 'GameServer.getServersByPersonaIds',
        params: {
            game: 'tunguska',
            personaIds: [personaId]
        },
        id: null
    })
}
//战地查询战绩软件的浏览量，外挂，可疑标记数
export async function record_getReport(personaId: string) {

    try {
        let result = await axios({
            url: 'https://record.ainios.com/getReport',
            method: 'post',
            data: { personaId: personaId }
        })
        return {
            data: result.data,
            error: null
        }
    } catch (error) {
        return {
            data: null,
            error: error.response.data
        }
    }

}

export async function bfeac_api(playname: string) {

    try {
        let result = await axios({
            url: 'https://api.bfeac.com/case/EAID/' + playname,
            method: 'get'
        })
        return result.data
    } catch (error) {
        return {
            data: null,
            error: error.response.data
        }
    }

}

export async function bfban_api(personaId: string) {

    try {
        let result = await axios({
            url: 'https://api.gametools.network/bfban/checkban?personaids=' + personaId,
            method: 'get'
        })
        return result.data
    } catch (error) {
        return {
            data: null,
            error: error.response.data
        }
    }


}

export async function btr(search_query: string) {
    try {
        let result = await axios({
            url: 'https://api.tracker.gg/api/v2/bf1/standard/' + search_query,
            method: 'get',
            headers: {
                'Host': 'api.tracker.gg',
                'Accept-Encoding': 'gzip',
                'Content-Type': 'application/json',
                'User-Agent': 'Tracker Network App/3.22.9',
                'x-app-version': '3.22.9'
            }
        })

        return result.data
    } catch (error) {
        console.log(error)

    }


}