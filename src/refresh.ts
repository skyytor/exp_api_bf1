



/* 
async function refresh_account() {
    if (config.accounts.length === 0)
        return console.log('未配置服管账号，大部分功能将无法使用')
    for (let [index, i] of config.accounts.entries()) {
        let get_account_cookies

        if (!i.sid) {
            console.log('sid失效,尝试使用remid刷新')
            get_account_cookies = await api.get_account(ctx, { remid: i.remid })
            config.accounts[index].remid = get_account_cookies.remid
        } else {
            get_account_cookies = await api.get_account(ctx, { sid: i.sid })
        }
        config.accounts[index].sid = get_account_cookies.sid
        let get_account_sessionId = await api.get_sessionId(ctx, get_account_cookies.authCode)
        let result_get_token = await api.get_token(ctx, { sid: get_account_cookies.sid })
        config.accounts[index].personaId = get_account_sessionId.personaId

        config.accounts[index].sessionId = get_account_sessionId.sessionId
        config.accounts[index].authcode = get_account_cookies.authCode
        config.accounts[index].token = result_get_token
        let result_get_displayName = await api.post(ctx, config, {
            jsonrpc: '2.0',
            method: 'RSP.getPersonasByIds',
            params: {
                game: 'tunguska',
                personaIds: [get_account_sessionId.personaId]
            },
            id: null
        })
        config.accounts[index].displayName = result_get_displayName.data[get_account_sessionId.personaId].displayName
        ctx.scope.update(config, false)
    }
}
 */