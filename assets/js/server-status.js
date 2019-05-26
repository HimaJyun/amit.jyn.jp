{
    "use strict";
    const element = document.getElementById("amit-status");

    function updateStatus(json = null) {
        console.log(json);
        while(element.firstChild) {
            element.removeChild(element.firstChild);
        }

        // エラー
        if(json === null) {
            const date = new Date();
            // <p>n時n分: <span class="amit-status-offline">取得できません</span></p>
            const p = document.createElement("p");
            p.append(`${date.getHours()}時${date.getMinutes()}分: `);
            const span = document.createElement("span");
            span.classList.add("amit-status-offline");
            span.textContent = "取得できません";
            p.appendChild(span);
            element.appendChild(p);
            // 1分後にもう一回試す
            setTimeout(getStatus,60*1000);
            return;
        }

        const date = new Date(json.date * 1000);
        if(json.online) {
            // オンライン
            // <p>n時n分: <span class="amit-status-online">オンライン</span></p>
            const p = document.createElement("p");
            p.append(`${date.getHours()}時${date.getMinutes()}分: `);
            const span = document.createElement("span");
            span.classList.add("amit-status-online");
            span.textContent = "オンライン";
            p.appendChild(span);
            element.appendChild(p);
            // <p>ユーザー: 10/30</p>
            const p2 = document.createElement("p");
            p2.textContent = `ユーザー: ${json.players}/${json.max_players}`;
            element.appendChild(p2);
            // <p class="amit-status-player"><img src="/api/headskin?user=HimaJyun" alt="HimaJyun" width="48" heigth="48" title="HimaJyun"></p>
            const p3 = document.createElement("p");
            p3.classList.add("amit-status-player");
            for(let player of json.player_list) {
                const img = document.createElement("img");
                img.src = `/api/headskin?user=${player}`;
                img.alt = player;
                img.title = player;
                img.width = 48;
                img.height = 48;
                p3.appendChild(img);
            }
            element.appendChild(p3);
        } else {
            // オフライン
            // <p>n時n分: <span class="amit-status-offline">オフライン</span></p>
            const p = document.createElement("p");
            p.append(`${date.getHours()}時${date.getMinutes()}分: `);
            const span = document.createElement("span");
            span.classList.add("amit-status-offline");
            span.textContent = "オフライン";
            p.appendChild(span);
            element.appendChild(p);
        }
        // キャッシュが切れる頃合いで更新
        let expires = json.expires * 1000;
        expires -= Date.now();
        expires += 30*1000; // 回線状況とか時刻ズレ起きてるかもしれないからちょっと遅らせる
        // nictのNTPとか使って合わせたら良いかもしれないが、そこまでするほどの物でもない。
        if(expires < 0) {
            // 0を下回ってる -> 時計ズレすぎ？
            return;
        }
        setTimeout(getStatus,expires);
    }

    function getStatus() {
        fetch("/api/status/")
        .then(response => {
            if(response.ok) {
                return response.json();
            } else {
                throw new Error();
            }
        })
        .then(obj => updateStatus(obj))
        .catch(_ => updateStatus(null))
    }
    getStatus();
}
