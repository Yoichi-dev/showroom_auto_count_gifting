(async () => {
    // トークン取得
    const tokenRes = await fetch(
        `https://www.showroom-live.com/api/csrf_token`
    )
    const tokenResJson = await tokenRes.json()
    const csrfToken = tokenResJson.csrf_token
    console.log(csrfToken)

    // URL Key取得
    const room_url_key = location.href.replace('https://www.showroom-live.com/r/', '')
    console.log(room_url_key)

    // LIVE ID取得
    const statusRes = await fetch(
        `https://www.showroom-live.com/api/room/status?room_url_key=${room_url_key}`
    )
    const statusResJson = await statusRes.json()
    const liveId = statusResJson.live_id
    console.log(liveId)

    let countElm = document.createElement("li");
    countElm.setAttribute("id", "count-start");
    let countTextElm = document.createElement("a");
    countTextElm.setAttribute("id", "count-text");
    countTextElm.textContent = "ｶｳﾝﾄ";
    countTextElm.style.color = "white";
    countTextElm.style.marginLeft = "1em";
    countTextElm.style.cursor = "pointer";
    countElm.append(countTextElm);

    let freeGiftElm = document.createElement("li");
    freeGiftElm.setAttribute("id", "throw-free");
    let freeGiftTextElm = document.createElement("a");
    freeGiftTextElm.setAttribute("id", "throw-free-text");
    freeGiftTextElm.textContent = "無料ｷﾞﾌﾄ";
    freeGiftTextElm.style.color = "white";
    freeGiftTextElm.style.cursor = "pointer";
    freeGiftElm.append(freeGiftTextElm);

    let myMainParent = document.getElementsByClassName("st-header__item")[0].parentNode;
    myMainParent.insertBefore(countElm, myMainParent.firstElementChild);
    myMainParent.insertBefore(freeGiftElm, myMainParent.firstElementChild);

    const method = "POST";
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    };
    document.getElementById('count-start').addEventListener('click', () => {
        (async () => {
            let countTextElm = document.getElementById('count-text')
            document.getElementById('count-start').style.pointerEvents = "none"
            console.log('カウント開始')
            for (let i = 0; i <= 50; i++) {
                console.log(i)
                countTextElm.textContent = i
                const obj = {
                    live_id: liveId,
                    comment: i,
                    recommend_comment_id: "",
                    comment_type: "",
                    is_delay: 0,
                    csrf_token: csrfToken
                }
                const body = Object.keys(obj).map((key) => key + "=" + encodeURIComponent(obj[key])).join("&");
                await fetch("https://www.showroom-live.com/api/live/post_live_comment", { method, headers, body })
                await waitTime(2000);
            }
            console.log('カウント終了')
            document.getElementById('count-start').style.display = "none"
        })();
    });

    document.getElementById('throw-free').addEventListener('click', () => {
        (async () => {
            let giftTextElm = document.getElementById('throw-free-text')
            giftTextElm.textContent = "星投げ中"
            document.getElementById('throw-free').style.pointerEvents = "none"
            console.log('無料ギフト投げ開始')
            // 横一列1回
            for (let i = 0; i < 5; i++) {
                let remaining = Number(document.getElementsByClassName("gift")[i].getElementsByClassName('num')[0].textContent.replace('\n    × ', '').replace('\n  ', ''))
                let giftId = document.getElementsByClassName("gift")[i].getElementsByTagName('img')[0].src.replace('https://image.showroom-cdn.com/showroom-prod/assets/img/gift/', '').split('_')[0]
                let obj = {
                    gift_id: giftId,
                    live_id: liveId,
                    num: 10,
                    is_delay: 0,
                    csrf_token: csrfToken
                }
                if (remaining < 10) {
                    obj.num = remaining % 10
                }
                const body = Object.keys(obj).map((key) => key + "=" + encodeURIComponent(obj[key])).join("&")
                await fetch("https://www.showroom-live.com/api/live/gifting_free", { method, headers, body })
                await waitTime(600);
            }
            await waitTime(1000);
            // 縦に全部
            for (let i = 0; i < 5; i++) {
                let remaining = Number(document.getElementsByClassName("gift")[i].getElementsByClassName('num')[0].textContent.replace('\n    × ', '').replace('\n  ', ''))
                let giftId = document.getElementsByClassName("gift")[i].getElementsByTagName('img')[0].src.replace('https://image.showroom-cdn.com/showroom-prod/assets/img/gift/', '').split('_')[0]
                while (remaining != 0) {
                    let obj = {
                        gift_id: giftId,
                        live_id: liveId,
                        num: 10,
                        is_delay: 0,
                        csrf_token: csrfToken
                    }
                    if (remaining % 10 != 0) {
                        obj.num = remaining % 10
                        remaining -= remaining % 10
                    } else {
                        remaining -= 10
                    }
                    const body = Object.keys(obj).map((key) => key + "=" + encodeURIComponent(obj[key])).join("&")
                    await fetch("https://www.showroom-live.com/api/live/gifting_free", { method, headers, body })
                    await waitTime(600);
                }
            }
            giftTextElm.textContent = "無料ｷﾞﾌﾄ"
            document.getElementById('throw-free').style.pointerEvents = ""
            console.log('無料ギフト投げ終了')
        })();
    });
})();

function waitTime(time) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('resolved');
        }, time);
    });
}