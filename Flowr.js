( () => {
    "use strict";
    var t, e, i, s, a = {
        28: (t, e, i) => {
            i.d(e, {
                I7: () => n,
                PW: () => s,
                _O: () => a
            });
            const s = (t, e=0) => t[e] | t[e + 1] << 8
              , a = t => {
                const e = unescape(encodeURIComponent(t))
                  , i = new Uint8Array(e.length + 1);
                for (let t = 0; t < e.length; t++)
                    i[t] = e.charCodeAt(t);
                return i[e.length] = 0,
                i
            }
              , n = (t, e=0) => {
                let i = ""
                  , s = e;
                for (; 0 !== t[s] && s < t.length; )
                    i += String.fromCharCode(t[s]),
                    s++;
                return decodeURIComponent(escape(i))
            }
        }
        ,
        58: (t, e, i) => {
            i.a(t, (async (t, e) => {
                try {
                    var s = i(512)
                      , a = i(110)
                      , n = i(446)
                      , h = i(904)
                      , r = i(111)
                      , o = i(28)
                      , l = i(874);
                    function d(t) {
                        const e = [];
                        if (s.A.mobTable?.length > 0) {
                            for (let i = 0; i < t; i++)
                                e.push(s.A.mobTable[Math.random() * s.A.mobTable.length | 0]);
                            return e
                        }
                        let i = !1
                          , a = 0
                          , h = 0;
                        for (let s = 0; s < t; s++)
                            for (; ; ) {
                                if (Math.random() > .925 && h < 3) {
                                    h++,
                                    e.push(-1);
                                    break
                                }
                                const s = Math.random() * n.ey.length | 0
                                  , r = n.ey[s].name.toLowerCase();
                                if (!n.ey[s].isSystem) {
                                    if (n.ey[s].tiers[0].antHoleSpawns?.length > 0) {
                                        if (i)
                                            continue;
                                        i = !0
                                    } else if (r.includes("ant") || r.includes("termite") || r.includes("system"))
                                        continue;
                                    if (!(r.includes("queen") && r.includes("egg") || (r.includes("shiny") || r.includes("angelic")) && Math.random() > .01)) {
                                        if (r.includes("demon")) {
                                            if (a >= .125 * t)
                                                continue;
                                            a++
                                        }
                                        e.push(s);
                                        break
                                    }
                                }
                            }
                        return e
                    }
                    function c() {
                        if (s.A.mobTable?.length > 0)
                            return s.A.mobTable[Math.random() * s.A.mobTable.length | 0];
                        let t = 0;
                        for (; t++ < 100; ) {
                            const t = Math.random() * n.ey.length | 0
                              , e = n.ey[t].name.toLowerCase();
                            if (n.ey[t].tiers[0].antHoleSpawns?.length > 0 && Math.random() > .9)
                                return t;
                            if (!((e.includes("ant") || e.includes("termite")) && Math.random() > .2)) {
                                if (e.includes("demon") && Math.random() > .995)
                                    return t;
                                if (!n.ey[t].isSystem)
                                    return t
                            }
                        }
                        return 0
                    }
                    setInterval(( () => {
                        const t = performance.now();
                        switch (s.A.spatialHash.clear(),
                        s.A.viewsSpatialHash.clear(),
                        s.A.entities.forEach((t => {
                            t.update()
                        }
                        )),
                        s.A.entities.forEach((t => {
                            t._AABB && t.collide()
                        }
                        )),
                        s.A.gamemode) {
                        case a.LX.FFA:
                        case a.LX.TDM:
                            {
                                const t = s.A.width
                                  , e = 1024 + 256 * (s.A.clients.size - 1);
                                t !== e && (s.A.width = s.A.height = e,
                                s.A.maxMobs = 10 + 2 * (s.A.clients.size - 1),
                                s.A.clients.forEach((t => t.sendRoom())))
                            }
                            break;
                        case a.LX.WAVES:
                            if (s.A.isWaves && s.A.livingMobCount <= 0) {
                                s.A.currentWave++,
                                s.A.maxMobs = Math.min(64, 6 + 2 * s.A.currentWave),
                                s.A.width = s.A.height = Math.min(1024 + 81 * s.A.currentWave, Math.pow(128, 2)),
                                s.A.clients.forEach((t => t.sendRoom()));
                                const t = d(s.A.maxMobs);
                                for (let e = 0; e < s.A.maxMobs; e++) {
                                    if (-1 === t[e]) {
                                        new h.cS(s.A.random(),Math.max(0, (0,
                                        l.ZL)(s.A.currentWave, 4.83 * Math.pow(1.012, s.A.currentWave), n.cK.length - 1)),s.A.currentWave);
                                        continue
                                    }
                                    const i = new h.Bw(s.A.random());
                                    i.define(n.ey[t[e]], (0,
                                    l.ZL)(s.A.currentWave, 4.83 * Math.pow(1.012, s.A.currentWave), n.cK.length - 1)),
                                    s.A.aliveMobs.push(i)
                                }
                            }
                            break;
                        case a.LX.LINE:
                            {
                                const t = s.A.width
                                  , e = s.A.height;
                                s.A.width = 16384,
                                s.A.height = 4096,
                                s.A.maxMobs = 10 + 2 * (s.A.clients.size - 1),
                                t === s.A.width && e === s.A.height || s.A.clients.forEach((t => t.sendRoom()))
                            }
                            break;
                        case a.LX.MAZE:
                            s.A.maxMobs = s.A.biome === a.VC.ANT_HELL ? 32 + 12 * s.A.clients.size : 24 + 6 * s.A.clients.size
                        }
                        if (!s.A.isWaves && s.A.livingMobCount < s.A.maxMobs && Math.random() > .9)
                            if (s.A.gamemode === a.LX.MAZE) {
                                let t = n.ey[c()];
                                const e = s.A.spawnNearPlayer(t);
                                if (void 0 !== e.tile?.spawn) {
                                    const i = s.A.mapData.mobSpawners.find((t => {
                                        t.id,
                                        e.tile
                                    }
                                    ));
                                    if (i && i.availableMobs.length) {
                                        const s = i.availableMobs[i.availableMobs.length * Math.random() | 0];
                                        t = n.ey[s[0]],
                                        !0 !== s[1] && (e.rarity = Math.min(s[1], i.maxRarity))
                                    }
                                }
                                new h.Bw(e.position).define(t, e.rarity),
                                e.rarity >= s.A.announceRarity && s.A.announceRarity > -1 && (n.cK[e.rarity] ? s.A.clients.forEach((i => i.systemMessage((0,
                                l.Br)(n.cK[e.rarity].name, !0) + " " + t.name + " has spawned!", n.cK[e.rarity].color))) : console.error(`Rarity returns undefined: ${e.rarity}`))
                            } else if (s.A.isLineMap) {
                                const t = n.ey[c()]
                                  , e = s.A.lineMapMobSpawn(t);
                                new h.Bw(e.position).define(t, e.rarity)
                            } else {
                                new h.Bw(s.A.random()).define(n.ey[c()], h.Bw.TEMPORARY_RANDOM_RARITY())
                            }
                        s.A.lag.totalTime += performance.now() - t,
                        s.A.lag.ticks++
                    }
                    ), 1e3 / 22.5);
                    let g = 0;
                    switch (setInterval(( () => {
                        s.A.lag.mspt = s.A.lag.totalTime / Math.max(1, s.A.lag.ticks),
                        s.A.lag.fps = s.A.lag.ticks,
                        s.A.lag.totalTime = 0,
                        s.A.lag.ticks = 0,
                        !r.A.isSandbox && ++g
                    }
                    ), 1e3),
                    setInterval(( () => {
                        s.A.drops.forEach((t => t.update())),
                        s.A.lightning.forEach((t => t.update()))
                    }
                    ), 256),
                    setInterval(( () => s.A.clients.forEach((t => t.worldUpdate()))), 40),
                    s.A.router = new r.A,
                    globalThis.environmentName) {
                    case "browser":
                        self.onmessage = async ({data: t}) => {
                            switch (t[0]) {
                            case 0:
                                s.A.router.addClient((0,
                                o.PW)(t, 1), (0,
                                o.I7)(t, 4), t[3]);
                                break;
                            case 1:
                                s.A.router.pipeMessage((0,
                                o.PW)(t, 1), new DataView(t.buffer,t.byteOffset + 3,t.byteLength - 3));
                                break;
                            case 2:
                                s.A.router.removeClient((0,
                                o.PW)(t, 1));
                                break;
                            case "start":
                                s.A.router.begin(t),
                                t[2] && new u
                            }
                        }
                        ,
                        s.A.router.postMessage = t => self.postMessage(t);
                        break;
                    case "node":
                        throw new Error("Node environment not supported");
                    case "bun":
                        {
                            "true" !== Bun.env.ENV_DONE && (await Bun.write("./.env", ["ENV_DONE=false", "ROUTING_SERVER=https://routing.floof.supercord.lol", "GAME_NAME=dedicated lobby", "MODDED=false", "GAMEMODE=maze", `SECRET=${Array.from(crypto.getRandomValues(new Uint8Array(24))).map((t => t.toString(16).padStart(2, "0"))).join("")}`, "ADMIN_KEYS=devkey,devkey2", "BIOME=0", "HOST=dedicated.floof.supercord.lol", "PORT=3005", "TLS_DIRECTORY=false"].join("\n")),
                            console.warn("Please fill out the .env file with the correct values. Set ENV_DONE to 'true' when done."),
                            process.exit()),
                            "true" !== Bun.env.MODDED && "false" !== Bun.env.MODDED && (console.error("MODDED must be 'true' or 'false'"),
                            process.exit()),
                            ["ffa", "tdm", "waves", "line", "maze"].includes(Bun.env.GAMEMODE) || (console.error("GAMEMODE must be 'ffa', 'tdm', 'waves', 'line', or 'maze'"),
                            process.exit()),
                            /^[0-9a-f]{48}$/i.test(Bun.env.SECRET) || (console.error("SECRET must be a 48 character hex string"),
                            process.exit()),
                            Bun.env.ADMIN_KEYS.split(",").every((t => "string" == typeof t)) || (console.error("ADMIN_KEYS must be a comma separated list of strings"),
                            process.exit()),
                            -1 == Bun.env.BIOME && (console.log("BIOME is set to -1, selecting random biome"),
                            Bun.env.BIOME = l.Iv ? a.VC.HALLOWEEN : 8 * Math.random() | 0);
                            const y = Bun.env.ADMIN_KEYS.split(",").filter((t => t.length > 3));
                            let f = 1;
                            const A = new Map
                              , w = new Map
                              , b = Bun.serve({
                                fetch(t) {
                                    const e = b.requestIP(t);
                                    if (!e?.address)
                                        return new Response(":(");
                                    return b.upgrade(t, {
                                        data: {
                                            socketID: f++,
                                            searchParams: new URLSearchParams(t.url.split("?").slice(1).join("?")),
                                            begin: performance.now(),
                                            ip: e.address
                                        }
                                    }) ? void 0 : new Response("Hello world")
                                },
                                websocket: {
                                    perMessageDeflate: !0,
                                    idleTimeout: 0,
                                    async open(t) {
                                        t.binaryType = "arraybuffer";
                                        const e = s.A.router.addClient(t.data.socketID, t.data.searchParams.get("uuid"), y.includes(t.data.searchParams.get("clientKey")));
                                        if (e) {
                                            A.set(t.data.socketID, t);
                                            let i = (w.get(t.data.ip) ?? 0) + 1;
                                            if (i > 100)
                                                return void e.kick("Too many connections from this IP");
                                            w.set(t.data.ip, i);
                                            try {
                                                const t = await fetch(`${Bun.env.ROUTING_SERVER}/uuid/check?uuid=${e.uuid}&trustedKey=${Bun.env.SECRET}`)
                                                  , i = await t.json();
                                                if (!i.ok || !i.isValid)
                                                    return void e.kick("DAR-6")
                                            } catch (t) {
                                                return console.error(t),
                                                void e.kick("DAR-5")
                                            }
                                        }
                                    },
                                    close(t) {
                                        s.A.router.removeClient(t.data.socketID),
                                        A.delete(t.data.socketID),
                                        v.readyState === WebSocket.OPEN && t.data.searchParams.has("analytics") && v.send(new Uint8Array([a.jU.ANALYTICS_DATA, ...(0,
                                        o._O)(t.data.searchParams.get("analytics")), ...(0,
                                        o._O)((performance.now() - t.data.begin).toFixed(2))]));
                                        let e = (w.get(t.data.ip) ?? 0) - 1;
                                        e <= 0 ? w.delete(t.data.ip) : w.set(t.data.ip, e)
                                    },
                                    message(t, e) {
                                        "string" != typeof e && s.A.router.pipeMessage(t.data.socketID, new DataView(e))
                                    }
                                },
                                port: +Bun.env.DEDICATED_LOBBY_PORT,
                                tls: "false" !== Bun.env.TLS_DIRECTORY ? {
                                    key: Bun.file(`${Bun.env.TLS_DIRECTORY}/privkey.pem`),
                                    cert: Bun.file(`${Bun.env.TLS_DIRECTORY}/fullchain.pem`)
                                } : void 0
                            })
                              , M = -Math.floor((new Date).getTimezoneOffset() / 60)
                              , v = new WebSocket(`${Bun.env.ROUTING_SERVER.replace("http", "ws")}/ws/lobby?gameName=${Bun.env.GAME_NAME}&isModded=${"true" == Bun.env.MODDED ? "yes" : "no"}&gamemode=${Bun.env.GAMEMODE}&secretKey=${Bun.env.SECRET}&isPrivate=no&biome=${Bun.env.BIOME}&directConnect=${Bun.env.HOST},${M}&analytics=${ANALYTICS_DATA}`,{
                                origin: Bun.env.HOST,
                                headers: {
                                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36"
                                }
                            });
                            v.binaryType = "arraybuffer";
                            const x = [];
                            v.onopen = () => {
                                console.log("Connected to server"),
                                s.A.router.begin(["start", Bun.env.GAMEMODE, "true" == Bun.env.MODDED, crypto.randomUUID(), +Bun.env.BIOME]),
                                v.onmessage = t => {
                                    const e = new Uint8Array(t.data);
                                    if (255 !== e[0])
                                        ;
                                    else {
                                        if (!(1 === e[1]))
                                            throw new Error("Request rejected by server");
                                        console.log("Lobby Verified", (new TextDecoder).decode(e.slice(2, -1)))
                                    }
                                }
                                ,
                                x.forEach((t => t()))
                            }
                            ,
                            v.onclose = () => {
                                console.log("Disconnected from server"),
                                s.A.clients.forEach((t => t.kick("Connection to lobby server lost"))),
                                setTimeout(( () => process.exit()), 1e3)
                            }
                            ,
                            s.A.router.postMessage = t => {
                                switch (t[0]) {
                                case a.jU.PIPE_PACKET:
                                    const e = A.get((0,
                                    o.PW)(t, 1));
                                    null != e && e.readyState === WebSocket.OPEN && e.send(t.slice(3));
                                    break;
                                case a.jU.CLOSE_CLIENT:
                                    A.get((0,
                                    o.PW)(t, 1))?.close();
                                    break;
                                default:
                                    v.readyState === WebSocket.OPEN ? (v.send(t),
                                    console.log(`Lobby ready state: ${v.readyState}`)) : (console.log("Lobby ready state: Closed."),
                                    x.push(( () => v.send(t))))
                                }
                            }
                        }
                        break;
                    default:
                        throw new Error("Invalid environment")
                    }
                    let p = !1;
                    function m() {
                        s.A.router.postMessage(new Uint8Array([2, ...(0,
                        o._O)(JSON.stringify((0,
                        a.Gf)(n.cK, n.GJ, n.ey)))])),
                        p && setTimeout(( () => s.A.clients.forEach((t => t.talk(a.de.UPDATE_ASSETS)))), 250),
                        p = !0
                    }
                    m();
                    class u {
                        static TRANSFERRABLE_TYPES = {
                            PetalConfig: 0,
                            MobConfig: 1
                        };
                        static assignTransferrableType(t, e) {
                            let i;
                            if (e === u.TRANSFERRABLE_TYPES.PetalConfig) {
                                i = Object.assign(new n.lm("",0,0,0), structuredClone(t));
                                for (const e in t) {
                                    const s = structuredClone(t[e]);
                                    switch (e) {
                                    case "drawing":
                                        i.drawing = Object.assign(new a.H1, s);
                                        break;
                                    case "tiers":
                                        for (let t = 0; t < s.length; t++)
                                            i.tiers[t] = Object.assign(new a.z(0,0,0), s[t])
                                    }
                                }
                            }
                            return i
                        }
                        #t = null;
                        constructor() {
                            this.#t = new BroadcastChannel("floofModdingAPI"),
                            this.#t.onmessage = t => this.parseModdingAPICommand(t.data)
                        }
                        floofModdingResponse(t, e, i, s=null, a=null) {
                            this.#t.postMessage([t, {
                                ok: e,
                                message: i,
                                data: s
                            }, a])
                        }
                        validateArg(t, e, i, s, a) {
                            return typeof i !== s ? (this.floofModdingResponse(t, !1, `Argument ${e} must be of type ${s}`),
                            !1) : !a || !(i < a[0] || i > a[1]) || (this.floofModdingResponse(t, !1, `Argument ${e} must be between ${a[0]} and ${a[1]}`),
                            !1)
                        }
                        parseModdingAPICommand(t) {
                            const [e,i,...r] = t;
                            switch (i) {
                            case "spawnMob":
                                {
                                    if (2 !== r.length)
                                        return void this.floofModdingResponse(e, !1, "spawnMob(index, rarity) requires 2 arguments!");
                                    if (!this.validateArg(e, "index", r[0], "number", [0, n.ey.length - 1]) || !this.validateArg(e, "rarity", r[1], "number", [0, n.cK.length - 1]))
                                        return;
                                    const t = new h.Bw(s.A.random());
                                    t.define(n.ey[r[0]], r[1]),
                                    this.floofModdingResponse(e, !0, "Mob spawned successfully", {
                                        id: t.id,
                                        index: t.index,
                                        rarity: t.rarity,
                                        indexName: n.ey[t.index].name,
                                        rarityName: n.cK[t.rarity].name,
                                        position: {
                                            x: t.x,
                                            y: t.y
                                        }
                                    }),
                                    s.A.isWaves && (s.A.aliveMobs.push(t),
                                    s.A.maxMobs++)
                                }
                                break;
                            case "setRoomInfo":
                                if (r.length < 1 || r.length > 5)
                                    return void this.floofModdingResponse(e, !1, "setRoomInfo(dynamic, width*, height*, mobCount*, currentWave*) requires 1 argument, has 4 extra optional arguments!");
                                if (!this.validateArg(e, "dynamic", r[0], "boolean"))
                                    return;
                                if (!0 === r[0]) {
                                    if (1 !== r.length)
                                        return void this.floofModdingResponse(e, !1, "setRoomInfo(true) requires no extra arguments!")
                                } else if (!(this.validateArg(e, "width", r[1], "number", [256, 131072]) && this.validateArg(e, "height", r[2], "number", [256, 131072]) && this.validateArg(e, "mobCount", r[3], "number", [0, 4096]) && this.validateArg(e, "currentWave", r[4], "number", [0, 4096])))
                                    return;
                                s.A.dynamicRoom = r[0],
                                s.A.dynamicRoom || (s.A.width = r[1],
                                s.A.height = r[2],
                                s.A.maxMobs = r[3],
                                s.A.currentWave = r[4] - 1,
                                s.A.livingMobCount = 0),
                                s.A.clients.forEach((t => t.sendRoom())),
                                this.floofModdingResponse(e, !0, "Room info set successfully", {
                                    dynamic: s.A.dynamicRoom,
                                    width: s.A.width,
                                    height: s.A.height,
                                    mobCount: s.A.maxMobs,
                                    wave: s.A.currentWave
                                });
                                break;
                            case "getRoomInfo":
                                if (0 !== r.length)
                                    return void this.floofModdingResponse(e, !1, "getRoomInfo() requires 0 arguments!");
                                this.floofModdingResponse(e, !0, "Room info fetched successfully", {
                                    dynamic: s.A.dynamicRoom,
                                    width: s.A.width,
                                    height: s.A.height,
                                    mobCount: s.A.maxMobs,
                                    wave: s.A.wave
                                });
                                break;
                            case "getPlayers":
                                if (0 !== r.length)
                                    return void this.floofModdingResponse(e, !1, "getPlayers() requires 0 arguments!");
                                const t = [];
                                s.A.clients.forEach((e => {
                                    t.push({
                                        clientID: e.id,
                                        username: e.username,
                                        slots: {
                                            primary: e.slots.map((t => ({
                                                index: t.id,
                                                rarity: t.rarity,
                                                indexName: n.GJ[t.id].name,
                                                rarityName: n.cK[t.rarity].name
                                            }))),
                                            secondary: e.secondarySlots.map((t => t ? {
                                                index: t.id,
                                                rarity: t.rarity,
                                                indexName: n.GJ[t.id].name,
                                                rarityName: n.cK[t.rarity].name
                                            } : null)),
                                            highestRarity: e.highestRarity
                                        },
                                        level: {
                                            xp: Math.round(e.xp),
                                            level: e.level,
                                            progress: +e.levelProgress.toFixed(4)
                                        },
                                        body: e.body ? {
                                            id: e.body.id,
                                            position: {
                                                x: e.body.x,
                                                y: e.body.y
                                            }
                                        } : null
                                    })
                                }
                                )),
                                this.floofModdingResponse(e, !0, "Players fetched successfully", t);
                                break;
                            case "getMobs":
                                if (0 !== r.length)
                                    return void this.floofModdingResponse(e, !1, "getMobs() requires 0 arguments!");
                                const o = [];
                                s.A.entities.forEach((t => {
                                    t.type === a.wv.MOB && o.push({
                                        id: t.id,
                                        index: t.index,
                                        rarity: t.rarity,
                                        indexName: n.ey[t.index].name,
                                        rarityName: n.cK[t.rarity].name,
                                        position: {
                                            x: t.x,
                                            y: t.y
                                        }
                                    })
                                }
                                )),
                                this.floofModdingResponse(e, !0, "Mobs fetched successfully", o);
                                break;
                            case "getPetalInfo":
                                if (1 !== r.length)
                                    return void this.floofModdingResponse(e, !1, "getPetalInfo(index) requires 1 argument!");
                                if (!this.validateArg(e, "index", r[0], "number", [0, n.GJ.length - 1]))
                                    return;
                                this.floofModdingResponse(e, !0, "Petal info fetched successfully", n.GJ[r[0]], u.TRANSFERRABLE_TYPES.PetalConfig);
                                break;
                            case "createCustomPetal":
                                {
                                    if (1 !== r.length)
                                        return void this.floofModdingResponse(e, !1, "createCustomPetal(options) requires 1 argument!");
                                    const t = r[0];
                                    t.drawing && (t.drawing = a.H1.fromString(t.drawing)),
                                    t.id = n.GJ.length,
                                    n.GJ.push(u.assignTransferrableType(t, u.TRANSFERRABLE_TYPES.PetalConfig)),
                                    m(),
                                    this.floofModdingResponse(e, !0, "Custom petal created successfully", t, u.TRANSFERRABLE_TYPES.PetalConfig)
                                }
                                break;
                            case "editPetal":
                                {
                                    if (1 !== r.length)
                                        return void this.floofModdingResponse(e, !1, "editPetal(options) requires 1 argument!");
                                    if (null == n.GJ[r[0].id])
                                        return void this.floofModdingResponse(e, !1, "Petal does not exist");
                                    const t = r[0];
                                    t.drawing && (t.drawing = a.H1.fromString(t.drawing)),
                                    n.GJ[t.id] = u.assignTransferrableType(t, u.TRANSFERRABLE_TYPES.PetalConfig),
                                    m(),
                                    s.A.entities.forEach((e => {
                                        if (e.type !== a.wv.PLAYER)
                                            return;
                                        e.petalSlots.forEach((e => {
                                            e.config.id === t.id && (e.destroy(),
                                            e.define(n.GJ[t.id], e.rarity))
                                        }
                                        ))
                                    }
                                    )),
                                    this.floofModdingResponse(e, !0, "Petal edited successfully", t, u.TRANSFERRABLE_TYPES.PetalConfig)
                                }
                                break;
                            case "setSlot":
                                {
                                    if (4 !== r.length)
                                        return void this.floofModdingResponse(e, !1, "setSlot(clientID, slotID, index, rarity) requires 4 arguments!");
                                    if (!(this.validateArg(e, "clientID", r[0], "number") && this.validateArg(e, "slotID", r[1], "number") && this.validateArg(e, "index", r[2], "number", [0, n.GJ.length - 1]) && this.validateArg(e, "rarity", r[3], "number", [0, n.cK.length - 1])))
                                        return;
                                    const t = s.A.clients.get(r[0]);
                                    if (!t)
                                        return void this.floofModdingResponse(e, !1, "Client not found. Try to fetch the players and find the client ID you need");
                                    if (!t.body)
                                        return void this.floofModdingResponse(e, !1, "Client does not have a body");
                                    if (r[1] < 0 || r[1] >= t.body.petalSlots.length)
                                        return void this.floofModdingResponse(e, !1, `Slot ${r[1]} does not exist`);
                                    t.slots[r[1]].id = r[2],
                                    t.slots[r[1]].rarity = r[3],
                                    t.body.setSlot(r[1], r[2], r[3]),
                                    this.floofModdingResponse(e, !0, "Slot set successfully", {
                                        clientID: t.id,
                                        slotIndex: r[1],
                                        petalIndex: r[2],
                                        rarity: r[3],
                                        indexName: n.GJ[r[2]].name,
                                        rarityName: n.cK[r[3]].name
                                    })
                                }
                                break;
                            case "deletePetal":
                                if (1 !== r.length)
                                    return void this.floofModdingResponse(e, !1, "deletePetal(index) requires 1 argument!");
                                if (!this.validateArg(e, "index", r[0], "number", [0, n.GJ.length - 1]))
                                    return;
                                r[0] < n.vx ? n.GJ[r[0]] = new n.lm("Deleted Petal",0,0,0) : n.GJ.splice(r[0], 1);
                                for (let t = 0; t < n.GJ.length; t++)
                                    n.GJ[t].id = t;
                                n.lm.idAccumulator = n.GJ.length,
                                s.A.entities.forEach((t => {
                                    if (t.type !== a.wv.PLAYER)
                                        return;
                                    t.petalSlots.forEach((t => {
                                        t.config.id === r[0] && (t.destroy(),
                                        t.define(n.GJ[0], t.rarity))
                                    }
                                    ))
                                }
                                )),
                                m(),
                                this.floofModdingResponse(e, !0, "Petal deleted successfully", {
                                    index: r[0]
                                });
                                break;
                            case "setSlotAmount":
                                {
                                    if (2 !== r.length)
                                        return void this.floofModdingResponse(e, !1, "setSlotAmount(clientID, amount) requires 2 arguments!");
                                    if (!this.validateArg(e, "clientID", r[0], "number") || !this.validateArg(e, "amount", r[1], "number", [1, 10]))
                                        return;
                                    const t = s.A.clients.get(r[0]);
                                    if (!t)
                                        return void this.floofModdingResponse(e, !1, "Client not found. Try to fetch the players and find the client ID you need");
                                    if (!t.body)
                                        return void this.floofModdingResponse(e, !1, "Client does not have a body");
                                    t.body.initSlots(r[1]),
                                    this.floofModdingResponse(e, !0, "Slot amount set successfully", {
                                        clientID: t.id,
                                        body: {
                                            id: t.body.id,
                                            slots: t.body.petalSlots.map((t => ({
                                                index: t.index,
                                                rarity: t.rarity,
                                                indexName: n.GJ[t.index].name,
                                                rarityName: n.cK[t.rarity].name
                                            }))),
                                            position: {
                                                x: t.body.x,
                                                y: t.body.y
                                            }
                                        }
                                    })
                                }
                                break;
                            case "spawnAIPlayer":
                                {
                                    if (2 !== r.length)
                                        return void this.floofModdingResponse(e, !1, "spawnAIPlayer(rarity, level) requires 2 arguments!");
                                    if (!this.validateArg(e, "rarity", r[0], "number", [0, n.cK.length - 1]) || !this.validateArg(e, "amount", r[1] - 1, "number", [1, 999]))
                                        return;
                                    const t = new h.cS(s.A.random(),r[0],r[1] - 1);
                                    this.floofModdingResponse(e, !0, "AI Flower spawned successfully", {
                                        id: t.id,
                                        level: t.client.level,
                                        highestRarity: t.client.highestRarity,
                                        position: {
                                            x: t.x,
                                            y: t.y
                                        }
                                    })
                                }
                            default:
                                this.floofModdingResponse(e, !1, `Function ${i} does not exist!`)
                            }
                        }
                    }
                    e()
                } catch (S) {
                    e(S)
                }
            }
            ), 1)
        }
        ,
        110: (t, e, i) => {
            i.d(e, {
                AU: () => M,
                DQ: () => m,
                E4: () => R,
                F6: () => c,
                Gf: () => S,
                H1: () => w,
                LX: () => P,
                VC: () => f,
                XE: () => o,
                ai: () => T,
                cK: () => s,
                dX: () => D,
                de: () => l,
                fh: () => d,
                hg: () => A,
                jU: () => u,
                lm: () => h,
                mP: () => b,
                rx: () => n,
                so: () => p,
                w6: () => g,
                wv: () => y,
                z: () => a
            });
            const s = [{
                name: "Common",
                color: "#7EEF6D"
            }, {
                name: "Uncommon",
                color: "#FFE65D"
            }, {
                name: "Rare",
                color: "#455FCF"
            }, {
                name: "Epic",
                color: "#7633CB"
            }, {
                name: "Legendary",
                color: "#C13328"
            }, {
                name: "Mythic",
                color: "#1ED2CB"
            }, {
                name: "Ultra",
                color: "#ff2b75"
            }, {
                name: "Super",
                color: "#2affa3"
            }, {
                name: "Ancient",
                color: "#ff7b29"
            }, {
                name: "Omega",
                color: "#d966e8"
            }, {
                name: "???",
                color: "#333333"
            }, {
                name: "Unique",
                color: "#FFFFFF"
            }];
            class a {
                static HEALTH_SCALE = 3;
                static DAMAGE_SCALE = 3;
                constructor(t, e, i) {
                    this.health = e * Math.pow(a.HEALTH_SCALE, t),
                    this.damage = i * Math.pow(a.DAMAGE_SCALE, t),
                    this.extraHealth = 0,
                    this.constantHeal = 0,
                    this.healing = 0,
                    this.count = 1,
                    this.clumps = !1,
                    this.damageReduction = 0,
                    this.damageReflection = null,
                    this.speedMultiplier = 1,
                    this.extraSize = 0,
                    this.extraRange = 0,
                    this.poison = null,
                    this.spawnable = null,
                    this.pentagramAbility = null,
                    this.lightning = null,
                    this.extraVision = 0,
                    this.extraPickupRange = 0,
                    this.density = 1,
                    this.deathDefying = null,
                    this.absorbsDamage = null,
                    this.shield = 0,
                    this.boost = null,
                    this.healBack = 0,
                    this.armor = 0
                }
            }
            class n {
                static HEALTH_SCALE = 3.15;
                static DAMAGE_SCALE = 3;
                static SIZE_SCALE = 1.235;
                constructor(t, e, i, s) {
                    this.health = e * Math.pow(n.HEALTH_SCALE, t),
                    this.damage = i * Math.pow(n.DAMAGE_SCALE, t),
                    this.size = s * Math.pow(n.SIZE_SCALE, t),
                    this.damageReduction = 0,
                    this.projectile = null,
                    this.poison = null,
                    this.lightning = null,
                    this.antHoleSpawns = null
                }
            }
            class h {
                static idAccumulator = 0;
                #e() {
                    const t = [];
                    for (let e = 0; e < s.length; e++)
                        t.push(new a(e,this.health,this.damage));
                    return t
                }
                constructor(t, e, i, s) {
                    this.id = h.idAccumulator++,
                    this.name = t,
                    this.cooldown = e,
                    this.health = i,
                    this.damage = s,
                    this.sizeRatio = 1,
                    this.launchable = !1,
                    this.launchedSpeed = 0,
                    this.launchedRange = 0,
                    this.wingMovement = !1,
                    this.yinYangMovement = !1,
                    this.wearable = !1,
                    this.enemySpeedDebuff = null,
                    this.splits = null,
                    this.tiers = this.#e(),
                    this.attractsLightning = !1,
                    this.drawing = null,
                    this.shootsOut = -1,
                    this.healsInDefense = !1,
                    this.phases = !1,
                    this.canPlaceDown = !1,
                    this.healWhenUnder = 1,
                    this.huddles = !1,
                    this.ignoreWalls = !1,
                    this.extraLighting = 0,
                    this.description = "Not much is known about this mysterious petal."
                }
                setName(t) {
                    return this.name = t,
                    this
                }
                setHuddles(t) {
                    return this.huddles = Boolean(t),
                    this
                }
                setCooldown(t) {
                    return this.cooldown = t,
                    this
                }
                setHealth(t) {
                    this.health = t;
                    for (let e = 0; e < this.tiers.length; e++)
                        this.tiers[e].health = t * Math.pow(a.HEALTH_SCALE, e);
                    return this
                }
                setDamage(t) {
                    this.damage = t;
                    for (let e = 0; e < this.tiers.length; e++)
                        this.tiers[e].damage = t * Math.pow(a.DAMAGE_SCALE, e);
                    return this
                }
                setSize(t) {
                    return this.sizeRatio = t,
                    this
                }
                setMulti(t, e, i=!1) {
                    for (let s = 0; s < this.tiers.length; s++) {
                        let a = t instanceof Array ? t[s] ?? t[t.length - 1] : t;
                        this.tiers[s].count = a,
                        this.tiers[s].clumps = Boolean(e),
                        i && (this.damage /= a,
                        this.tiers[s].damage /= a)
                    }
                    return this
                }
                setDrawing(t) {
                    if (!(t instanceof w))
                        throw new Error("Invalid drawing type");
                    return this.drawing = t,
                    this
                }
                setExtraRadians(t) {
                    for (let e = 0; e < this.tiers.length; e++)
                        this.tiers[e].extraRadians = t * Math.pow(1.15, e);
                    return this
                }
                setExtraHealth(t) {
                    for (let e = 0; e < this.tiers.length; e++)
                        this.tiers[e].extraHealth = t * Math.pow(a.HEALTH_SCALE, e);
                    return this
                }
                setConstantHeal(t, e=!1, i=1) {
                    for (let e = 0; e < this.tiers.length; e++)
                        this.tiers[e].constantHeal = t / 22.5 * Math.pow(a.HEALTH_SCALE, e);
                    return this.healsInDefense = e,
                    this.healWhenUnder = i,
                    this
                }
                setWingMovement(t) {
                    return this.wingMovement = t,
                    this
                }
                setDamageReduction(t) {
                    for (let e = 0; e < this.tiers.length; e++)
                        this.tiers[e].damageReduction = t * Math.pow(1.1, e);
                    return this
                }
                setSpeedMultiplier(t) {
                    for (let e = 0; e < this.tiers.length; e++)
                        this.tiers[e].speedMultiplier = Math.pow(t, 1 + e / 2.25);
                    return this
                }
                setExtraSize(t) {
                    for (let e = 0; e < this.tiers.length; e++)
                        this.tiers[e].extraSize = t + Math.pow(1.5, e);
                    return this
                }
                setDescription(t) {
                    return this.description = t,
                    this
                }
                setLaunchable(t, e) {
                    return this.launchable = !0,
                    this.launchedSpeed = t,
                    this.launchedRange = e,
                    this
                }
                setHealing(t) {
                    for (let e = 0; e < this.tiers.length; e++)
                        this.tiers[e].healing = t * Math.pow(a.HEALTH_SCALE, e);
                    return this
                }
                setYinYang(t) {
                    return this.yinYangMovement = t,
                    this
                }
                setEnemySpeedMultiplier(t, e) {
                    return this.enemySpeedDebuff = {
                        speedMultiplier: t,
                        duration: 22.5 * e
                    },
                    this
                }
                setPoison(t, e) {
                    for (let i = 0; i < this.tiers.length; i++)
                        this.tiers[i].poison = {
                            damage: t * Math.pow(a.DAMAGE_SCALE, i) / 22.5,
                            duration: 22.5 * e
                        };
                    return this
                }
                setShootOut(t) {
                    return this.shootsOut = t,
                    this
                }
                setExtraRange(t) {
                    for (let e = 0; e < this.tiers.length; e++)
                        this.tiers[e].extraRange = t * Math.pow(1.15, e);
                    return this
                }
                setWearable(t) {
                    return this.wearable = t,
                    this
                }
                setSpawnable(t, e, i) {
                    for (let s = 0; s < this.tiers.length; s++)
                        this.tiers[s].spawnable = {
                            index: t,
                            rarity: e instanceof Array ? e[s] ?? e[e.length - 1] : e,
                            timer: 22.5 * i
                        };
                    return this
                }
                setExtraVision(t) {
                    for (let e = 0; e < this.tiers.length; e++)
                        this.tiers[e].extraVision = t * Math.pow(1.45, e);
                    return this
                }
                setSplits(t, e) {
                    return this.splits = {
                        index: t,
                        count: e
                    },
                    this
                }
                setHealSpit(t, e, i) {
                    return this.healSpit = {
                        cooldown: t,
                        range: e,
                        heal: i
                    },
                    this
                }
                setPentagramAbility(t, e, i, s, n) {
                    for (let h = 0; h < this.tiers.length; h++)
                        this.tiers[h].pentagramAbility = {
                            cooldown: t,
                            range: e * Math.pow(1.15, h),
                            damage: i * Math.pow(a.DAMAGE_SCALE, h),
                            poison: {
                                damage: s.damage / 22.5 * Math.pow(a.DAMAGE_SCALE, h),
                                duration: 22.5 * s.duration * Math.pow(1.1, h)
                            },
                            speedDebuff: {
                                multiplier: n.multiplier,
                                duration: 22.5 * n.duration * Math.pow(1.1, h)
                            }
                        };
                    return this
                }
                setLightning(t, e, i, s=1, n=!1) {
                    for (let h = 0; h < this.tiers.length; h++)
                        this.tiers[h].lightning = {
                            bounces: t instanceof Array ? t[h] ?? t[t.length - 1] : t,
                            range: e * Math.pow(1.15, h),
                            damage: i * Math.pow(a.DAMAGE_SCALE, h),
                            charges: s instanceof Array ? s[h] ?? s[s.length - 1] : s,
                            lightningOnParentHit: n
                        };
                    return this
                }
                setExtraPickupRange(t) {
                    for (let e = 0; e < this.tiers.length; e++)
                        this.tiers[e].extraPickupRange = t * Math.pow(1.35, e);
                    return this
                }
                setDamageReflection(t, e=0) {
                    for (let i = 0; i < this.tiers.length; i++)
                        this.tiers[i].damageReflection = {
                            reflection: t * Math.pow(4 / 3, i),
                            cap: e * Math.pow(1.05, i)
                        };
                    return this
                }
                setAttractsLightning(t) {
                    return this.attractsLightning = t,
                    this
                }
                setDensity(t) {
                    for (let e = 0; e < this.tiers.length; e++)
                        this.tiers[e].density = t * Math.pow(1.25, e);
                    return this
                }
                setDeathDefying(t, e) {
                    for (let i = 0; i < this.tiers.length; i++)
                        this.tiers[i].deathDefying = {
                            health: Math.min(1, t * Math.pow(1.1883, i)),
                            duration: 1.5 + i * e
                        };
                    return this
                }
                setPhases(t) {
                    return this.phases = Boolean(t),
                    this
                }
                setAbsorbsDamage(t, e) {
                    for (let i = 0; i < this.tiers.length; i++)
                        this.tiers[i].absorbsDamage = {
                            maxDamage: t instanceof Array ? t[i] ?? t[t.length - 1] : t * Math.pow(a.DAMAGE_SCALE, i),
                            period: e instanceof Array ? e[i] ?? e[e.length - 1] : e
                        };
                    return this
                }
                setPlaceDown(t) {
                    return this.canPlaceDown = Boolean(t),
                    this
                }
                setShield(t) {
                    for (let e = 0; e < this.tiers.length; e++)
                        this.tiers[e].shield = t instanceof Array ? t[e] ?? t[t.length - 1] : t * Math.pow(a.HEALTH_SCALE, e);
                    return this
                }
                setBoost(t, e) {
                    for (let i = 0; i < this.tiers.length; i++)
                        this.tiers[i].boost = {
                            length: t instanceof Array ? t[i] ?? t[t.length - 1] : t,
                            delay: e instanceof Array ? e[i] ?? e[e.length - 1] : e
                        };
                    return this
                }
                setHealBack(t) {
                    for (let e = 0; e < this.tiers.length; e++)
                        this.tiers[e].healBack = t instanceof Array ? t[e] ?? t[t.length - 1] : t;
                    return this
                }
                setAttractsAggro(t) {
                    return this.attractsAggro = Boolean(t),
                    this
                }
                setIgnoreWalls(t) {
                    return this.ignoreWalls = Boolean(t),
                    this
                }
                setLighting(t) {
                    return this.extraLighting = t,
                    this
                }
                setExtraDamage(t, e, i) {
                    return this.extraDamage = {
                        minHp: t,
                        maxHp: e,
                        multiplier: i
                    },
                    this
                }
                setArmor(t) {
                    for (let e = 0; e < this.tiers.length; e++)
                        this.tiers[e].armor = t * Math.pow(a.DAMAGE_SCALE, e);
                    return this
                }
                setIcon(t, e, i) {
                    return this.icon = {
                        size: t,
                        count: e,
                        name: i
                    },
                    this
                }
            }
            class r {
                index = 0;
                minRarity = 0;
                chance = 1
            }
            class o {
                static idAccumulator = 0;
                #e() {
                    const t = [];
                    for (let e = 0; e < s.length; e++)
                        t.push(new n(e,this.health,this.damage,this.size));
                    return t
                }
                constructor(t, e, i, s, a) {
                    this.id = o.idAccumulator++,
                    this.name = t,
                    this.health = e,
                    this.damage = i,
                    this.size = s,
                    this.speed = a,
                    this.aggressive = !1,
                    this.neutral = !1,
                    this.spawnable = !0,
                    this.sandstormMovement = !1,
                    this.damageReflection = {
                        reflection: 0,
                        cap: 0
                    },
                    this.tiers = this.#e(),
                    this.drops = [],
                    this.drawing = null,
                    this.hatchables = null,
                    this.poopable = null,
                    this.isSystem = !1,
                    this.movesInBursts = !1,
                    this.moveInSines = !1,
                    this.pushability = 1,
                    this.sizeRand = {
                        min: 1,
                        max: 0
                    },
                    this.wavesIconSize = 3.5
                }
                setSystem(t) {
                    return this.isSystem = Boolean(t),
                    this
                }
                setMovesInBursts(t) {
                    return this.movesInBursts = Boolean(t),
                    this
                }
                setAggressive(t) {
                    return this.aggressive = Boolean(t),
                    this
                }
                setNeutral(t) {
                    return this.neutral = Boolean(t),
                    this
                }
                setSandstormMovement(t) {
                    return this.sandstormMovement = Boolean(t),
                    this
                }
                setCentipedeMovement(t) {
                    return this.centipedeMovement = Boolean(t),
                    this
                }
                setBumblebeeMovement(t) {
                    return this.bumblebeeMovement = Boolean(t),
                    this
                }
                setDesertCentipedeMovement(t) {
                    return this.desertCentipedeMovement = Boolean(t),
                    this
                }
                setDamageReduction(t) {
                    for (let e = 0; e < this.tiers.length; e++)
                        this.tiers[e].damageReduction = t * Math.pow(1.1, e);
                    return this
                }
                setDamageReflection(t, e=0) {
                    return this.damageReflection = {
                        reflection: t,
                        cap: e
                    },
                    this
                }
                setArmor(t) {
                    for (let e = 0; e < this.tiers.length; e++)
                        this.tiers[e].armor = t * Math.pow(a.DAMAGE_SCALE, e);
                    return this
                }
                setProjectile(t={}) {
                    for (let e = 0; e < this.tiers.length; e++)
                        this.tiers[e].projectile = {
                            petalIndex: t.petalIndex ?? 0,
                            cooldown: t.cooldown ?? 10,
                            health: (t.health ?? 1) * Math.pow(a.HEALTH_SCALE, e),
                            damage: (t.damage ?? 1) * Math.pow(a.DAMAGE_SCALE, e),
                            speed: t.speed ?? 5,
                            range: (t.range ?? 50) * Math.pow(.8 * n.SIZE_SCALE, e),
                            size: t.size ?? .35,
                            multiShot: t.multiShot ?? null,
                            runs: t.runs ?? !1,
                            nullCollision: t.nullCollision ?? !1,
                            aimbot: t.aimbot ?? !1
                        };
                    return this
                }
                addDrop(t, e=1, i=0) {
                    if (t < 0 || t > 255)
                        throw new Error("Invalid drop index");
                    const s = new r;
                    return s.index = t,
                    s.minRarity = i,
                    s.chance = e,
                    this.drops.push(s),
                    this
                }
                setPoison(t, e) {
                    for (let i = 0; i < this.tiers.length; i++)
                        this.tiers[i].poison = {
                            damage: t * Math.pow(a.DAMAGE_SCALE, i) / 22.5,
                            duration: 22.5 * e
                        };
                    return this
                }
                setLightning(t, e, i, s) {
                    for (let n = 0; n < this.tiers.length; n++)
                        this.tiers[n].lightning = {
                            cooldown: t instanceof Array ? t[n] ?? t[t.length - 1] : t,
                            bounces: e instanceof Array ? e[n] ?? e[e.length - 1] : e,
                            range: i * Math.pow(1.15, n),
                            damage: s * Math.pow(a.DAMAGE_SCALE, n)
                        };
                    return this
                }
                setSize(t, e=n.SIZE_SCALE, i=1, s=0) {
                    this.size = t;
                    for (let i = 0; i < this.tiers.length; i++)
                        this.tiers[i].size = t * Math.pow(e, i);
                    return this.sizeRand = {
                        min: i,
                        max: s
                    },
                    this
                }
                setDrawing(t) {
                    if (!(t instanceof w))
                        throw new Error("Invalid drawing type");
                    return this.drawing = t,
                    this
                }
                setAntHoleSpawns(t) {
                    for (let e = 0; e < this.tiers.length; e++)
                        this.tiers[e].antHoleSpawns = t.map(( ({index: t, count: i, minHealthRatio: s}) => ({
                            index: t,
                            count: i instanceof Array ? i[e] ?? i[i.length - 1] : i,
                            minHealthRatio: s ?? 1
                        })));
                    return this
                }
                setHatchables(t) {
                    if (t instanceof Array) {
                        for (let e = 0; e < t.length; e++)
                            if (t[e].index < 0 || t[e].index > 255)
                                throw new Error("Invalid hatchable index");
                        this.hatchables = t
                    } else {
                        if (t.index < 0 || t.index > 255)
                            throw new Error("Invalid hatchable index");
                        this.hatchables = [t]
                    }
                    return this
                }
                setPoopable(t) {
                    if (t.index < 0 || t.index > 255)
                        throw new Error("Invalid poopable index");
                    return this.poopable = t,
                    this
                }
                segmentWith(t) {
                    return this.segment = t,
                    this
                }
                setMoveInSines(t) {
                    return this.moveInSines = Boolean(t),
                    this
                }
                setSpins(t, e=!1) {
                    return this.spins = {
                        rate: t,
                        constant: Boolean(e)
                    },
                    this
                }
                setFleeAtLowHealth(t) {
                    return this.fleeAtLowHealth = t,
                    this
                }
                setHealing(t=0) {
                    return this.healing = t,
                    this
                }
                setPushability(t) {
                    return this.pushability = t,
                    this
                }
                branchWith(t, e, i) {
                    return this.branch = {
                        index: t,
                        branches: e,
                        branchLength: i
                    },
                    this
                }
                setStrafes(t, e, i) {
                    return this.strafes = {
                        length: t,
                        cooldown: e,
                        speedMult: i
                    },
                    this
                }
                setWavesIconSize(t) {
                    return this.wavesIconSize = t,
                    this
                }
            }
            const l = {
                KICK: 0,
                READY: 1,
                MESSAGE: 2,
                WORLD_UPDATE: 3,
                DEATH: 4,
                ROOM_UPDATE: 5,
                UPDATE_ASSETS: 6,
                JSON_MESSAGE: 7,
                PONG: 8,
                TERRAIN: 9,
                CHAT_MESSAGE: 10
            }
              , d = {
                VERIFY: 0,
                SPAWN: 1,
                INPUTS: 2,
                CHANGE_LOADOUT: 3,
                DEV_CHEAT: 4,
                PING: 5,
                CHAT_MESSAGE: 6,
                INVENTORY_CHANGE_LOADOUT: 7
            }
              , c = {
                TELEPORT: 0,
                GODMODE: 1,
                CHANGE_TEAM: 2,
                SPAWN_MOB: 3,
                SET_PETAL: 4,
                SET_XP: 5,
                INFO_DUMP: 6
            }
              , g = {
                NEW: 0,
                DIE: 1,
                POSITION: 2,
                SIZE: 4,
                FACING: 8,
                FLAGS: 16,
                HEALTH: 32,
                DISPLAY: 64,
                ROPE_BODIES: 128
            }
              , p = {
                HIT: 1,
                POISON: 2,
                ATTACK: 4,
                DEFEND: 8,
                TDM: 16,
                FRIEND: 32,
                WEARABLES: 64
            }
              , m = {
                ANTENNAE: 1,
                THIRD_EYE: 2,
                CUTTER: 4,
                AMULET: 8,
                AIR: 16,
                ARMOR: 32
            }
              , u = {
                CLOSE_CLIENT: 0,
                PIPE_PACKET: 1,
                ANALYTICS_DATA: 3
            }
              , y = {
                STANDARD: 0,
                PLAYER: 1,
                PETAL: 2,
                MOB: 3,
                PROJECTILE: 4
            }
              , f = {
                DEFAULT: 0,
                GARDEN: 1,
                DESERT: 2,
                OCEAN: 3,
                ANT_HELL: 4,
                HELL: 5,
                SEWERS: 6,
                DARK_FOREST: 7,
                HALLOWEEN: 8
            }
              , A = {
                [f.DEFAULT]: {
                    name: "Default",
                    color: "#718083",
                    tile: "tiles/allMobs.svg"
                },
                [f.GARDEN]: {
                    name: "Garden",
                    color: "#1EA660",
                    tile: "tiles/garden.svg"
                },
                [f.DESERT]: {
                    name: "Desert",
                    color: "#ECDCB8",
                    tile: "tiles/desert.svg"
                },
                [f.OCEAN]: {
                    name: "Ocean",
                    color: "#6D96BE",
                    tile: "tiles/ocean.svg",
                    alt: "tiles/oceanAlt.svg"
                },
                [f.ANT_HELL]: {
                    name: "Ant Hell",
                    color: "#8E603F",
                    tile: "tiles/antHell.svg"
                },
                [f.HELL]: {
                    name: "Hell",
                    color: "#973332",
                    tile: "tiles/hell.svg"
                },
                [f.SEWERS]: {
                    name: "Sewers",
                    color: "#676733",
                    tile: "tiles/sewer.svg"
                },
                [f.DARK_FOREST]: {
                    name: "Dark Forest",
                    color: "#2C5037",
                    tile: "tiles/forest.svg"
                },
                [f.HALLOWEEN]: {
                    name: "Halloween",
                    color: "#CF5704",
                    tile: "tiles/pumpkin.svg"
                }
            };
            class w {
                static actions = {
                    circle: [0, "x", "y", "radius"],
                    rect: [1, "x", "y", "width", "height"],
                    text: [2, "x", "y", "size", "text"],
                    line: [3, "x1", "y1", "x2", "y2"],
                    arc: [4, "x", "y", "radius", "startAngle", "endAngle"],
                    beginPath: [5],
                    closePath: [6],
                    moveTo: [7, "x", "y"],
                    lineTo: [8, "x", "y"],
                    stroke: [9, "color", "lineWidth", "strokeDarkness"],
                    fill: [10, "color"],
                    paint: [11, "color", "lineWidth", "strokeDarkness"],
                    polygon: [12, "sides", "radius", "rotation"],
                    spikeBall: [13, "sides", "radius", "rotation"],
                    dipPolygon: [14, "sides", "radius", "dipMult", "rotation"],
                    opacity: [15, "opacity"],
                    blur: [16, "color", "strength"],
                    noBlur: [17],
                    ellipse: [18, "x", "y", "radiusX", "radiusY", "rotation"]
                };
                static reverseActions = Object.fromEntries(Object.keys(w.actions).map((t => [w.actions[t][0], t])));
                static fromString(t) {
                    const e = new w;
                    return e.actions = t.split(";").map((t => {
                        const [e,...i] = t.split(",").map((t => {
                            if ("" === t)
                                return;
                            if ("#" === t[0])
                                return t;
                            if ("string" == typeof t && ("date" === t || t.startsWith("date_")))
                                return t;
                            const e = parseFloat(t);
                            return isNaN(e) ? t : e
                        }
                        ));
                        return [e, ...i]
                    }
                    )),
                    e
                }
                constructor() {
                    this.actions = []
                }
                addAction(t, ...e) {
                    const i = w.actions[t];
                    if (!i)
                        throw new Error(`Unknown action: ${t}`);
                    if (e.length !== i.length - 1)
                        throw new Error(`Invalid number of arguments for action ${t}, please provide ${i.slice(1).join(", ")}`);
                    return this.actions.push([i[0], ...e]),
                    this
                }
                getActions(t) {
                    return this.actions.filter((e => e[0] === w.actions[t][0]))
                }
                toString() {
                    return this.actions.map((t => t.join(","))).join(";")
                }
            }
            class b {
                constructor(t, e, i) {
                    this.reader = !0,
                    this._e = i,
                    t && this.repurpose(t, e)
                }
                repurpose(t, e) {
                    this.view = t,
                    this._o = e || 0
                }
                getUint8() {
                    return this.view.getUint8(this._o++, this._e)
                }
                getInt8() {
                    return this.view.getInt8(this._o++, this._e)
                }
                getUint16() {
                    return this.view.getUint16((this._o += 2) - 2, this._e)
                }
                getInt16() {
                    return this.view.getInt16((this._o += 2) - 2, this._e)
                }
                getUint32() {
                    return this.view.getUint32((this._o += 4) - 4, this._e)
                }
                getInt32() {
                    return this.view.getInt32((this._o += 4) - 4, this._e)
                }
                getFloat32() {
                    return this.view.getFloat32((this._o += 4) - 4, this._e)
                }
                getFloat64() {
                    return this.view.getFloat64((this._o += 8) - 8, this._e)
                }
                getStringUTF8() {
                    let t, e = "";
                    for (; 0 !== (t = this.view.getUint8(this._o++)); )
                        e += String.fromCharCode(t);
                    return decodeURIComponent(escape(e))
                }
            }
            class M {
                constructor(t) {
                    return this.writer = !0,
                    this.tmpBuf = new DataView(new ArrayBuffer(8)),
                    this._e = t,
                    this.reset(),
                    this
                }
                reset(t=this._e) {
                    this._e = t,
                    this._b = [],
                    this._o = 0
                }
                setUint8(t) {
                    return t >= 0 && t < 256 && this._b.push(t),
                    this
                }
                setInt8(t) {
                    return t >= -128 && t < 128 && this._b.push(t),
                    this
                }
                setUint16(t) {
                    return this.tmpBuf.setUint16(0, t, this._e),
                    this._move(2),
                    this
                }
                setInt16(t) {
                    return this.tmpBuf.setInt16(0, t, this._e),
                    this._move(2),
                    this
                }
                setUint32(t) {
                    return this.tmpBuf.setUint32(0, t, this._e),
                    this._move(4),
                    this
                }
                setInt32(t) {
                    return this.tmpBuf.setInt32(0, t, this._e),
                    this._move(4),
                    this
                }
                setFloat32(t) {
                    return this.tmpBuf.setFloat32(0, t, this._e),
                    this._move(4),
                    this
                }
                setFloat64(t) {
                    return this.tmpBuf.setFloat64(0, t, this._e),
                    this._move(8),
                    this
                }
                _move(t) {
                    for (let e = 0; e < t; e++)
                        this._b.push(this.tmpBuf.getUint8(e))
                }
                setStringUTF8(t) {
                    const e = unescape(encodeURIComponent(t));
                    for (let t = 0, i = e.length; t < i; t++)
                        this._b.push(e.charCodeAt(t));
                    return this._b.push(0),
                    this
                }
                build() {
                    return new Uint8Array(this._b)
                }
            }
            function v(t) {
                const e = [t.id, t.name, t.description, t.cooldown, 0]
                  , i = e.length - 1;
                return 0 !== t.tiers[0].extraHealth && (e[i] |= 1),
                0 !== t.tiers[0].constantHeal && (e[i] |= 2),
                t.tiers.some((t => t.count > 1)) && (e[i] |= 4),
                0 !== t.tiers[0].damageReduction && (e[i] |= 8),
                1 !== t.tiers[0].speedMultiplier && (e[i] |= 16),
                0 !== t.tiers[0].extraSize && (e[i] |= 32),
                0 !== t.tiers[0].healing && (e[i] |= 64),
                t.tiers[0].extraRadians > 0 && (e[i] |= 128),
                t.tiers[0].poison && (e[i] |= 1024),
                t.tiers[0].extraRange > 0 && (e[i] |= 2048),
                t.tiers[0].spawnable && (e[i] |= 8192),
                (t.tiers[0].extraVision > 0 || t.tiers[0].extraVision < 0) && (e[i] |= 16384),
                t.tiers[0].pentagramAbility && (e[i] |= 32768),
                t.tiers[0].lightning && (e[i] |= 65536),
                t.tiers[0].extraPickupRange > 0 && (e[i] |= 131072),
                t.healSpit?.heal > 0 && (e[i] |= 262144),
                null !== t.tiers[0].damageReflection && (e[i] |= 524288),
                1 !== t.tiers[0].density && (e[i] |= 1048576),
                null !== t.tiers[0].deathDefying && (e[i] |= 2097152),
                t.tiers[0].absorbsDamage && (e[i] |= 4194304),
                t.tiers[0].shield > 0 && (e[i] |= 8388608),
                null !== t.tiers[0].boost && (e[i] |= 16777216),
                (t.tiers[0].healBack > 0 || t.tiers[0].healBack < 0) && (e[i] |= 67108864),
                t.extraLighting > 0 && (e[i] |= 134217728),
                0 !== t.tiers[0].armor && (e[i] |= 536870912),
                e.push(...t.tiers.flatMap(( (s, n) => {
                    const h = [s.health, s.damage];
                    return 1 & e[i] && h.push(s.extraHealth),
                    2 & e[i] && h.push(s.constantHeal),
                    4 & e[i] && h.push(s.count),
                    8 & e[i] && h.push(s.damageReduction),
                    16 & e[i] && h.push(s.speedMultiplier),
                    32 & e[i] && h.push(s.extraSize),
                    64 & e[i] && h.push(s.healing),
                    128 & e[i] && h.push(s.extraRadians),
                    1024 & e[i] && h.push(s.poison.damage, s.poison.duration / 22.5),
                    2048 & e[i] && h.push(s.extraRange),
                    8192 & e[i] && h.push(s.spawnable.index, s.spawnable.rarity, s.spawnable.timer),
                    16384 & e[i] && h.push(s.extraVision),
                    32768 & e[i] && h.push(s.pentagramAbility.cooldown, s.pentagramAbility.range, s.pentagramAbility.damage, s.pentagramAbility.poison.damage, s.pentagramAbility.poison.duration, s.pentagramAbility.speedDebuff.multiplier, s.pentagramAbility.speedDebuff.duration),
                    65536 & e[i] && h.push(s.lightning.bounces, s.lightning.range, s.lightning.damage, s.lightning.charges),
                    131072 & e[i] && h.push(s.extraPickupRange),
                    262144 & e[i] && h.push(t.healSpit.heal * Math.pow(a.HEALTH_SCALE, n)),
                    524288 & e[i] && h.push(s.damageReflection.reflection, s.damageReflection.cap),
                    1048576 & e[i] && h.push(s.density),
                    2097152 & e[i] && h.push(s.deathDefying.health, s.deathDefying.duration),
                    4194304 & e[i] && h.push(s.absorbsDamage.maxDamage, s.absorbsDamage.period / 22.5),
                    8388608 & e[i] && h.push(s.shield),
                    16777216 & e[i] && h.push(s.boost.length, s.boost.delay / 22.5),
                    67108864 & e[i] && h.push(s.healBack),
                    536870912 & e[i] && h.push(s.armor),
                    h
                }
                ))),
                t.drawing?.toString().length > 0 && (e[i] |= 256,
                e.push(t.drawing.toString())),
                t.enemySpeedDebuff && (e[i] |= 512,
                e.push(t.enemySpeedDebuff.speedMultiplier, t.enemySpeedDebuff.duration)),
                t.wearable && (e[i] |= 4096),
                t.healWhenUnder < 1 && (e[i] |= 33554432,
                e.push(t.healWhenUnder)),
                134217728 & e[i] && e.push(t.extraLighting),
                t.extraDamage && (e[i] |= 268435456,
                e.push(t.extraDamage.minHp, t.extraDamage.maxHp, t.extraDamage.multiplier)),
                t.splits && (e[i] |= 1073741824,
                e.push(t.splits.count)),
                t.icon && (e[i] |= 2147483648,
                e.push(t.icon.size, t.icon.count, t.icon.name)),
                e.map((t => Number.isFinite(t) ? +t.toFixed(2) : t))
            }
            function x(t) {
                const e = [t.id, t.name, +t.isSystem, t.drops, 0]
                  , i = e.length - 1;
                return 0 !== t.tiers[0].damageReduction && (e[i] |= 1),
                t.tiers[0].poison && (e[i] |= 2),
                t.tiers[0].lightning && (e[i] |= 4),
                t.damageReflection && (e[i] |= 8),
                0 !== t.tiers[0].armor && (e[i] |= 16),
                t.healing && (e[i] |= 32),
                t.tiers[0].projectile && (e[i] |= 64),
                t.wavesIconSize && (e[i] |= 256),
                e.push(...t.tiers.flatMap(( (t, s) => {
                    const a = [t.health, t.damage];
                    return 1 & e[i] && a.push(t.damageReduction),
                    2 & e[i] && a.push(t.poison.damage, t.poison.duration / 22.5),
                    4 & e[i] && a.push(t.lightning.damage),
                    16 & e[i] && a.push(t.armor),
                    64 & e[i] && a.push(t.projectile.health, t.projectile.damage, t.projectile.petalIndex, t.projectile.range),
                    a
                }
                ))),
                8 & e[i] && e.push(t.damageReflection.reflection, t.damageReflection.cap),
                32 & e[i] && e.push(t.healing),
                t.drawing?.toString().length > 0 && (e[i] |= 128,
                e.push(t.drawing.toString())),
                256 & e[i] && e.push(t.wavesIconSize),
                e.map((t => Number.isFinite(t) ? +t.toFixed(2) : t))
            }
            function S(t, e, i) {
                const s = [t.length, ...t.flatMap((t => [t.name, t.color]))];
                return s.push(...function(t) {
                    const e = [t.length];
                    for (const i of t) {
                        const t = v(i);
                        e.push(...t)
                    }
                    return e
                }(e)),
                s.push(...function(t) {
                    const e = [t.length];
                    for (const i of t) {
                        const t = x(i);
                        e.push(...t)
                    }
                    return e
                }(i)),
                s
            }
            const E = {};
            async function D() {
                const t = await fetch("/assets/terrains.json")
                  , e = await t.json();
                Object.assign(E, e)
            }
            const R = {
                TOP: 1,
                RIGHT: 2,
                BOTTOM: 4,
                LEFT: 8
            };
            function T(t) {
                const e = E[t];
                if (!e)
                    return {
                        id: [0, 0],
                        terrain: E[0][0]
                    };
                const i = Math.random() * e.length | 0;
                return {
                    id: [t, i],
                    terrain: e[i]
                }
            }
            const P = {
                FFA: 0,
                TDM: 1,
                WAVES: 2,
                LINE: 3,
                MAZE: 4
            }
        }
        ,
        111: (t, e, i) => {
            i.d(e, {
                A: () => B
            });
            var s = i(110)
              , a = i(512)
              , n = i(904)
              , h = i(446)
              , r = i(874);
            const o = [];
            fetch("/profanity.txt").then((t => t.text())).then((t => {
                o.push(...t.replaceAll("\r", "").split("\n").map((t => t.trim()))),
                console.log("Profanity list loaded", o.length, "words")
            }
            ));
            const l = [/\b([sŚśṤṥŜŝŠšṦṧṠṡŞşṢṣṨṩȘșS̩s̩ꞨꞩⱾȿꟅʂᶊᵴ][a4ÁáÀàĂăẮắẰằẴẵẲẳÂâẤấẦầẪẫẨẩǍǎÅåǺǻÄäǞǟÃãȦȧǠǡĄąĄ́ą́Ą̃ą̃ĀāĀ̀ā̀ẢảȀȁA̋a̋ȂȃẠạẶặẬậḀḁȺⱥꞺꞻᶏẚＡａ][nŃńǸǹŇňÑñṄṅŅņṆṇṊṋṈṉN̈n̈ƝɲŊŋꞐꞑꞤꞥᵰᶇɳȵꬻꬼИиПпＮｎ][dĎďḊḋḐḑD̦d̦ḌḍḒḓḎḏĐđÐðƉɖƊɗᵭᶁᶑȡ])*[nŃńǸǹŇňÑñṄṅŅņṆṇṊṋṈṉN̈n̈ƝɲŊŋꞐꞑꞤꞥᵰᶇɳȵꬻꬼИиПпＮｎ]+[iÍíi̇́Ììi̇̀ĬĭÎîǏǐÏïḮḯĨĩi̇̃ĮįĮ́į̇́Į̃į̇̃ĪīĪ̀ī̀ỈỉȈȉI̋i̋ȊȋỊịꞼꞽḬḭƗɨᶖİiIıＩｉ1lĺľļḷḹl̃ḽḻłŀƚꝉⱡɫɬꞎꬷꬸꬹᶅɭȴＬｌoÓóÒòŎŏÔôỐốỒồỖỗỔổǑǒÖöȪȫŐőÕõṌṍṎṏȬȭȮȯO͘o͘ȰȱØøǾǿǪǫǬǭŌōṒṓṐṑỎỏȌȍȎȏƠơỚớỜờỠỡỞởỢợỌọỘộO̩o̩Ò̩ò̩Ó̩ó̩ƟɵꝊꝋꝌꝍⱺＯｏІіa4ÁáÀàĂăẮắẰằẴẵẲẳÂâẤấẦầẪẫẨẩǍǎÅåǺǻÄäǞǟÃãȦȧǠǡĄąĄ́ą́Ą̃ą̃ĀāĀ̀ā̀ẢảȀȁA̋a̋ȂȃẠạẶặẬậḀḁȺⱥꞺꞻᶏẚＡａ]*[gǴǵĞğĜĝǦǧĠġG̃g̃ĢģḠḡǤǥꞠꞡƓɠᶃꬶＧｇqꝖꝗꝘꝙɋʠ]+(l[e3ЄєЕеÉéÈèĔĕÊêẾếỀềỄễỂểÊ̄ê̄Ê̌ê̌ĚěËëẼẽĖėĖ́ė́Ė̃ė̃ȨȩḜḝĘęĘ́ę́Ę̃ę̃ĒēḖḗḔḕẺẻȄȅE̋e̋ȆȇẸẹỆệḘḙḚḛɆɇE̩e̩È̩è̩É̩é̩ᶒⱸꬴꬳＥｅ]+t+|[e3ЄєЕеÉéÈèĔĕÊêẾếỀềỄễỂểÊ̄ê̄Ê̌ê̌ĚěËëẼẽĖėĖ́ė́Ė̃ė̃ȨȩḜḝĘęĘ́ę́Ę̃ę̃ĒēḖḗḔḕẺẻȄȅE̋e̋ȆȇẸẹỆệḘḙḚḛɆɇE̩e̩È̩è̩É̩é̩ᶒⱸꬴꬳＥｅa4ÁáÀàĂăẮắẰằẴẵẲẳÂâẤấẦầẪẫẨẩǍǎÅåǺǻÄäǞǟÃãȦȧǠǡĄąĄ́ą́Ą̃ą̃ĀāĀ̀ā̀ẢảȀȁA̋a̋ȂȃẠạẶặẬậḀḁȺⱥꞺꞻᶏẚＡａ]*[rŔŕŘřṘṙŖŗȐȑȒȓṚṛṜṝṞṟR̃r̃ɌɍꞦꞧⱤɽᵲᶉꭉ]*|n[ÓóÒòŎŏÔôỐốỒồỖỗỔổǑǒÖöȪȫŐőÕõṌṍṎṏȬȭȮȯO͘o͘ȰȱØøǾǿǪǫǬǭŌōṒṓṐṑỎỏȌȍȎȏƠơỚớỜờỠỡỞởỢợỌọỘộO̩o̩Ò̩ò̩Ó̩ó̩ƟɵꝊꝋꝌꝍⱺＯｏ0]+[gǴǵĞğĜĝǦǧĠġG̃g̃ĢģḠḡǤǥꞠꞡƓɠᶃꬶＧｇqꝖꝗꝘꝙɋʠ]+|[a4ÁáÀàĂăẮắẰằẴẵẲẳÂâẤấẦầẪẫẨẩǍǎÅåǺǻÄäǞǟÃãȦȧǠǡĄąĄ́ą́Ą̃ą̃ĀāĀ̀ā̀ẢảȀȁA̋a̋ȂȃẠạẶặẬậḀḁȺⱥꞺꞻᶏẚＡａ]*)*[sŚśṤṥŜŝŠšṦṧṠṡŞşṢṣṨṩȘșS̩s̩ꞨꞩⱾȿꟅʂᶊᵴ]*\b/, /[fḞḟƑƒꞘꞙᵮᶂ]+[aÁáÀàĂăẮắẰằẴẵẲẳÂâẤấẦầẪẫẨẩǍǎÅåǺǻÄäǞǟÃãȦȧǠǡĄąĄ́ą́Ą̃ą̃ĀāĀ̀ā̀ẢảȀȁA̋a̋ȂȃẠạẶặẬậḀḁȺⱥꞺꞻᶏẚＡａ@4]+[gǴǵĞğĜĝǦǧĠġG̃g̃ĢģḠḡǤǥꞠꞡƓɠᶃꬶＧｇqꝖꝗꝘꝙɋʠ]+([ÓóÒòŎŏÔôỐốỒồỖỗỔổǑǒÖöȪȫŐőÕõṌṍṎṏȬȭȮȯO͘o͘ȰȱØøǾǿǪǫǬǭŌōṒṓṐṑỎỏȌȍȎȏƠơỚớỜờỠỡỞởỢợỌọỘộO̩o̩Ò̩ò̩Ó̩ó̩ƟɵꝊꝋꝌꝍⱺＯｏ0e3ЄєЕеÉéÈèĔĕÊêẾếỀềỄễỂểÊ̄ê̄Ê̌ê̌ĚěËëẼẽĖėĖ́ė́Ė̃ė̃ȨȩḜḝĘęĘ́ę́Ę̃ę̃ĒēḖḗḔḕẺẻȄȅE̋e̋ȆȇẸẹỆệḘḙḚḛɆɇE̩e̩È̩è̩É̩é̩ᶒⱸꬴꬳＥｅiÍíi̇́Ììi̇̀ĬĭÎîǏǐÏïḮḯĨĩi̇̃ĮįĮ́į̇́Į̃į̇̃ĪīĪ̀ī̀ỈỉȈȉI̋i̋ȊȋỊịꞼꞽḬḭƗɨᶖİiIıＩｉ1lĺľļḷḹl̃ḽḻłŀƚꝉⱡɫɬꞎꬷꬸꬹᶅɭȴＬｌ]+[tŤťṪṫŢţṬṭȚțṰṱṮṯŦŧȾⱦƬƭƮʈT̈ẗᵵƫȶ]+([rŔŕŘřṘṙŖŗȐȑȒȓṚṛṜṝṞṟR̃r̃ɌɍꞦꞧⱤɽᵲᶉꭉ]+[yÝýỲỳŶŷY̊ẙŸÿỸỹẎẏȲȳỶỷỴỵɎɏƳƴỾỿ]+|[rŔŕŘřṘṙŖŗȐȑȒȓṚṛṜṝṞṟR̃r̃ɌɍꞦꞧⱤɽᵲᶉꭉ]+[iÍíi̇́Ììi̇̀ĬĭÎîǏǐÏïḮḯĨĩi̇̃ĮįĮ́į̇́Į̃į̇̃ĪīĪ̀ī̀ỈỉȈȉI̋i̋ȊȋỊịꞼꞽḬḭƗɨᶖİiIıＩｉ1lĺľļḷḹl̃ḽḻłŀƚꝉⱡɫɬꞎꬷꬸꬹᶅɭȴＬｌ]+[e3ЄєЕеÉéÈèĔĕÊêẾếỀềỄễỂểÊ̄ê̄Ê̌ê̌ĚěËëẼẽĖėĖ́ė́Ė̃ė̃ȨȩḜḝĘęĘ́ę́Ę̃ę̃ĒēḖḗḔḕẺẻȄȅE̋e̋ȆȇẸẹỆệḘḙḚḛɆɇE̩e̩È̩è̩É̩é̩ᶒⱸꬴꬳＥｅ]+)?)?[sŚśṤṥŜŝŠšṦṧṠṡŞşṢṣṨṩȘșS̩s̩ꞨꞩⱾȿꟅʂᶊᵴ]*\b/, /\b[kḰḱǨǩĶķḲḳḴḵƘƙⱩⱪᶄꝀꝁꝂꝃꝄꝅꞢꞣ]+[iÍíi̇́Ììi̇̀ĬĭÎîǏǐÏïḮḯĨĩi̇̃ĮįĮ́į̇́Į̃į̇̃ĪīĪ̀ī̀ỈỉȈȉI̋i̋ȊȋỊịꞼꞽḬḭƗɨᶖİiIıＩｉ1lĺľļḷḹl̃ḽḻłŀƚꝉⱡɫɬꞎꬷꬸꬹᶅɭȴＬｌyÝýỲỳŶŷY̊ẙŸÿỸỹẎẏȲȳỶỷỴỵɎɏƳƴỾỿ]+[kḰḱǨǩĶķḲḳḴḵƘƙⱩⱪᶄꝀꝁꝂꝃꝄꝅꞢꞣ]+[e3ЄєЕеÉéÈèĔĕÊêẾếỀềỄễỂểÊ̄ê̄Ê̌ê̌ĚěËëẼẽĖėĖ́ė́Ė̃ė̃ȨȩḜḝĘęĘ́ę́Ę̃ę̃ĒēḖḗḔḕẺẻȄȅE̋e̋ȆȇẸẹỆệḘḙḚḛɆɇE̩e̩È̩è̩É̩é̩ᶒⱸꬴꬳＥｅ]([rŔŕŘřṘṙŖŗȐȑȒȓṚṛṜṝṞṟR̃r̃ɌɍꞦꞧⱤɽᵲᶉꭉ]+[yÝýỲỳŶŷY̊ẙŸÿỸỹẎẏȲȳỶỷỴỵɎɏƳƴỾỿ]+|[rŔŕŘřṘṙŖŗȐȑȒȓṚṛṜṝṞṟR̃r̃ɌɍꞦꞧⱤɽᵲᶉꭉ]+[iÍíi̇́Ììi̇̀ĬĭÎîǏǐÏïḮḯĨĩi̇̃ĮįĮ́į̇́Į̃į̇̃ĪīĪ̀ī̀ỈỉȈȉI̋i̋ȊȋỊịꞼꞽḬḭƗɨᶖİiIıＩｉ1lĺľļḷḹl̃ḽḻłŀƚꝉⱡɫɬꞎꬷꬸꬹᶅɭȴＬｌ]+[e3ЄєЕеÉéÈèĔĕÊêẾếỀềỄễỂểÊ̄ê̄Ê̌ê̌ĚěËëẼẽĖėĖ́ė́Ė̃ė̃ȨȩḜḝĘęĘ́ę́Ę̃ę̃ĒēḖḗḔḕẺẻȄȅE̋e̋ȆȇẸẹỆệḘḙḚḛɆɇE̩e̩È̩è̩É̩é̩ᶒⱸꬴꬳＥｅ]+)?[sŚśṤṥŜŝŠšṦṧṠṡŞşṢṣṨṩȘșS̩s̩ꞨꞩⱾȿꟅʂᶊᵴ]*\b/, /\b[tŤťṪṫŢţṬṭȚțṰṱṮṯŦŧȾⱦƬƭƮʈT̈ẗᵵƫȶ]+[rŔŕŘřṘṙŖŗȐȑȒȓṚṛṜṝṞṟR̃r̃ɌɍꞦꞧⱤɽᵲᶉꭉ]+([aÁáÀàĂăẮắẰằẴẵẲẳÂâẤấẦầẪẫẨẩǍǎÅåǺǻÄäǞǟÃãȦȧǠǡĄąĄ́ą́Ą̃ą̃ĀāĀ̀ā̀ẢảȀȁA̋a̋ȂȃẠạẶặẬậḀḁȺⱥꞺꞻᶏẚＡａ4]+[nŃńǸǹŇňÑñṄṅŅņṆṇṊṋṈṉN̈n̈ƝɲŊŋꞐꞑꞤꞥᵰᶇɳȵꬻꬼИиПпＮｎ]+([iÍíi̇́Ììi̇̀ĬĭÎîǏǐÏïḮḯĨĩi̇̃ĮįĮ́į̇́Į̃į̇̃ĪīĪ̀ī̀ỈỉȈȉI̋i̋ȊȋỊịꞼꞽḬḭƗɨᶖİiIıＩｉ1lĺľļḷḹl̃ḽḻłŀƚꝉⱡɫɬꞎꬷꬸꬹᶅɭȴＬｌ]+[e3ЄєЕеÉéÈèĔĕÊêẾếỀềỄễỂểÊ̄ê̄Ê̌ê̌ĚěËëẼẽĖėĖ́ė́Ė̃ė̃ȨȩḜḝĘęĘ́ę́Ę̃ę̃ĒēḖḗḔḕẺẻȄȅE̋e̋ȆȇẸẹỆệḘḙḚḛɆɇE̩e̩È̩è̩É̩é̩ᶒⱸꬴꬳＥｅ]+|[yÝýỲỳŶŷY̊ẙŸÿỸỹẎẏȲȳỶỷỴỵɎɏƳƴỾỿ]+|[e3ЄєЕеÉéÈèĔĕÊêẾếỀềỄễỂểÊ̄ê̄Ê̌ê̌ĚěËëẼẽĖėĖ́ė́Ė̃ė̃ȨȩḜḝĘęĘ́ę́Ę̃ę̃ĒēḖḗḔḕẺẻȄȅE̋e̋ȆȇẸẹỆệḘḙḚḛɆɇE̩e̩È̩è̩É̩é̩ᶒⱸꬴꬳＥｅ]+[rŔŕŘřṘṙŖŗȐȑȒȓṚṛṜṝṞṟR̃r̃ɌɍꞦꞧⱤɽᵲᶉꭉ]+|[oÓóÒòŎŏÔôỐốỒồỖỗỔổǑǒÖöȪȫŐőÕõṌṍṎṏȬȭȮȯO͘o͘ȰȱØøǾǿǪǫǬǭŌōṒṓṐṑỎỏȌȍȎȏƠơỚớỜờỠỡỞởỢợỌọỘộO̩o̩Ò̩ò̩Ó̩ó̩ƟɵꝊꝋꝌꝍⱺＯｏ]+[iÍíi̇́Ììi̇̀ĬĭÎîǏǐÏïḮḯĨĩi̇̃ĮįĮ́į̇́Į̃į̇̃ĪīĪ̀ī̀ỈỉȈȉI̋i̋ȊȋỊịꞼꞽḬḭƗɨᶖİiIıＩｉ1lĺľļḷḹl̃ḽḻłŀƚꝉⱡɫɬꞎꬷꬸꬹᶅɭȴＬｌ]+[dĎďḊḋḐḑD̦d̦ḌḍḒḓḎḏĐđÐðƉɖƊɗᵭᶁᶑȡ]+)|[oÓóÒòŎŏÔôỐốỒồỖỗỔổǑǒÖöȪȫŐőÕõṌṍṎṏȬȭȮȯO͘o͘ȰȱØøǾǿǪǫǬǭŌōṒṓṐṑỎỏȌȍȎȏƠơỚớỜờỠỡỞởỢợỌọỘộO̩o̩Ò̩ò̩Ó̩ó̩ƟɵꝊꝋꝌꝍⱺＯｏ]+[iÍíi̇́Ììi̇̀ĬĭÎîǏǐÏïḮḯĨĩi̇̃ĮįĮ́į̇́Į̃į̇̃ĪīĪ̀ī̀ỈỉȈȉI̋i̋ȊȋỊịꞼꞽḬḭƗɨᶖİiIıＩｉ1lĺľļḷḹl̃ḽḻłŀƚꝉⱡɫɬꞎꬷꬸꬹᶅɭȴＬｌ]+[dĎďḊḋḐḑD̦d̦ḌḍḒḓḎḏĐđÐðƉɖƊɗᵭᶁᶑȡ]+)[sŚśṤṥŜŝŠšṦṧṠṡŞşṢṣṨṩȘșS̩s̩ꞨꞩⱾȿꟅʂᶊᵴ]*\b/, /\b[cĆćĈĉČčĊċÇçḈḉȻȼꞒꞓꟄꞔƇƈɕ]+[ÓóÒòŎŏÔôỐốỒồỖỗỔổǑǒÖöȪȫŐőÕõṌṍṎṏȬȭȮȯO͘o͘ȰȱØøǾǿǪǫǬǭŌōṒṓṐṑỎỏȌȍȎȏƠơỚớỜờỠỡỞởỢợỌọỘộO̩o̩Ò̩ò̩Ó̩ó̩ƟɵꝊꝋꝌꝍⱺＯｏ0]{2,}[nŃńǸǹŇňÑñṄṅŅņṆṇṊṋṈṉN̈n̈ƝɲŊŋꞐꞑꞤꞥᵰᶇɳȵꬻꬼИиПпＮｎ]+[sŚśṤṥŜŝŠšṦṧṠṡŞşṢṣṨṩȘșS̩s̩ꞨꞩⱾȿꟅʂᶊᵴ]*\b/, /\b[cĆćĈĉČčĊċÇçḈḉȻȼꞒꞓꟄꞔƇƈɕ]+[hĤĥȞȟḦḧḢḣḨḩḤḥḪḫH̱ẖĦħⱧⱨꞪɦꞕΗНн]+[iÍíi̇́Ììi̇̀ĬĭÎîǏǐÏïḮḯĨĩi̇̃ĮįĮ́į̇́Į̃į̇̃ĪīĪ̀ī̀ỈỉȈȉI̋i̋ȊȋỊịꞼꞽḬḭƗɨᶖİiIıＩｉ1lĺľļḷḹl̃ḽḻłŀƚꝉⱡɫɬꞎꬷꬸꬹᶅɭȴＬｌ]+[nŃńǸǹŇňÑñṄṅŅņṆṇṊṋṈṉN̈n̈ƝɲŊŋꞐꞑꞤꞥᵰᶇɳȵꬻꬼИиПпＮｎ]+[kḰḱǨǩĶķḲḳḴḵƘƙⱩⱪᶄꝀꝁꝂꝃꝄꝅꞢꞣ]+[sŚśṤṥŜŝŠšṦṧṠṡŞşṢṣṨṩȘșS̩s̩ꞨꞩⱾȿꟅʂᶊᵴ]*\b/]
              , d = t => l.some((e => e.test(t)));
            class c {
                id = 0;
                name = "";
                nameColor = "#FFFFFF";
                rarity = 0;
                level = 0;
                isNew = !0;
                x = 0;
                y = 0;
                size = 0;
                facing = 0;
                flags = 0;
                healthRatio = 1;
                shieldRatio = 0;
                team = 0;
                wearing = 0;
                updatePosition = !1;
                updateSize = !1;
                updateFacing = !1;
                updateFlags = !1;
                updateHealth = !1;
                updateDisplay = !1;
                update(t) {
                    this.x === t.x && this.y === t.y || (this.x = t.x,
                    this.y = t.y,
                    this.updatePosition = !0),
                    this.size !== t.size && (this.size = t.size,
                    this.updateSize = !0),
                    this.facing !== t.facing && (this.facing = t.facing,
                    this.updateFacing = !0);
                    let e = 0;
                    t.hit > 0 && (e |= s.so.HIT),
                    t.attack && (e |= s.so.ATTACK),
                    t.defend && (e |= s.so.DEFEND),
                    t.poison.timer > 0 && (e |= s.so.POISON);
                    let i = Math.min(255, Math.max(0, t.team < 0 ? -t.team : 0));
                    i !== this.team && (this.team = i,
                    e |= s.so.TDM);
                    let a = 0;
                    for (const e in s.DQ)
                        t.wearing[s.DQ[e]] > 0 && (a |= s.DQ[e]);
                    a !== this.wearing && (this.wearing = a,
                    e |= s.so.WEARABLES),
                    e !== this.flags && (this.flags = e,
                    this.updateFlags = !0),
                    this.healthRatio === t.health.ratio && this.shieldRatio === t.health.shieldRatio || (this.healthRatio = t.health.ratio,
                    this.shieldRatio = t.health.shieldRatio,
                    this.updateHealth = !0),
                    this.rarity === t.rarity && this.level === t.level && this.name === t.name && this.nameColor === t.nameColor || (this.rarity = t.rarity,
                    this.level = t.level,
                    this.name = t.name,
                    this.nameColor = t.nameColor,
                    this.updateDisplay = !0)
                }
                pipe(t) {
                    if (this.isNew || this.updatePosition || this.updateSize || this.updateFacing || this.updateFlags || this.updateHealth || this.updateDisplay) {
                        if (this.isNew)
                            return this.isNew = !1,
                            this.updatePosition = !1,
                            this.updateSize = !1,
                            this.updateFacing = !1,
                            this.updateFlags = !1,
                            t.setUint32(this.id),
                            t.setUint8(s.w6.NEW),
                            t.setStringUTF8(this.name),
                            t.setStringUTF8(this.nameColor),
                            t.setUint8(this.rarity),
                            t.setUint16(this.level),
                            t.setFloat32(this.x),
                            t.setFloat32(this.y),
                            t.setFloat32(this.size),
                            t.setFloat32(this.facing),
                            t.setUint8(this.flags),
                            this.flags & s.so.TDM && t.setUint8(this.team),
                            this.flags & s.so.WEARABLES && t.setUint8(this.wearing),
                            t.setUint8(255 * this.healthRatio + .5 | 0),
                            void t.setUint8(255 * this.shieldRatio + .5 | 0);
                        t.setUint32(this.id),
                        t.setUint8((this.updatePosition ? s.w6.POSITION : 0) | (this.updateSize ? s.w6.SIZE : 0) | (this.updateFacing ? s.w6.FACING : 0) | (this.updateFlags ? s.w6.FLAGS : 0) | (this.updateHealth ? s.w6.HEALTH : 0) | (this.updateDisplay ? s.w6.DISPLAY : 0)),
                        this.updatePosition && (this.updatePosition = !1,
                        t.setFloat32(this.x),
                        t.setFloat32(this.y)),
                        this.updateSize && (this.updateSize = !1,
                        t.setFloat32(this.size)),
                        this.updateFacing && (this.updateFacing = !1,
                        t.setFloat32(this.facing)),
                        this.updateFlags && (this.updateFlags = !1,
                        t.setUint8(this.flags),
                        this.flags & s.so.TDM && t.setUint8(this.team),
                        this.flags & s.so.WEARABLES && t.setUint8(this.wearing)),
                        this.updateHealth && (this.updateHealth = !1,
                        t.setUint8(255 * this.healthRatio + .5 | 0),
                        t.setUint8(255 * this.shieldRatio + .5 | 0)),
                        this.updateDisplay && (this.updateDisplay = !1,
                        t.setStringUTF8(this.name),
                        t.setStringUTF8(this.nameColor),
                        t.setUint8(this.rarity),
                        t.setUint16(this.level))
                    }
                }
            }
            class g {
                id = 0;
                index = 0;
                rarity = 0;
                isNew = !0;
                x = 0;
                y = 0;
                size = 0;
                facing = 0;
                hit = !1;
                updatePosition = !1;
                updateSize = !1;
                updateFacing = !1;
                updateFlags = !1;
                update(t) {
                    this.x === t.x && this.y === t.y || (this.x = t.x,
                    this.y = t.y,
                    this.updatePosition = !0),
                    this.size !== t.size && (this.size = t.size,
                    this.updateSize = !0),
                    this.facing !== t.facing && (this.facing = t.facing,
                    this.updateFacing = !0),
                    this.hit !== t.hit && (this.hit = t.hit > 0,
                    this.updateFlags = !0)
                }
                pipe(t) {
                    if (this.isNew || this.updatePosition || this.updateSize || this.updateFacing || this.updateFlags) {
                        if (this.isNew)
                            return this.isNew = !1,
                            this.updatePosition = !1,
                            this.updateSize = !1,
                            this.updateFacing = !1,
                            this.updateFlags = !1,
                            t.setUint32(this.id),
                            t.setUint8(s.w6.NEW),
                            t.setUint8(this.index),
                            t.setUint8(this.rarity),
                            t.setFloat32(this.x),
                            t.setFloat32(this.y),
                            t.setFloat32(this.size),
                            t.setFloat32(this.facing),
                            void t.setUint8(this.hit ? s.so.HIT : 0);
                        t.setUint32(this.id),
                        t.setUint8((this.updatePosition ? s.w6.POSITION : 0) | (this.updateSize ? s.w6.SIZE : 0) | (this.updateFacing ? s.w6.FACING : 0) | (this.updateFlags ? s.w6.FLAGS : 0)),
                        this.updatePosition && (this.updatePosition = !1,
                        t.setFloat32(this.x),
                        t.setFloat32(this.y)),
                        this.updateSize && (this.updateSize = !1,
                        t.setFloat32(this.size)),
                        this.updateFacing && (this.updateFacing = !1,
                        t.setFloat32(this.facing)),
                        this.updateFlags && (this.updateFlags = !1,
                        t.setUint8(this.hit ? s.so.HIT : 0))
                    }
                }
            }
            class p {
                id = 0;
                index = 0;
                rarity = 0;
                isNew = !0;
                x = 0;
                y = 0;
                size = 0;
                facing = 0;
                flags = 0;
                healthRatio = 1;
                ropeBodies = [];
                updatePosition = !1;
                updateSize = !1;
                updateFacing = !1;
                updateFlags = !1;
                updateHealth = !1;
                updateRopeBodies = !1;
                update(t) {
                    this.x === t.x && this.y === t.y || (this.x = t.x,
                    this.y = t.y,
                    this.updatePosition = !0),
                    this.size !== t.size && (this.size = t.size,
                    this.updateSize = !0),
                    this.facing !== t.facing && (this.facing = t.facing,
                    this.updateFacing = !0);
                    let e = 0;
                    if (t.hit > 0 && (e |= s.so.HIT),
                    t.ropeBodies?.length > 0) {
                        this.updateRopeBodies = !0,
                        this.ropeBodies = [{
                            x: 0,
                            y: 0
                        }];
                        for (let i = 0; i < t.ropeBodies.length; i++)
                            t.ropeBodies[i].hit > 0 && 0 === (e & s.so.HIT) && (e |= s.so.HIT),
                            this.ropeBodies.push({
                                x: (t.ropeBodies[i].x - this.x) / this.size,
                                y: (t.ropeBodies[i].y - this.y) / this.size
                            })
                    }
                    null !== t.target && (e |= s.so.ATTACK),
                    t.poison.timer > 0 && (e |= s.so.POISON),
                    t.friendly && (e |= s.so.FRIEND),
                    e !== this.flags && (this.flags = e,
                    this.updateFlags = !0),
                    this.healthRatio !== t.health.ratio && (this.healthRatio = t.health.ratio,
                    this.updateHealth = !0)
                }
                pipe(t) {
                    if (this.isNew || this.updatePosition || this.updateSize || this.updateFacing || this.updateFlags || this.updateHealth || this.updateRopeBodies) {
                        if (this.isNew)
                            return this.isNew = !1,
                            this.updatePosition = !1,
                            this.updateSize = !1,
                            this.updateFacing = !1,
                            this.updateFlags = !1,
                            t.setUint32(this.id),
                            t.setUint8(s.w6.NEW),
                            t.setUint8(this.index),
                            t.setUint8(this.rarity),
                            t.setFloat32(this.x),
                            t.setFloat32(this.y),
                            t.setFloat32(this.size),
                            t.setFloat32(this.facing),
                            t.setUint8(this.flags),
                            void t.setUint8(255 * this.healthRatio + .5 | 0);
                        if (t.setUint32(this.id),
                        t.setUint8((this.updatePosition ? s.w6.POSITION : 0) | (this.updateSize ? s.w6.SIZE : 0) | (this.updateFacing ? s.w6.FACING : 0) | (this.updateFlags ? s.w6.FLAGS : 0) | (this.updateHealth ? s.w6.HEALTH : 0) | (this.updateRopeBodies ? s.w6.ROPE_BODIES : 0)),
                        this.updatePosition && (this.updatePosition = !1,
                        t.setFloat32(this.x),
                        t.setFloat32(this.y)),
                        this.updateSize && (this.updateSize = !1,
                        t.setFloat32(this.size)),
                        this.updateFacing && (this.updateFacing = !1,
                        t.setFloat32(this.facing)),
                        this.updateFlags && (this.updateFlags = !1,
                        t.setUint8(this.flags)),
                        this.updateHealth && (this.updateHealth = !1,
                        t.setUint8(255 * this.healthRatio + .5 | 0)),
                        this.updateRopeBodies) {
                            this.updateRopeBodies = !1,
                            t.setUint8(this.ropeBodies.length);
                            for (let e = 0; e < this.ropeBodies.length; e++)
                                t.setFloat32(this.ropeBodies[e].x),
                                t.setFloat32(this.ropeBodies[e].y)
                        }
                    }
                }
            }
            class m {
                id = 0;
                isNew = !0;
                x = 0;
                y = 0;
                size = 0;
                creation = 0;
                timer = 0;
                pipe(t) {
                    this.isNew && (this.isNew = !1,
                    t.setUint32(this.id),
                    t.setUint8(s.w6.NEW),
                    t.setFloat32(this.x),
                    t.setFloat32(this.y),
                    t.setFloat32(this.size),
                    t.setStringUTF8(this.creation),
                    t.setUint32(this.timer + .5 | 0))
                }
                kill(t) {
                    t.setUint32(this.id),
                    t.setUint8(s.w6.DIE)
                }
            }
            class u {
                x = 0;
                y = 0;
                fov = 500;
                lightingBoost = 0;
                playerCache = new Map;
                petalCache = new Map;
                mobCache = new Map;
                markerCache = new Map;
                lightningCache = new Set;
                dropsToAdd = [];
                dropsToRemove = [];
                see(t) {
                    const e = a.A.viewsSpatialHash.retrieve({
                        _AABB: {
                            x1: this.x - this.fov / 1.85,
                            y1: this.y - this.fov / 1.85,
                            x2: this.x + this.fov / 1.85,
                            y2: this.y + this.fov / 1.85
                        }
                    });
                    e.forEach((t => {
                        switch (t.type) {
                        case s.wv.PLAYER:
                            if (!this.playerCache.has(t.id)) {
                                const e = new c;
                                e.id = t.id,
                                e.name = t.name,
                                e.nameColor = t.nameColor,
                                e.isNew = !0,
                                this.playerCache.set(t.id, e)
                            }
                            this.playerCache.get(t.id).update(t);
                            break;
                        case s.wv.PETAL:
                            if (!this.petalCache.has(t.id)) {
                                const e = new g;
                                e.id = t.id,
                                e.index = t.index,
                                e.rarity = t.rarity,
                                e.isNew = !0,
                                this.petalCache.set(t.id, e)
                            }
                            this.petalCache.get(t.id).update(t);
                            break;
                        case s.wv.MOB:
                            if (t.lastSeen = performance.now(),
                            !this.mobCache.has(t.id)) {
                                const e = new p;
                                e.id = t.id,
                                e.index = t.index,
                                e.rarity = t.rarity,
                                e.isNew = !0,
                                this.mobCache.set(t.id, e)
                            }
                            this.mobCache.get(t.id).update(t)
                        }
                    }
                    )),
                    this.playerCache.forEach((i => {
                        if (!e.has(i.id))
                            return t.setUint32(i.id),
                            t.setUint8(s.w6.DIE),
                            void this.playerCache.delete(i.id);
                        i.pipe(t)
                    }
                    )),
                    t.setUint32(0),
                    this.petalCache.forEach((i => {
                        if (!e.has(i.id))
                            return t.setUint32(i.id),
                            t.setUint8(s.w6.DIE),
                            void this.petalCache.delete(i.id);
                        i.pipe(t)
                    }
                    )),
                    t.setUint32(0),
                    this.mobCache.forEach((i => {
                        if (!e.has(i.id))
                            return t.setUint32(i.id),
                            t.setUint8(s.w6.DIE),
                            void this.mobCache.delete(i.id);
                        i.pipe(t)
                    }
                    )),
                    t.setUint32(0),
                    this.dropsToAdd.forEach((e => {
                        t.setUint32(e.id),
                        t.setFloat32(e.x),
                        t.setFloat32(e.y),
                        t.setFloat32(e.size),
                        t.setUint8(e.index),
                        t.setUint8(e.rarity),
                        t.setUint16(e.duration)
                    }
                    )),
                    t.setUint32(0),
                    this.dropsToRemove.forEach((e => {
                        t.setUint32(e.id)
                    }
                    )),
                    t.setUint32(0),
                    this.dropsToAdd.length = 0,
                    this.dropsToRemove.length = 0,
                    a.A.pentagrams.forEach((e => {
                        if (!this.markerCache.has(e.id)) {
                            const i = new m;
                            i.id = e.id,
                            i.isNew = !0,
                            i.x = e.x,
                            i.y = e.y,
                            i.size = e.size,
                            i.creation = e.createdAt,
                            i.timer = e.timer,
                            this.markerCache.set(e.id, i),
                            i.pipe(t)
                        }
                    }
                    )),
                    this.markerCache.forEach((e => {
                        a.A.pentagrams.has(e.id) || (e.kill(t),
                        this.markerCache.delete(e.id))
                    }
                    )),
                    t.setUint32(0),
                    a.A.lightning.forEach((e => {
                        if (!this.lightningCache.has(e.id)) {
                            t.setUint32(e.id),
                            t.setUint16(e.points.length);
                            for (const i of e.points)
                                t.setFloat32(i.x),
                                t.setFloat32(i.y);
                            this.lightningCache.add(e.id)
                        }
                    }
                    )),
                    t.setUint32(0),
                    this.lightningCache.forEach((t => {
                        a.A.lightning.has(t) || this.lightningCache.delete(t)
                    }
                    ))
                }
            }
            class y {
                constructor(t) {
                    this.uuid = t.uuid,
                    this.username = t.username,
                    this.level = t.level,
                    this.xp = t.xp,
                    this.slots = t.slots,
                    this.secondarySlots = t.secondarySlots,
                    this.body = t.body,
                    this.team = t.team,
                    this.inventory = t.inventory,
                    f.disconnects.set(this.uuid, this),
                    this.body && (this.body.client = null),
                    this.timeout = setTimeout(( () => {
                        f.disconnects.delete(this.uuid),
                        this.body && !this.body.health.isDead && this.body.destroy()
                    }
                    ), 864e5)
                }
            }
            class f {
                static clients = new Map;
                static disconnects = new Map;
                constructor(t, e, i=0) {
                    this.id = t,
                    this.verified = !1,
                    this.username = "unknown",
                    this.uuid = e,
                    this.nameColor = ["#FFFFFF", "#D85555"][+i],
                    this.masterPermissions = +i,
                    this.inventory = {},
                    this.camera = new u,
                    this.body = null,
                    a.A.clients.set(t, this),
                    console.log(`Client ${t} connected`),
                    this.team = !1,
                    a.A.isTDM && (this.team = 0,
                    a.A.teamCount > 0 && (this.team = (this.id - 1) % a.A.teamCount + 1)),
                    this.slots = new Array(5).fill(null).map(( () => ({
                        id: 0,
                        rarity: 0
                    }))),
                    this.slotRatios = new Array(5).fill(0).map(( () => 0)),
                    this.secondarySlots = new Array(5).fill(null).map(( () => null)),
                    this.level = 1,
                    this.xp = 1,
                    this.lastChat = 0,
                    this.frownyMessages = 0
                }
                addXP(t) {
                    if (!Number.isFinite(t))
                        return;
                    for (this.xp += t; this.xp < (0,
                    r.UU)(this.level - 1); )
                        this.level--,
                        this.body && !this.body.health.isDead && (this.body.health.set(this.healthAdjustement + this.body.petalSlots.reduce(( (t, e) => t + e.config.tiers[e.rarity].extraHealth), 0)),
                        this.body.damage = this.bodyDamageAdjustment);
                    for (; this.xp >= (0,
                    r.UU)(this.level); )
                        this.level++,
                        this.body && !this.body.health.isDead && (this.body.health.set(this.healthAdjustement + this.body.petalSlots.reduce(( (t, e) => t + e.config.tiers[e.rarity].extraHealth), 0)),
                        this.body.damage = this.bodyDamageAdjustment);
                    let e = 5 + Math.min(5, Math.floor(this.level / 10));
                    if (e !== this.slots.length) {
                        if (e > this.slots.length)
                            for (let t = this.slots.length; t < e; t++)
                                this.slots.push({
                                    id: 0,
                                    rarity: 0
                                }),
                                this.secondarySlots.push(null);
                        else if (e < this.slots.length)
                            for (let t = this.slots.length - 1; t >= e; t--)
                                this.slots.pop(),
                                this.secondarySlots.pop();
                        this.body && !this.body.health.isDead && this.body.initSlots(e)
                    }
                    this.levelProgress = this.level < 2 ? this.xp / (0,
                    r.UU)(this.level) : (this.xp - (0,
                    r.UU)(this.level - 1)) / ((0,
                    r.UU)(this.level) - (0,
                    r.UU)(this.level - 1))
                }
                get healthAdjustement() {
                    return 40 + 5 * Math.pow(this.level, 1.5)
                }
                get bodyDamageAdjustment() {
                    return 5 + 1 * Math.pow(this.level, 1.5)
                }
                get highestRarity() {
                    let t = 0;
                    for (const e of this.slots)
                        e && e.rarity > t && (t = e.rarity);
                    for (const e of this.secondarySlots)
                        e && e.rarity > t && (t = e.rarity);
                    return t
                }
                pickupDrop(t) {
                    for (let e = 0; e < this.secondarySlots.length; e++)
                        if (!this.secondarySlots[e])
                            return this.secondarySlots[e] = {
                                id: t.index,
                                rarity: t.rarity
                            },
                            !0;
                    const e = h.cK[t.rarity].name;
                    return this.inventory[e][t.index] || (this.inventory[e][t.index] = 0),
                    this.inventory[e][t.index] += 1,
                    !0
                }
                onMessage(t) {
                    switch (t.getUint8()) {
                    case s.fh.PING:
                        this.talk(s.de.PONG);
                        break;
                    case s.fh.VERIFY:
                        if (this.verified)
                            return this.kick("Already verified");
                        this.username = t.getStringUTF8();
                        const e = this.username.toLowerCase();
                        if (this.username.length > 24 || d(e))
                            return this.kick("Invalid username");
                        this.verified = !0,
                        console.log(`Client ${this.id} verified as ${this.username}`),
                        this.talk(s.de.READY),
                        this.sendRoom(),
                        a.A.sendTerrain(this.id),
                        h.cK.forEach((t => this.inventory[t.name] = {})),
                        this.uuid === a.A.secretKey && this.masterPermissions < 1 && (this.nameColor = "#F5D230");
                        const i = f.disconnects.get(this.uuid);
                        i && (this.level = i.level,
                        this.xp = i.xp,
                        this.slots = i.slots,
                        this.secondarySlots = i.secondarySlots,
                        this.team = i.team,
                        this.inventory = i.inventory,
                        this.addXP(0),
                        i.body && (this.body = i.body,
                        this.body.client = this),
                        clearTimeout(i.timeout),
                        f.disconnects.delete(this.uuid),
                        console.log(`Client ${this.id} reconnected as ${this.username}`));
                        break;
                    case s.fh.SPAWN:
                        if (!this.verified)
                            return void this.kick("Not verified");
                        if (this.body && !this.body.health.isDead)
                            return;
                        this.body = new n.ai(a.A.getPlayerSpawn(this)),
                        this.body.name = this.username,
                        this.body.nameColor = this.nameColor,
                        this.body.client = this,
                        this.body.health.set(this.healthAdjustement),
                        this.body.damage = this.bodyDamageAdjustment,
                        this.addXP(0),
                        this.body.initSlots(this.slots.length);
                        for (let t = 0; t < this.slots.length; t++)
                            this.slots[t] && this.body.setSlot(t, this.slots[t].id, this.slots[t].rarity);
                        this.body.spawnInvincibility = !0,
                        setTimeout(( () => {
                            this.body && (this.body.spawnInvincibility = !1)
                        }
                        ), 2e3),
                        a.A.isTDM && (this.body.team = -this.team),
                        a.A.alivePlayers.push(this);
                        break;
                    case s.fh.INPUTS:
                        {
                            if (!this.verified)
                                return void this.kick("Not verified");
                            if (null === this.body)
                                return;
                            const e = t.getUint8();
                            if (64 & ~e && 128 & ~e) {
                                let t = -!(2 & ~e) + !(8 & ~e)
                                  , i = -!(1 & ~e) + !(4 & ~e);
                                0 === t && 0 === i ? this.body.moveStrength = 0 : (this.body.moveAngle = Math.atan2(i, t),
                                this.body.moveStrength = this.body.speed)
                            } else
                                this.body.moveAngle = t.getFloat32(),
                                this.body.moveStrength = Math.min(1, Math.max(0, t.getFloat32())) * this.body.speed;
                            this.body.attack = !(16 & ~e),
                            this.body.defend = !(32 & ~e)
                        }
                        break;
                    case s.fh.CHANGE_LOADOUT:
                        {
                            if (!this.verified)
                                return void this.kick("Not verified");
                            if (!this.body || this.body.health.isDead)
                                return;
                            const e = t.getUint8()
                              , i = t.getUint8()
                              , s = t.getUint8()
                              , a = t.getUint8();
                            switch (e) {
                            case 0:
                                if (i < 0 || i >= this.slots.length)
                                    return;
                                switch (s) {
                                case 0:
                                    if (a < 0 || a >= this.slots.length)
                                        return;
                                    const t = this.slots[i];
                                    this.slots[i] = this.slots[a],
                                    this.slots[a] = t,
                                    this.slots[i] && this.body.setSlot(i, this.slots[i].id, this.slots[i].rarity),
                                    this.body.setSlot(a, this.slots[a].id, this.slots[a].rarity);
                                    break;
                                case 1:
                                    if (a < 0 || a >= this.secondarySlots.length)
                                        return;
                                    const e = this.slots[i];
                                    this.slots[i] = this.secondarySlots[a],
                                    this.secondarySlots[a] = e,
                                    this.slots[i] && this.body.setSlot(i, this.slots[i].id, this.slots[i].rarity)
                                }
                                break;
                            case 1:
                                if (i < 0 || i >= this.secondarySlots.length || null === this.secondarySlots[i])
                                    return;
                                switch (s) {
                                case 0:
                                    if (a < 0 || a >= this.slots.length)
                                        return;
                                    const t = this.slots[a];
                                    this.slots[a] = this.secondarySlots[i],
                                    this.secondarySlots[i] = t,
                                    this.body.setSlot(a, this.slots[a].id, this.slots[a].rarity);
                                    break;
                                case 1:
                                    if (a < 0 || a >= this.secondarySlots.length || null === this.secondarySlots[a])
                                        return;
                                    const e = this.secondarySlots[i];
                                    this.secondarySlots[i] = this.secondarySlots[a],
                                    this.secondarySlots[a] = e
                                }
                            }
                        }
                        this.body && this.body.initSlots(this.slots.length);
                        break;
                    case s.fh.INVENTORY_CHANGE_LOADOUT:
                        {
                            if (!this.verified)
                                return void this.kick("Not verified");
                            if (!this.body || this.body.health.isDead)
                                return;
                            let e = t.getUint8()
                              , i = t.getUint8()
                              , s = t.getUint8()
                              , a = t.getUint8()
                              , n = t.getUint8()
                              , r = t.getUint8()
                              , o = h.cK[n]?.name;
                            switch (s) {
                            case 0:
                                if (!this.inventory[h.cK[i].name][e] || this.slots[a].id !== r || this.slots[a].rarity !== n)
                                    return;
                                this.inventory[o][r] || (this.inventory[o][r] = 0),
                                this.inventory[o][r] += 1,
                                this.slots[a].id = e,
                                this.slots[a].rarity = i,
                                this.body.setSlot(a, this.slots[a].id, this.slots[a].rarity),
                                this.inventory[h.cK[i].name][e]--;
                                break;
                            case 1:
                                if (!this.inventory[h.cK[i].name][e] || 255 !== r && this.secondarySlots[a]?.id !== r || this.secondarySlots[a]?.rarity !== n)
                                    return;
                                if (255 === r) {
                                    this.secondarySlots[a] = {
                                        id: e,
                                        rarity: i
                                    },
                                    this.inventory[h.cK[i].name][e]--;
                                    break
                                }
                                this.inventory[o][r] || (this.inventory[o][r] = 0),
                                this.inventory[o][r] += 1,
                                this.secondarySlots[a].id = e,
                                this.secondarySlots[a].rarity = i,
                                this.inventory[h.cK[i].name][e]--;
                                break;
                            case 2:
                                r = this.secondarySlots[a]?.id,
                                o = h.cK[this.secondarySlots[a]?.rarity]?.name,
                                this.inventory[o][r] || (this.inventory[o][r] = 0),
                                this.inventory[o][r] += 1,
                                this.secondarySlots[a] = null
                            }
                        }
                        break;
                    case s.fh.DEV_CHEAT:
                        if (!this.verified)
                            return void this.kick("Not verified");
                        if (this.masterPermissions < 1 || !this.body || this.body.health.isDead)
                            return;
                        switch (t.getUint8()) {
                        case s.F6.TELEPORT:
                            this.body.x += t.getFloat32(),
                            this.body.y += t.getFloat32();
                            break;
                        case s.F6.GODMODE:
                            this.body.health.invulnerable = !this.body.health.invulnerable;
                            break;
                        case s.F6.CHANGE_TEAM:
                            {
                                const e = a.A.entities.get(t.getUint32());
                                e && (this.body.team = e.team)
                            }
                            break;
                        case s.F6.SPAWN_MOB:
                            {
                                const e = t.getUint32()
                                  , i = t.getUint8()
                                  , r = t.getUint8();
                                if (i < 0 || i >= h.GJ.length)
                                    return this.talk(s.de.JSON_MESSAGE, {
                                        promiseID: e,
                                        ok: !1,
                                        message: "Index out of range"
                                    });
                                if (r < 0 || r >= h.cK.length)
                                    return this.talk(s.de.JSON_MESSAGE, {
                                        promiseID: e,
                                        ok: !1,
                                        message: "Rarity out of range"
                                    });
                                const o = new n.Bw(a.A.random());
                                o.define(h.ey[i], r),
                                this.talk(s.de.JSON_MESSAGE, {
                                    promiseID: e,
                                    ok: !0,
                                    mob: {
                                        id: o.id,
                                        index: i,
                                        rarity: r,
                                        position: {
                                            x: o.x,
                                            y: o.y
                                        }
                                    }
                                })
                            }
                            break;
                        case s.F6.SET_PETAL:
                            {
                                const e = t.getUint32()
                                  , i = t.getUint32()
                                  , n = t.getUint8()
                                  , r = t.getUint8()
                                  , o = t.getUint8()
                                  , l = a.A.clients.get(i);
                                if (!l)
                                    return this.talk(s.de.JSON_MESSAGE, {
                                        promiseID: e,
                                        ok: !1,
                                        message: "Client not found"
                                    });
                                if (n < 0 || n >= l.slots.length)
                                    return this.talk(s.de.JSON_MESSAGE, {
                                        promiseID: e,
                                        ok: !1,
                                        message: "Slot not found"
                                    });
                                if (r < 0 || r >= h.GJ.length)
                                    return this.talk(s.de.JSON_MESSAGE, {
                                        promiseID: e,
                                        ok: !1,
                                        message: "Index out of range"
                                    });
                                if (o < 0 || o >= h.cK.length)
                                    return this.talk(s.de.JSON_MESSAGE, {
                                        promiseID: e,
                                        ok: !1,
                                        message: "Rarity out of range"
                                    });
                                l.slots[n] = {
                                    id: r,
                                    rarity: o
                                },
                                l.body && l.body.setSlot(n, r, o),
                                this.talk(s.de.JSON_MESSAGE, {
                                    promiseID: e,
                                    ok: !0,
                                    message: "Petal set"
                                })
                            }
                            break;
                        case s.F6.SET_XP:
                            {
                                const e = t.getUint32()
                                  , i = t.getUint32()
                                  , n = t.getUint32()
                                  , h = a.A.clients.get(i);
                                if (!h)
                                    return this.talk(s.de.JSON_MESSAGE, {
                                        promiseID: e,
                                        ok: !1,
                                        message: "Client not found"
                                    });
                                h.addXP(n - h.xp),
                                this.talk(s.de.JSON_MESSAGE, {
                                    promiseID: e,
                                    ok: !0,
                                    message: "XP set"
                                })
                            }
                            break;
                        case s.F6.INFO_DUMP:
                            this.talk(s.de.JSON_MESSAGE, {
                                promiseID: t.getUint32(),
                                ok: !0,
                                entitiesSize: a.A.entities.size,
                                clients: Array.from(a.A.clients.values()).map((t => ({
                                    id: t.id,
                                    username: t.username,
                                    verified: t.verified,
                                    masterPermissions: t.masterPermissions,
                                    team: t.team,
                                    level: t.level,
                                    xp: t.xp
                                }))),
                                key: a.A.secretKey
                            })
                        }
                        break;
                    case s.fh.CHAT_MESSAGE:
                        {
                            if (!this.verified)
                                return void this.kick("Not verified");
                            const e = t.getStringUTF8();
                            if (!/^[\w\s,.!?'"@#%^&*()_\-+=:;<>\/\\|[\]{}~`\u00A0-\uFFFF]{1,128}$/.test(e))
                                return this.systemMessage("That message is too long or contains invalid characters.", "#CACA22"),
                                this.frownyMessages++,
                                void (this.frownyMessages >= 5 && this.kick("Abusing chat"));
                            if (e.length > 10) {
                                const t = new Set(e)
                                  , i = e.split("");
                                for (const s of t)
                                    if (i.filter((t => t === s)).length > e.length / 3)
                                        return this.systemMessage("Please refrain from spamming.", "#22CACA"),
                                        this.frownyMessages++,
                                        void (this.frownyMessages >= 5 && this.kick("Abusing chat"))
                            }
                            if (d(e))
                                return this.systemMessage("Please refrain from saying slurs.", "#CA2222"),
                                this.frownyMessages++,
                                void (this.frownyMessages >= 5 && this.kick("Abusing chat"));
                            if (performance.now() - this.lastChat < 500)
                                return void this.systemMessage("You're chatting too fast.", "#22CACA");
                            this.lastChat = performance.now(),
                            a.A.clients.forEach((t => t.chatMessage(this.username, e, this.nameColor)))
                        }
                    }
                }
                chatMessage(t, e, i) {
                    this.talk(s.de.CHAT_MESSAGE, {
                        type: 0,
                        username: t,
                        message: e,
                        color: i
                    })
                }
                systemMessage(t, e) {
                    this.talk(s.de.CHAT_MESSAGE, {
                        type: 1,
                        message: t,
                        color: e
                    })
                }
                talk(t, e) {
                    const i = new s.AU(!0);
                    switch (i.setUint8(s.jU.PIPE_PACKET),
                    i.setUint16(this.id),
                    i.setUint8(t),
                    t) {
                    case s.de.KICK:
                    case s.de.DEATH:
                        i.setStringUTF8(e);
                        break;
                    case s.de.ROOM_UPDATE:
                        i.setFloat32(e.width),
                        i.setFloat32(e.height),
                        i.setUint8(e.isRadial ? 1 : 0),
                        i.setUint8(e.biome);
                        break;
                    case s.de.JSON_MESSAGE:
                        i.setStringUTF8(JSON.stringify(e));
                        break;
                    case s.de.CHAT_MESSAGE:
                        i.setUint8(e.type),
                        0 === e.type && i.setStringUTF8(e.username),
                        i.setStringUTF8(e.message),
                        i.setStringUTF8(e.color)
                    }
                    a.A.router.postMessage(i.build())
                }
                onClose() {
                    this.verified ? (console.log(`Client ${this.id} (${this.username}) disconnected.`),
                    new y(this),
                    this.body?.destroy()) : console.log(`Client ${this.id} disconnected`),
                    a.A.alivePlayers = a.A.alivePlayers.filter((t => t.id !== this.id)),
                    a.A.clients.delete(this.id)
                }
                terminate() {
                    a.A.router.postMessage(new Uint8Array([s.jU.CLOSE_CLIENT, this.id]))
                }
                kick(t="Unknown Reason") {
                    this.talk(s.de.KICK, t),
                    this.body?.destroy(),
                    this.terminate()
                }
                worldUpdate() {
                    if (!this.verified)
                        return;
                    if (null !== this.body) {
                        this.camera.x = this.body.x,
                        this.camera.y = this.body.y,
                        this.camera.fov = 1256 + this.body.extraVision,
                        this.slotRatios = [];
                        for (let t = 0; t < this.body.petalSlots.length; t++)
                            this.slotRatios.push(this.body.petalSlots[t].displayRatio)
                    }
                    const t = new s.AU(!0);
                    t.setUint8(s.jU.PIPE_PACKET),
                    t.setUint16(this.id),
                    t.setUint8(s.de.WORLD_UPDATE),
                    t.setFloat32(this.camera.x),
                    t.setFloat32(this.camera.y),
                    t.setFloat32(this.camera.fov),
                    t.setUint8(this.camera.lightingBoost),
                    t.setUint32(this.body ? this.body.id : 0),
                    this.camera.see(t),
                    t.setUint8(this.slots.length);
                    for (let e = 0; e < this.slots.length; e++) {
                        const i = this.slots[e];
                        t.setUint8(i ? 1 : 0),
                        i && (t.setUint8(i.id),
                        t.setUint8(i.rarity),
                        t.setFloat32(this.slotRatios[e] ?? 0))
                    }
                    t.setUint8(this.secondarySlots.length);
                    for (let e = 0; e < this.secondarySlots.length; e++) {
                        const i = this.secondarySlots[e];
                        t.setUint8(i ? 1 : 0),
                        i && (t.setUint8(i.id),
                        t.setUint8(i.rarity))
                    }
                    if (a.A.isWaves) {
                        t.setUint8(1),
                        t.setUint16(a.A.currentWave),
                        t.setUint16(a.A.livingMobCount),
                        t.setUint16(a.A.maxMobs),
                        t.setUint16(a.A.aliveMobs.length);
                        for (const e of a.A.aliveMobs)
                            t.setUint8(e.index),
                            t.setUint8(e.rarity)
                    } else
                        t.setUint8(0);
                    t.setUint8(a.A.alivePlayers.length);
                    for (const e of a.A.alivePlayers)
                        t.setUint8(e.team),
                        t.setUint8(e.highestRarity),
                        t.setFloat32(e.xp / 1e4),
                        t.setStringUTF8(e.username);
                    t.setUint16(this.level),
                    t.setFloat32(this.levelProgress),
                    h.cK.forEach((e => {
                        const i = this.inventory[e.name]
                          , s = Object.keys(i);
                        t.setUint16(s.length),
                        s.forEach((e => {
                            t.setUint16(parseInt(e)),
                            t.setUint16(i[e])
                        }
                        ))
                    }
                    )),
                    a.A.router.postMessage(t.build())
                }
                sendRoom() {
                    this.talk(s.de.ROOM_UPDATE, a.A)
                }
                addDrop(t) {
                    this.camera.dropsToAdd.push(t)
                }
                removeDrop(t) {
                    this.camera.dropsToRemove.push(t)
                }
            }
            class A {
                constructor(t, e) {
                    this.width = t,
                    this.height = e,
                    this.grid = new Array(t * e).fill(0),
                    this.spacing = 4,
                    this.gridChance = 1,
                    this.toPlaceAmount = .4,
                    this.maxNeighbors = 4,
                    this.maxDiagonalNeighbors = 0,
                    this.removeSingles = !1,
                    this.removeBlocks = !1
                }
                get(t, e) {
                    return this.grid[e * this.width + t]
                }
                set(t, e, i) {
                    this.grid[e * this.width + t] = i
                }
                get toPlace() {
                    return this.width * this.height * this.toPlaceAmount
                }
                getOnes() {
                    return this.grid.reduce(( (t, e) => t + e), 0)
                }
                getNeighbors(t, e) {
                    const i = e > 0 ? this.get(t, e - 1) : 0
                      , s = e < this.height - 1 ? this.get(t, e + 1) : 0
                      , a = t < this.width - 1 ? this.get(t + 1, e) : 0
                      , n = t > 0 ? this.get(t - 1, e) : 0
                      , h = e > 0 && t < this.width - 1 ? this.get(t + 1, e - 1) : 0
                      , r = e > 0 && t > 0 ? this.get(t - 1, e - 1) : 0
                      , o = e < this.height - 1 && t < this.width - 1 ? this.get(t + 1, e + 1) : 0
                      , l = e < this.height - 1 && t > 0 ? this.get(t - 1, e + 1) : 0;
                    return {
                        cardinal: [i, s, a, n],
                        diagonal: [h, r, o, l],
                        north: i,
                        south: s,
                        east: a,
                        west: n,
                        northEast: h,
                        northWest: r,
                        southEast: o,
                        southWest: l
                    }
                }
                stepOne() {
                    for (let t = 1; t < this.width - 1; t += this.spacing)
                        for (let e = 1; e < this.height - 1; e += this.spacing)
                            Math.random() < this.gridChance && this.set(t, e, 1)
                }
                stepTwo() {
                    let t = 0;
                    for (; this.getOnes() < this.toPlace && t++ < 1048576; ) {
                        const t = Math.floor(Math.random() * this.width)
                          , e = Math.floor(Math.random() * this.height)
                          , i = this.getNeighbors(t, e)
                          , s = i.cardinal.filter((t => !!t)).length
                          , a = i.diagonal.filter((t => !!t)).length;
                        0 === this.get(t, e) && (0 === s || s > 0) && s <= this.maxNeighbors && a <= this.maxDiagonalNeighbors && this.set(t, e, 1)
                    }
                }
                stepThree() {
                    for (let t = 0; t < this.width; t++)
                        this.set(t, 0, 0),
                        this.set(t, this.height - 1, 0);
                    for (let t = 0; t < this.height; t++)
                        this.set(0, t, 0),
                        this.set(this.width - 1, t, 0);
                    const t = [];
                    (function e(i, s) {
                        if (t.some(( ({x: t, y: e}) => t === i && e === s)))
                            return;
                        t.push({
                            x: i,
                            y: s
                        });
                        const a = this.getNeighbors(i, s);
                        i > 0 && 0 === a.west && e.call(this, i - 1, s),
                        i < this.width - 1 && 0 === a.east && e.call(this, i + 1, s),
                        s > 0 && 0 === a.north && e.call(this, i, s - 1),
                        s < this.height - 1 && 0 === a.south && e.call(this, i, s + 1)
                    }
                    ).call(this, 0, 0);
                    const e = [];
                    for (let i = 1; i < this.width - 1; i++)
                        for (let s = 1; s < this.height - 1; s++)
                            0 !== this.get(i, s) || t.some(( ({x: t, y: e}) => t === i && e === s)) || e.push({
                                x: i,
                                y: s
                            });
                    for (const {x: t, y: i} of e)
                        this.set(t, i, 1)
                }
                stepFour() {
                    for (let t = 1; t < this.width - 1; t++)
                        for (let e = 1; e < this.height - 1; e++)
                            if (1 === this.get(t, e)) {
                                0 === this.getNeighbors(t, e).cardinal.filter((t => !!t)).length && this.set(t, e, 0)
                            }
                }
                stepFive() {
                    let t;
                    for (; (t = this.findATwoByTwo()) && null !== t && t.width >= 2 && t.height >= 2; )
                        for (let e = t.x; e < t.x + t.width; e++)
                            for (let i = t.y; i < t.y + t.height; i++)
                                this.set(e, i, 0)
                }
                findATwoByTwo() {
                    let t = {
                        x: 0,
                        y: 0,
                        width: 0,
                        height: 0
                    };
                    for (let e = 0; e < this.width - 1; e++)
                        for (let i = 0; i < this.height - 1; i++)
                            if (1 === this.get(e, i) && 1 === this.get(e + 1, i) && 1 === this.get(e, i + 1) && 1 === this.get(e + 1, i + 1))
                                return t.x = e,
                                t.y = i,
                                t.width = 2,
                                t.height = 2,
                                t;
                    return t
                }
                reset() {
                    for (let t = 0; t < this.width; t++)
                        for (let e = 0; e < this.height; e++)
                            this.set(t, e, 0)
                }
                generate() {
                    this.stepOne();
                    let t = 0;
                    for (; this.getOnes() < this.toPlace && t++ < 8; )
                        this.stepTwo(),
                        this.stepThree(),
                        this.removeSingles && this.stepFour(),
                        this.removeBlocks && this.stepFive();
                    this.removeSingles && this.stepFour()
                }
                getBlocks() {
                    const t = []
                      , e = this.to2DArray();
                    function i() {
                        let t = {
                            x: 0,
                            y: 0,
                            width: 0,
                            height: 0
                        };
                        function i(t, i) {
                            let s = 0
                              , n = 0
                              , h = 0;
                            for (let r = 1; t + r <= e.length; r++) {
                                let o = 0;
                                for (; i + o < e[t].length && a(t, i, r, o + 1); )
                                    o++;
                                if (r * o > s && (s = r * o,
                                n = r,
                                h = o),
                                0 === o)
                                    break
                            }
                            return {
                                width: n,
                                height: h
                            }
                        }
                        function s(t, i) {
                            let s = 0
                              , n = 0
                              , h = 0;
                            for (let r = 1; i + r <= e[t].length; r++) {
                                let o = 0;
                                for (; t + o < e.length && a(t, i, o + 1, r); )
                                    o++;
                                if (o * r > s && (s = o * r,
                                n = o,
                                h = r),
                                0 === o)
                                    break
                            }
                            return {
                                width: n,
                                height: h
                            }
                        }
                        function a(t, i, s, a) {
                            for (let n = t; n < t + s; n++)
                                for (let t = i; t < i + a; t++)
                                    if (1 !== e[n][t])
                                        return !1;
                            return !0
                        }
                        for (let a = 0; a < e.length; a++)
                            for (let n = 0; n < e[a].length; n++)
                                if (1 === e[a][n]) {
                                    let e = 0
                                      , h = 0
                                      , r = 0;
                                    const o = i(a, n)
                                      , l = s(a, n);
                                    o.width * o.height > e && (e = o.width * o.height,
                                    h = o.width,
                                    r = o.height),
                                    l.width * l.height > e && (e = l.width * l.height,
                                    h = l.width,
                                    r = l.height),
                                    e > t.width * t.height && (t = {
                                        x: a,
                                        y: n,
                                        width: h,
                                        height: r
                                    })
                                }
                        return t
                    }
                    for (; e.reduce(( (t, e) => t + e.reduce(( (t, e) => t + e), 0)), 0) > 0; ) {
                        const s = i();
                        if (s.width * s.height > 0) {
                            t.push({
                                x: s.x,
                                y: s.y,
                                width: s.width,
                                height: s.height
                            });
                            for (let t = s.x; t < s.x + s.width; t++)
                                for (let i = s.y; i < s.y + s.height; i++)
                                    e[t][i] = 0
                        }
                    }
                    return t
                }
                to2DArray() {
                    const t = [];
                    for (let e = 0; e < this.width; e++) {
                        t.push([]);
                        for (let i = 0; i < this.height; i++) {
                            let s = this.get(e, i);
                            1 == s && (s = {
                                type: -1
                            }),
                            2 == s && (s = {
                                type: 1,
                                rarity: 0
                            }),
                            s >= 3 && (s = {
                                type: 2,
                                rarity: s - 3
                            }),
                            t[e].push(s)
                        }
                    }
                    return t
                }
            }
            class w {
                constructor(t) {
                    this.maze = t,
                    this.grid = []
                }
                reset() {
                    for (let t = 0; t < this.maze.height; t++) {
                        this.grid[t] = [];
                        for (let e = 0; e < this.maze.width; e++)
                            this.grid[t][e] = this.maze.get(e, t)
                    }
                }
                heuristicCostEstimate(t, e, i, s) {
                    return Math.abs(t - i) + Math.abs(e - s)
                }
                findPath(t, e, i, s) {
                    this.reset();
                    const a = []
                      , n = []
                      , h = {
                        x: t,
                        y: e,
                        g: 0,
                        h: this.heuristicCostEstimate(t, e, i, s),
                        parent: null
                    };
                    for (a.push(h); a.length > 0; ) {
                        let t = a[0];
                        for (let e = 1; e < a.length; e++)
                            a[e].g + a[e].h < t.g + t.h && (t = a[e]);
                        if (t.x === i && t.y === s) {
                            let e = [];
                            for (; t.parent; )
                                e.push([t.x, t.y]),
                                t = t.parent;
                            return e.reverse()
                        }
                        a.splice(a.indexOf(t), 1),
                        n.push(t);
                        const e = this.getNeighbors(t);
                        for (const h of e) {
                            if (n.find((t => t.x === h.x && t.y === h.y)))
                                continue;
                            const e = t.g + 1;
                            let r = !1;
                            a.find((t => t.x === h.x && t.y === h.y)) ? e < h.g && (r = !0) : (a.push(h),
                            r = !0),
                            r && (h.parent = t,
                            h.g = e,
                            h.h = this.heuristicCostEstimate(h.x, h.y, i, s))
                        }
                    }
                    return []
                }
                getNeighbors(t) {
                    const e = []
                      , {x: i, y: s} = t;
                    return i > 0 && 1 !== this.grid[s][i - 1] && e.push({
                        x: i - 1,
                        y: s,
                        g: 0,
                        h: 0,
                        parent: null
                    }),
                    i < this.maze.width - 1 && 1 !== this.grid[s][i + 1] && e.push({
                        x: i + 1,
                        y: s,
                        g: 0,
                        h: 0,
                        parent: null
                    }),
                    s > 0 && 1 !== this.grid[s - 1][i] && e.push({
                        x: i,
                        y: s - 1,
                        g: 0,
                        h: 0,
                        parent: null
                    }),
                    s < this.maze.height - 1 && 1 !== this.grid[s + 1][i] && e.push({
                        x: i,
                        y: s + 1,
                        g: 0,
                        h: 0,
                        parent: null
                    }),
                    e
                }
            }
            const b = "/server/maps/antHell.json"
              , M = "/server/maps/desert.json"
              , v = "/server/maps/ocean.json"
              , x = "/server/maps/hell.json"
              , S = "/server/maps/sewers.json"
              , E = "/server/maps/darkForest.json"
              , D = "/server/maps/sleepyMaze.json"
              , R = "/server/maps/sleepyMazeOmega.json";
            let T = "/server/maps/standard.json"
              , P = [];
            async function k(t) {
                if (r.Iv && t === s.VC.HALLOWEEN || Math.random() > 1)
                    P = function(t, e, i=!1) {
                        const s = new A(t,e);
                        if (s.spacing = 4,
                        s.gridChance = 1,
                        s.toPlaceAmount = .425,
                        s.maxNeighbors = 4,
                        s.maxDiagonalNeighbors = 2,
                        s.removeSingles = !0,
                        s.removeBlocks = !1,
                        s.generate(),
                        i) {
                            for (let i = 0; i < t; i++)
                                s.set(i, 0, 1),
                                s.set(i, e - 1, 1);
                            for (let i = 0; i < e; i++)
                                s.set(0, i, 1),
                                s.set(t - 1, i, 1)
                        }
                        let a = 0
                          , n = 0;
                        do {
                            a = Math.floor(Math.random() * t),
                            n = Math.floor(Math.random() * e)
                        } while (0 !== s.get(a, n));
                        s.set(a, n, 2);
                        const h = new w(s);
                        let r = 0;
                        for (let t = 0; t < s.width; t++)
                            for (let e = 0; e < s.height; e++)
                                if (0 === s.get(t, e)) {
                                    const i = h.findPath(a, n, t, e);
                                    s.set(t, e, i.length + 10),
                                    r = Math.max(r, i.length)
                                }
                        for (let t = 0; t < s.width; t++)
                            for (let e = 0; e < s.height; e++)
                                s.get(t, e) > 10 && s.set(t, e, Math.floor((s.get(t, e) - 10) / r * 9) + 3);
                        return s.to2DArray()
                    }(56, 56, !1);
                else {
                    switch (t) {
                    case s.VC.DEFAULT:
                        T = R;
                        break;
                    case s.VC.GARDEN:
                        T = D;
                        break;
                    case s.VC.DESERT:
                        T = M;
                        break;
                    case s.VC.OCEAN:
                        T = v;
                        break;
                    case s.VC.ANT_HELL:
                        T = b;
                        break;
                    case s.VC.HELL:
                        T = x;
                        break;
                    case s.VC.SEWERS:
                        T = S;
                        break;
                    case s.VC.DARK_FOREST:
                        T = E;
                        break;
                    default:
                        throw new Error("Invalid biome type")
                    }
                    if ("string" == typeof T) {
                        const t = await fetch(T);
                        P = await t.json()
                    } else
                        P = T
                }
                const e = {
                    width: P.width,
                    height: P.height,
                    mobSpawners: P.mobSpawners,
                    maxRarity: P.maxRarity,
                    cells: P.cells,
                    get: (t, e) => P.cells.filter((i => {
                        if (i.x == t && i.y == e)
                            return !0
                    }
                    ))[0]
                };
                a.A.terrainGridWidth = e.width,
                a.A.terrainGridHeight = e.height;
                const i = a.A.width / a.A.terrainGridWidth / 2
                  , h = {
                    [s.wv.PLAYER]: [],
                    [s.wv.MOB]: []
                };
                for (let t = 0; t < e.width; t++)
                    for (let r = 0; r < e.height; r++)
                        if (0 === e.get(t, r).type) {
                            let h = r <= 0 || 0 === e.get(t, r - 1).type
                              , o = t >= e.width - 1 || 0 === e.get(t + 1, r).type
                              , l = r >= e.height - 1 || 0 === e.get(t, r + 1).type
                              , d = t <= 0 || 0 === e.get(t - 1, r).type
                              , c = 0;
                            h || (c |= s.E4.TOP),
                            o || (c |= s.E4.RIGHT),
                            l || (c |= s.E4.BOTTOM),
                            d || (c |= s.E4.LEFT);
                            const g = new n.M_({
                                x: (t - a.A.terrainGridWidth / 2 + .5) * i * 2,
                                y: (r - a.A.terrainGridWidth / 2 + .5) * i * 2
                            },i,c);
                            g.gridX = t,
                            g.gridY = r
                        } else {
                            const i = {
                                x: t / a.A.terrainGridWidth - .5,
                                y: r / a.A.terrainGridHeight - .5,
                                rarity: Math.round(e.get(t, r).score * e.maxRarity)
                            };
                            h[s.wv[1 === e.get(t, r).type || 2 === e.get(t, r).type ? "PLAYER" : "MOB"]].push(i),
                            a.A.maxMapDistFromSpawn = Math.max(a.A.maxMapDistFromSpawn, i.dist)
                        }
                a.A.mapSpawns = h,
                a.A.mapData = P,
                a.A.updateTerrain()
            }
            function I(t) {
                const e = [];
                for (const i in t)
                    for (let s = 0; s < t[i]; s++)
                        e.push(+i);
                return e
            }
            function C(t) {
                const e = {};
                for (const i of t)
                    e[i] = (e[i] || 0) + 1;
                const i = [];
                for (const s in e)
                    i.push({
                        id: s,
                        chance: e[s] / t.length
                    });
                return i.sort(( (t, e) => e.chance - t.chance)),
                i.map((t => h.ey[t.id].name + ": " + (100 * t.chance).toFixed(2) + "%")).join(", ")
            }
            globalThis.environmentName ??= "browser";
            class B {
                static encoder = new TextEncoder;
                static decoder = new TextDecoder;
                static isSandbox = "node" !== globalThis.environmentName && "bun" !== globalThis.environmentName && "localhost" !== location.hostname;
                static u16ToU8 = t => [255 & t, t >> 8];
                static u8ToU16 = (t, e=0) => t[e] | t[e + 1] << 8;
                static getText = (t, e, i) => B.decoder.decode(t.slice(e, e + i));
                static setText = t => B.encoder.encode(t);
                addClient(t, e, i) {
                    let s = !1;
                    if (!i)
                        for (const t of a.A.clients.values())
                            if (t.uuid === e) {
                                s = "DAR-7";
                                break
                            }
                    const n = new f(t,e,i);
                    return a.A.clients.size > 35 ? (n.kick("Lobby is full, create another one"),
                    null) : !1 !== s ? (n.kick(s),
                    null) : n
                }
                pipeMessage(t, e) {
                    const i = a.A.clients.get(t);
                    i && i.onMessage(new s.mP(e,0,!0))
                }
                removeClient(t) {
                    const e = a.A.clients.get(t);
                    e && e.onClose()
                }
                async begin(t) {
                    switch (await (0,
                    s.dX)(),
                    function(t) {
                        if (null == s.hg[t])
                            throw new Error("Invalid biome");
                        a.A.biome = t;
                        const e = {
                            [s.VC.GARDEN]: I({
                                [(0,
                                h.hs)("Ladybug")]: 5,
                                [(0,
                                h.hs)("Bee")]: 5,
                                [(0,
                                h.hs)("Bumblebee")]: 2,
                                [(0,
                                h.hs)("Rock")]: 4,
                                [(0,
                                h.hs)("Hornet")]: 6,
                                [(0,
                                h.hs)("Baby Ant")]: 3,
                                [(0,
                                h.hs)("Ant Egg")]: 1,
                                [(0,
                                h.hs)("Worker Ant")]: 4,
                                [(0,
                                h.hs)("Soldier Ant")]: 5,
                                [(0,
                                h.hs)("Spider")]: 4,
                                [(0,
                                h.hs)("Leafbug")]: 3,
                                [(0,
                                h.hs)("Centipede")]: 2,
                                [(0,
                                h.hs)("Ant Hole")]: 1,
                                [(0,
                                h.hs)("Dandelion")]: 2
                            }),
                            [s.VC.DESERT]: I({
                                [(0,
                                h.hs)("Shiny Ladybug")]: 1,
                                [(0,
                                h.hs)("Sandstorm")]: 3,
                                [(0,
                                h.hs)("Scorpion")]: 6,
                                [(0,
                                h.hs)("Beetle")]: 6,
                                [(0,
                                h.hs)("Fire Ant Egg")]: 1,
                                [(0,
                                h.hs)("Baby Fire Ant")]: 2,
                                [(0,
                                h.hs)("Worker Fire Ant")]: 3,
                                [(0,
                                h.hs)("Soldier Fire Ant")]: 4,
                                [(0,
                                h.hs)("Pupa")]: 3,
                                [(0,
                                h.hs)("Moth")]: 3,
                                [(0,
                                h.hs)("Desert Centipede")]: 3,
                                [(0,
                                h.hs)("Fire Ant Hole")]: 1,
                                [(0,
                                h.hs)("Cactus")]: 4
                            }),
                            [s.VC.OCEAN]: I({
                                [(0,
                                h.hs)("Jellyfish")]: 5,
                                [(0,
                                h.hs)("Sponge")]: 5,
                                [(0,
                                h.hs)("Bubble")]: 4,
                                [(0,
                                h.hs)("Shell")]: 4,
                                [(0,
                                h.hs)("Starfish")]: 3,
                                [(0,
                                h.hs)("Leech")]: 3,
                                [(0,
                                h.hs)("Crab")]: 2.5
                            }),
                            [s.VC.SEWERS]: I({
                                [(0,
                                h.hs)("Fly")]: 5,
                                [(0,
                                h.hs)("Moth")]: 4,
                                [(0,
                                h.hs)("Firefly")]: 4,
                                [(0,
                                h.hs)("Maggot")]: 3,
                                [(0,
                                h.hs)("Roach")]: 3,
                                [(0,
                                h.hs)("Spider")]: 3,
                                [(0,
                                h.hs)("Rock")]: 2,
                                [(0,
                                h.hs)("Evil Ladybug")]: 2,
                                [(0,
                                h.hs)("Evil Centipede")]: 1
                            }),
                            [s.VC.ANT_HELL]: I({
                                [(0,
                                h.hs)("Baby Ant")]: 5,
                                [(0,
                                h.hs)("Worker Ant")]: 5,
                                [(0,
                                h.hs)("Soldier Ant")]: 5,
                                [(0,
                                h.hs)("Queen Ant")]: 1,
                                [(0,
                                h.hs)("Ant Egg")]: 2,
                                [(0,
                                h.hs)("Baby Fire Ant")]: 5,
                                [(0,
                                h.hs)("Worker Fire Ant")]: 5,
                                [(0,
                                h.hs)("Soldier Fire Ant")]: 5,
                                [(0,
                                h.hs)("Queen Fire Ant")]: 1,
                                [(0,
                                h.hs)("Fire Ant Egg")]: 2,
                                [(0,
                                h.hs)("Baby Termite")]: 5,
                                [(0,
                                h.hs)("Worker Termite")]: 5,
                                [(0,
                                h.hs)("Soldier Termite")]: 5,
                                [(0,
                                h.hs)("Termite Overmind")]: 1,
                                [(0,
                                h.hs)("Termite Egg")]: 2
                            }),
                            [s.VC.HELL]: I({
                                [(0,
                                h.hs)("Hell Beetle")]: 25,
                                [(0,
                                h.hs)("Hell Spider")]: 25,
                                [(0,
                                h.hs)("Hell Yellowjacket")]: 20,
                                [(0,
                                h.hs)("Hell Centipede")]: 5,
                                [(0,
                                h.hs)("Demon")]: 2,
                                [(0,
                                h.hs)("Angelic Ladybug")]: 1
                            }),
                            [s.VC.HALLOWEEN]: I({
                                [(0,
                                h.hs)("Hell Beetle")]: 5,
                                [(0,
                                h.hs)("Hell Spider")]: 5,
                                [(0,
                                h.hs)("Hell Yellowjacket")]: 5,
                                [(0,
                                h.hs)("Hell Centipede")]: 5,
                                [(0,
                                h.hs)("Spider")]: 5,
                                [(0,
                                h.hs)("Pumpkin")]: 5,
                                [(0,
                                h.hs)("Jack O' Lantern")]: 5,
                                [(0,
                                h.hs)("Spirit")]: 4,
                                [(0,
                                h.hs)("Wilt")]: 3,
                                [(0,
                                h.hs)("Demon")]: 2,
                                [(0,
                                h.hs)("Termite Mound")]: 1
                            }),
                            [s.VC.DARK_FOREST]: I({
                                [(0,
                                h.hs)("Evil Centipede")]: 2,
                                [(0,
                                h.hs)("Evil Ladybug")]: 12.5,
                                [(0,
                                h.hs)("Termite Mound")]: 2,
                                [(0,
                                h.hs)("Soldier Termite")]: 16,
                                [(0,
                                h.hs)("Worker Termite")]: 8,
                                [(0,
                                h.hs)("Baby Termite")]: 8,
                                [(0,
                                h.hs)("Termite Egg")]: 1,
                                [(0,
                                h.hs)("Termite Overmind")]: 1,
                                [(0,
                                h.hs)("Wasp")]: 32.5,
                                [(0,
                                h.hs)("Spider")]: 25,
                                [(0,
                                h.hs)("Fly")]: 12.5,
                                [(0,
                                h.hs)("Stickbug")]: 8,
                                [(0,
                                h.hs)("Shrub")]: 15
                            })
                        }[t];
                        if (e) {
                            if (e.some((t => t < 0)))
                                throw new Error("Invalid mob table for " + s.hg[t].name);
                            a.A.mobTable = e
                        }
                    }(t[4]),
                    B.isSandbox && "maze" === t[1] && (t[1] = "ffa",
                    console.warn("Maze is not supported in sandbox")),
                    t[1]) {
                    case "maze":
                        a.A.isTDM = !0,
                        a.A.width = a.A.height = 12288,
                        a.A.gamemode = s.LX.MAZE,
                        a.A.mobsExpire = !0,
                        a.A.teamCount = 0,
                        a.A.announceRarity = 8,
                        await k(a.A.biome);
                        break;
                    case "ffa":
                        a.A.isTDM = !1,
                        a.A.gamemode = s.LX.FFA;
                        break;
                    case "tdm":
                        a.A.isTDM = !0,
                        a.A.gamemode = s.LX.TDM;
                        break;
                    case "waves":
                        a.A.isTDM = !0,
                        a.A.teamCount = 0,
                        a.A.isWaves = !0,
                        a.A.isRadial = !0,
                        a.A.gamemode = s.LX.WAVES;
                        break;
                    case "line":
                        a.A.isTDM = !0,
                        a.A.teamCount = 0,
                        a.A.isLineMap = !0,
                        a.A.gamemode = s.LX.LINE,
                        a.A.mobsExpire = !0;
                        break;
                    default:
                        throw new Error("Invalid gamemode")
                    }
                    a.A.secretKey = t[3],
                    console.log(["Lobby Created:", "  - Gamemode: " + t[1], "  - Biome: " + s.hg[t[4]].name, "  - Modded: " + (t[2] ? "Yes" : "No"), "  - Admin UUID: " + a.A.secretKey, "  - Spawn Table: " + (a.A.mobTable ? C(a.A.mobTable) : "None")].join("\n"))
                }
                postMessage(t) {}
            }
        }
        ,
        446: (t, e, i) => {
            i.d(e, {
                GJ: () => n,
                cK: () => a,
                ey: () => r,
                hf: () => c,
                hs: () => o,
                lm: () => s.lm,
                vx: () => d,
                zw: () => h
            });
            var s = i(110);
            const a = structuredClone(s.cK)
              , n = [new s.lm("Basic",22.5,10,10).setDescription("A simple petal. Not too strong, not too weak."), new s.lm("Light",5.625,6.5,17).setMulti([1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 7, 7], 0, !0).setSize(.75).setDescription("It's very light and recharges quickly, at the cost of damage."), new s.lm("Faster",14.625,12,7).setSize(.75).setExtraRadians(.03).setDescription("This one makes your petals spin faster."), new s.lm("Heavy",45,100,2.5).setSize(1.25).setDensity(3).setDescription("A more chunky petal that hits harder but takes longer to recharge."), new s.lm("Stinger",101.25,1,75).setMulti([1, 1, 2, 2, 3, 3, 4, 4, 5, 5], 1, !0).setDescription("A fragile petal that deals lots of damage."), new s.lm("Rice",0,.5,5).setSize(1.25).setDescription("A bit weak, but recharges instantly."), new s.lm("Rock",45,50,5.5).setSize(1.3).setDescription("It's a rock, not much to say about it."), new s.lm("Cactus",45,18,6).setSize(1.25).setExtraHealth(35).setHuddles(1).setDescription("A petal that gives you extra health. Pretty magical if you ask me."), new s.lm("Leaf",22.5,8,6).setSize(1.2).setConstantHeal(5.5).setDescription("A petal that heals you over time by the power of photosynthesis."), new s.lm("Wing",28.125,10,10).setSize(1.3).setWingMovement(!0).setDescription("It comes and it goes."), new s.lm("Bone",33.75,10,6).setSize(1.6).setArmor(6).setDescription("A petal that reduces incoming damage."), new s.lm("Dirt",33.75,8,8).setSize(1.3).setExtraHealth(55).setSpeedMultiplier(.925).setExtraSize(2.5).setHuddles(1).setDescription("The extra soil gives your flower more mass, but it does slow you down a bit..."), new s.lm("Magnolia",33.75,8,8).setConstantHeal(3).setExtraHealth(20).setSize(1.5).setDescription("A purely magical petal that heals you over time while simultaneously making you tougher."), new s.lm("Corn",112.5,425,2).setSize(1.6).setDescription("It's a piece of corn. They say ants like to snack on it."), new s.lm("Sand",10.125,5,8).setSize(.85).setMulti(4, !0).setDescription("Some fine grains of sand. They recharge quickly and can pack a punch."), new s.lm("Orange",16.875,12.5,7.5).setMulti(3, !0).setDescription("A bunch of oranges. They're pretty juicy."), new s.lm("Missile",22.5,4,18.5).setLaunchable(.7, 45).setSize(1.35).setDescription("You can actually shoot this one!"), new s.lm("Pea.projectile",2250,3,3).setDescription("[object null object]"), new s.lm("Rose",33.75,5,5).setHealing(12.5).setHuddles(1).setDescription("Not great at combat, but it's healing properties are amazing."), new s.lm("Yin Yang",22.5,9,11).setYinYang(1).setDescription("The mysterious petal of balance."), new s.lm("Pollen",16.875,13,13).setSize(.6).setLaunchable(0, 75).setMulti([1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 5], !1, !0).setDescription("It makes you sneeze. Don't drop it!"), new s.lm("Honey",11.25,7.5,7.5).setSize(1.1).setEnemySpeedMultiplier(.45, 5).setDescription("It's sticky and will slow your enemies down."), new s.lm("Iris",22.5,10,5).setSize(.8).setPoison(12.5, 5).setDescription("Packs an unexpected punch in its secret weapon: poison."), new s.lm("Web",45,7,7).setDescription("Sticky!"), new s.lm("Web.projectile",2250,1e5,0).setSize(30).setEnemySpeedMultiplier(.334, .05).setIgnoreWalls(1).setDescription("[object null object]"), new s.lm("Third Eye",0,0,0).setExtraRange(.5).setMulti(0, !1).setWearable(s.DQ.THIRD_EYE).setDescription("Through the eye of the beholder comes extra range."), new s.lm("Pincer",22.5,7.5,7.5).setSize(1.2).setPoison(2, 5).setEnemySpeedMultiplier(.6, 5).setDescription("Poisonous, and it slows down your enemies. A perfect double whammy."), new s.lm("Beetle Egg",45,25,1).setSize(1.5).setHuddles(1).setDescription("Something might pop out of this!"), new s.lm("Antennae",0,0,0).setExtraVision(150).setMulti(0, !1).setWearable(s.DQ.ANTENNAE).setDescription("These feelers give you some extra vision."), new s.lm("Peas",33.75,20,17.5).setSize(1.15).setDescription("A pod of peas. They'll explode if you're not careful."), new s.lm("Stick",22.5,25,1).setSize(1.25).setHuddles(1).setMulti(2, !1).setDescription("A bundle of sticks... I wonder what'll happen if you spin them around in the desert..."), new s.lm("Scorpion Missile.projectile",2250,5,2.5).setPoison(2.5, 5).setDescription("[object null object]"), new s.lm("Dahlia",16.875,5,5).setHealing(3).setSize(.5).setHuddles(1).setMulti(3, !0).setDescription("A very consistent trickle heal."), new s.lm("Primrose",22.5,12.5,7.5).setSize(1.3).setHuddles(1).setHealSpit(67.5, 125, 10).setDescription("Said to be from a mystical covenant of witches who specialized in healing nature."), new s.lm("Fire Spellbook",28.125,15,5).setSize(1.2).setPentagramAbility(90, 150, 10, {
                damage: 5,
                duration: 5
            }, {
                multiplier: .5,
                duration: 5
            }).setHuddles(1).setDescription("A tome of ancient spells. It's said to be able to focus the power of a fallen Demon."), new s.lm("Deity",0,50,50).setSize(1.15).setMulti(3, !0).setHealSpit(10, 1e3, 5).setConstantHeal(1e3).setExtraHealth(1e4).setEnemySpeedMultiplier(.1, 10).setDamageReduction(.2).setExtraRadians(.01).setExtraRange(1.05).setExtraVision(5).setPoison(5, 10).setSpeedMultiplier(1.05).setWingMovement(1).setLightning([5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10], 512, 128).setDescription("A petal that channels the power of all that came before."), new s.lm("Lightning",22.5,1e-15,5).setLightning([3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 9], 256, 7).setDescription("Shockingly shocking!"), new s.lm("Powder",16.875,3,5).setSize(1.65).setSpeedMultiplier(1.03).setHuddles(1).setDescription("This special cocaine will make you go fast!"), new s.lm("Ant Egg",56.25,25,1).setSize(1.1).setMulti(4, !1).setHuddles(1).setDescription("A petal that spawns ants. They'll help you out!"), new s.lm("Yucca",33.75,8,6).setSize(1.2).setConstantHeal(7.5, !0).setDescription("A strange leaf that heals you but only when you're in defensive mode."), new s.lm("Magnet",45,9,6).setSize(1.55).setExtraPickupRange(125).setAttractsLightning(1).setHuddles(1).setDescription("This petal's magnetic field will attract nearby items. Does not stack."), new s.lm("Amulet",0,0,0).setMulti(0, !1).setWearable(s.DQ.AMULET).setDamageReflection(.175, .275).setDescription("What an oddity! It's said to reflect a portion of incoming conventional damage. Does not stack."), new s.lm("Jelly",23,9,7).setDensity(20).setDescription("Super bouncy! Knocks all your enemies around. Very fun to use and cause problems with."), new s.lm("Yggdrasil",1012.5,1 / 0,0).setDeathDefying(.15, 2.5).setHuddles(1).setPhases(1).setDescription("The tree of life. If you were to die with this petal alive, you'd be revived with a portion of your health."), new s.lm("Glass",45,1e-15,2.5).setPhases(1).setDescription("A shard of glass that phases through enemies."), new s.lm("Dandelion",22.5,10,8).setMulti(2, !1).setSize(1.4).setLaunchable(.575, 35).setEnemySpeedMultiplier(.65, 6).setDescription("A paralyzing force."), new s.lm("Sponge",33.75,24,0).setSize(4 / 3).setHuddles(1).setAbsorbsDamage(35, [67.5, 67.5, 67.5, 90, 90, 90, 112.5, 112.5, 112.5, 135, 157.5, 180]).setDescription("It absorbs conventional damage done to your flower. If incoming damage is too great, you will suffer all of the damage the sponge has contained at once."), new s.lm("Pearl",45,23,6.5).setSize(2).setPlaceDown(1).setDescription("A pearl that can be placed on the ground. You can call it back to you at any time."), new s.lm("Shell",33.75,13,6).setSize(1.5).setShield(12.5).setHuddles(1).setDescription("A shell that provides extra protection through a shield."), new s.lm("Bubble",11.25,1e-15,1e-15).setSize(1.3).setBoost([5, 7, 11, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((t => 2 * t | 0)), [1, .9, .8, .7, .6, .5, .5, .4, .3, .2, .1, .1].map((t => 22.5 * t | 0))).setDescription("It will boost you when you pop it."), new s.lm("Air",0,0,0).setMulti(0, !1).setWearable(s.DQ.AIR).setExtraSize(3).setDescription("Literally nothing at all, but it puffs you up."), new s.lm("Starfish",33.75,9,11).setSize(1.4).setConstantHeal(9, !1, .7).setDescription("A leg of a starfish. It will heal you quite effectively while you are under 70% health."), new s.lm("Fang",28.125,8,10).setSize(1.15).setHealBack([.2, .25, .3, .35, .4, .45, -.5, .55, .6, .65, .7, .75]).setDescription("The fang of a dangerous Leech. It will heal back the damage it causes."), new s.lm("Goo",39.375,10,10).setSize(1.3).setPoison(2, 5).setEnemySpeedMultiplier(.7, 5).setLaunchable(1, 35).setDescription("This sticky goo isn't good for you..."), new s.lm("Maggot Poo",22.5,5,5.5).setSize(1.3).setDamageReflection(.05).setLaunchable(0, 75).setDescription("A steaming pile of shi- I mean, poo."), new s.lm("Lightbulb",22.5,10,10).setSize(1.4).setAttractsAggro(1).setHuddles(1).setLighting(1).setDescription("Mobs will prioritize your shiny bulb when in use. The priority increases with each rarity, and stacks with itself."), new s.lm("Battery",50.625,1e-15,0).setPhases(1).setSize(1.34).setLightning(4, 256, 5, [2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7], !0).setDescription("A battery that can release electric charges when its parent is hit."), new s.lm("Dust",16.875,6,7.5).setMulti(3, !0).setLaunchable(.7, 55).setDensity(1.5).setDescription("A cloud of dust that can be launched at enemies."), new s.lm("Armor",0,0,0).setMulti(0, !1).setWearable(s.DQ.ARMOR).setExtraHealth(-10).setDamageReduction(.25).setDescription("This petal greatly protects you, but at a cost..."), new s.lm("Wasp Missile.projectile",2250,4,4).setPoison(2, 8).setDescription("[object null object]"), new s.lm("Shrub",33.75,15,6).setSize(1.2).setExtraHealth(15).setPoison(3, 2).setDescription("Extra HP with a bonus: poison!"), new s.lm("projectile.grape",2250,1,4).setPoison(.75, 6).setDescription("[object null object]"), new s.lm("Grapes",33.75,15,10).setSize(1.15).setPoison(7.5, 5).setDescription("With an added bonus: Poison!"), new s.lm("Lantern",45,5,5).setHuddles(1).setDescription("This fragile lantern shines so bright...").setLighting(3), new s.lm("web.player.launched",2250,1e5,0).setSize(30).setEnemySpeedMultiplier(.334, .05).setIgnoreWalls(1).setDescription("[object null object]"), new s.lm("Branch",67.5,10,10).setSize(1.5).setHuddles(1).setMulti(2, !1).setDescription("A fragile branch from the Wilt."), new s.lm("Leech Egg",45,25,1).setSize(1.5).setHuddles(1).setDescription("Summons leeches to help protect you!"), new s.lm("Hornet Egg",45,25,1).setSize(1.5).setMulti(2, !1).setHuddles(1).setDescription("Hey wait a minute... This isn't a Beetle Egg!"), new s.lm("Candy",22.5,5,5).setSize(.9).setMulti(5, !0).setDescription("Ooh, tasty!"), new s.lm("Claw",45,.25,8).setExtraDamage(.75, 1, 7.5).setDescription("Sharp against the strong, weak against the weak."), new s.lm("Bullet.projectile",1e3,12,2).setDescription("[object null object]"), new s.lm("Square Egg",45,50,1).setSize(1.2).setHuddles(1).setDescription("This isn't from this world..."), new s.lm("Triangle Egg",67.5,100,2).setSize(1.5).setHuddles(1).setDescription("This isn't from this world..."), new s.lm("Pentagon Egg",90,200,4).setSize(1.8).setHuddles(1).setDescription("This isn't from this world...")]
              , h = t => n.findIndex((e => e.name === t));
            n[h("Web")].setShootOut(h("web.player.launched")),
            n[h("Peas")].setSplits(h("Pea.projectile"), 4),
            n[h("Grapes")].setSplits(h("projectile.grape"), 4);
            const r = [new s.XE("Ladybug",25,10,25,2.5).addDrop(h("Light")).addDrop(h("Rose"), .6), new s.XE("Rock",75,5,27.5,0).addDrop(h("Rock")).addDrop(h("Heavy"), .5, 2), new s.XE("Bee",15,25,25,4).setMoveInSines(1).setNeutral(1).addDrop(h("Stinger"), .7).addDrop(h("Pollen")).addDrop(h("Honey"), .4), new s.XE("Spider",20,10,20,4).setAggressive(1).setPoison(5, 3).setProjectile({
                petalIndex: h("Web") + 1,
                cooldown: 22.5,
                health: 1 / 0,
                damage: 0,
                speed: 0,
                range: 175,
                size: 1,
                runs: !0,
                nullCollision: !0
            }).addDrop(h("Faster")).addDrop(h("Web"), .5).addDrop(h("Third Eye"), .025, 5), new s.XE("Beetle",30,10,30,3).setAggressive(1).addDrop(h("Iris")).addDrop(h("Pincer"), .8).addDrop(h("Beetle Egg"), .225), new s.XE("Leafbug",35,3.5,30,2.5).setNeutral(1).setDamageReduction(.13).addDrop(h("Leaf")).addDrop(h("Bone"), .5).addDrop(h("Cactus"), .25), new s.XE("Roach",30,5,30,5.5).setNeutral(1).addDrop(h("Antennae"), 1, 2).addDrop(h("Magnolia"), .6).addDrop(h("Bone"), .6), new s.XE("Hornet",35,15,30,3).setAggressive(1).setProjectile({
                petalIndex: h("Missile"),
                cooldown: 45,
                health: 4,
                damage: 5,
                speed: 3.75,
                range: 55
            }).addDrop(h("Missile")).addDrop(h("Antennae"), 1, 2).addDrop(h("Orange")), new s.XE("Mantis",35,10,32.5,2).setAggressive(1).setProjectile({
                petalIndex: h("Pea.projectile"),
                cooldown: 140.625,
                health: 1.25,
                damage: 1.5,
                speed: 4.5,
                range: 55,
                size: .2,
                multiShot: {
                    count: 3,
                    delay: 256
                }
            }).addDrop(h("Peas")).addDrop(h("Antennae"), .5, 2), new s.XE("Pupa",40,10,30,1).setAggressive(1).setProjectile({
                petalIndex: h("Rock"),
                cooldown: 78.75,
                health: .8,
                damage: 1.1,
                speed: 4,
                range: 45,
                size: .3,
                multiShot: {
                    count: 5,
                    delay: 10,
                    spread: .2
                }
            }).addDrop(h("Rock")).addDrop(h("Wing")).addDrop(h("Heavy"), .5, 2), new s.XE("Sandstorm",45,15,35,3).setSandstormMovement(1).setSize(35, s.rx.SIZE_SCALE, .9, .25).addDrop(h("Sand")).addDrop(h("Glass"), .7).addDrop(h("Stick"), .2, 2), new s.XE("Scorpion",45,7.5,32.5,3).setAggressive(1).setStrafes(30, 15, 1.25).setProjectile({
                petalIndex: h("Scorpion Missile.projectile"),
                cooldown: 45,
                health: 2,
                damage: 2,
                speed: 5,
                range: 65,
                size: .2
            }).addDrop(h("Pincer")).addDrop(h("Iris")), new s.XE("Demon",100,7.5,35,1).setAggressive(1).setPushability(.8).setProjectile({
                petalIndex: h("Missile"),
                cooldown: 112.5,
                health: 1,
                damage: 1,
                speed: 5,
                range: 120,
                size: .1334,
                multiShot: {
                    count: 4,
                    delay: 128,
                    spread: .5
                }
            }).addDrop(h("Bone")).addDrop(h("Lightning"), .2).addDrop(h("Fire Spellbook"), .03), new s.XE("Jellyfish",40,15,30,2.5).setAggressive(1).setLightning([75, 75, 75, 65, 65, 65, 55, 55, 55, 45, 35, 25], [2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 8], 125, 2).addDrop(h("Lightning")).addDrop(h("Jelly")), new s.XE("Cactus",50,20,30,0).setPushability(.5).addDrop(h("Cactus")).addDrop(h("Stinger"), .8), new s.XE("Baby Ant",10,5,15,2).addDrop(h("Light"), .5).addDrop(h("Faster"), .5).addDrop(h("Rice"), .5), new s.XE("Worker Ant",15,5,15,3.25).setNeutral(1).addDrop(h("Light"), .5).addDrop(h("Leaf"), .5).addDrop(h("Corn"), .5), new s.XE("Soldier Ant",25,5,15,3.5).setAggressive(1).addDrop(h("Faster"), .5).addDrop(h("Wing"), .5), new s.XE("Queen Ant",100,5,25,3.5).setAggressive(1).setPushability(.8).addDrop(h("Dahlia")).addDrop(h("Dirt"), .5).addDrop(h("Ant Egg"), .8), new s.XE("Ant Hole",100,1,25,0).setPushability(0).addDrop(h("Dirt")).addDrop(h("Ant Egg"), .5), new s.XE("Baby Fire Ant",10,10,15,2).addDrop(h("Light"), .5).addDrop(h("Yucca"), .5), new s.XE("Worker Fire Ant",15,10,15,3.25).setNeutral(1).addDrop(h("Light"), .5).addDrop(h("Yucca"), .5), new s.XE("Soldier Fire Ant",25,10,15,3.5).setAggressive(1).addDrop(h("Faster"), .5).addDrop(h("Glass"), .5), new s.XE("Queen Fire Ant",100,10,25,3.5).setAggressive(1).setPushability(.8).addDrop(h("Primrose"), .5).addDrop(h("Dirt"), .5).addDrop(h("Ant Egg"), .8), new s.XE("Fire Ant Hole",100,2,25,0).setPushability(0).addDrop(h("Dirt")).addDrop(h("Ant Egg"), .5).addDrop(h("Magnet"), .5, 2), new s.XE("Baby Termite",15,5,15,2).setDamageReduction(.1).setDamageReflection(.05, .5).addDrop(h("Bone"), .5).addDrop(h("Amulet"), .15), new s.XE("Worker Termite",20,5,15,3.25).setNeutral(1).setDamageReduction(.1).setDamageReflection(.05, .5).addDrop(h("Bone"), .5).addDrop(h("Amulet"), .15), new s.XE("Soldier Termite",30,5,15,3.5).setAggressive(1).setDamageReduction(.1).setDamageReflection(.05, .5).addDrop(h("Bone"), .5).addDrop(h("Amulet"), .15), new s.XE("Termite Overmind",150,2,30,.5).setAggressive(1).setPushability(.5).setDamageReduction(.1).setDamageReflection(.05, .5).addDrop(h("Ant Egg"), .5).addDrop(h("Amulet"), .4), new s.XE("Termite Mound",150,1,30,0).setDamageReduction(.1).setPushability(0).addDrop(h("Dirt")).addDrop(h("Armor"), .75).addDrop(h("Magnet"), .5), new s.XE("Ant Egg",20,1,15,0).addDrop(h("Ant Egg")), new s.XE("Queen Ant Egg",20,1,15,0), new s.XE("Fire Ant Egg",20,2,15,0).addDrop(h("Ant Egg")), new s.XE("Queen Fire Ant Egg",20,2,15,0), new s.XE("Termite Egg",30,1,15,0).addDrop(h("Ant Egg")), new s.XE("Evil Ladybug",25,15,25,2.5).setAggressive(1).setDamageReduction(.125).addDrop(h("Dahlia")).addDrop(h("Yin Yang"), .15), new s.XE("Shiny Ladybug",25,10,25,2.5).setNeutral(1).addDrop(h("Primrose")).addDrop(h("Yggdrasil"), .15, 3), new s.XE("Angelic Ladybug",55,15,25,2.5).setNeutral(1).setDamageReflection(.05, .5).addDrop(h("Dahlia")).addDrop(h("Yin Yang"), .15).addDrop(h("Third Eye"), .05, 3), new s.XE("Centipede",25,10,22.5,3.5).setNeutral(1).setCentipedeMovement(1).addDrop(h("Peas"), .5).addDrop(h("Leaf"), .5), new s.XE("Centipede",25,10,22.5,3.5).setSystem(1).setNeutral(1).setCentipedeMovement(1).addDrop(h("Peas"), .5).addDrop(h("Leaf"), .5), new s.XE("Desert Centipede",20,10,22.5,5).setDesertCentipedeMovement(1).addDrop(h("Powder"), .5).addDrop(h("Sand"), .5), new s.XE("Desert Centipede",20,10,22.5,5).setSystem(1).setDesertCentipedeMovement(1).addDrop(h("Powder"), .5).addDrop(h("Sand"), .5), new s.XE("Evil Centipede",25,10,22.5,3.5).setAggressive(1).setCentipedeMovement(1).addDrop(h("Iris"), .5).addDrop(h("Grapes"), .5), new s.XE("Evil Centipede",25,10,22.5,3.5).setSystem(1).setAggressive(1).setCentipedeMovement(1).addDrop(h("Iris"), .5).addDrop(h("Grapes"), .5), new s.XE("Dandelion",25,10,22.5,0).setPushability(.5).addDrop(h("Dandelion")).addDrop(h("Pollen"), .5), new s.XE("Sponge",35,3,30,0).addDrop(h("Sponge")), new s.XE("Bubble",1,1,30,0).addDrop(h("Bubble"), .8).addDrop(h("Air"), .8), new s.XE("Shell",40,10,32.5,25).setMovesInBursts(1).setNeutral(1).addDrop(h("Shell"), .8).addDrop(h("Pearl"), .5).addDrop(h("Magnet"), .2), new s.XE("Starfish",30,10,30,4).setAggressive(1).setSpins(1).setHealing(.007).setFleeAtLowHealth(.35).addDrop(h("Starfish"), .85).addDrop(h("Sand"), .85), new s.XE("Leech",25,3.5,16,5.5).setAggressive(1).addDrop(h("Fang")).addDrop(h("Faster")), new s.XE("Maggot",30,10,35,2).setAggressive(1).setProjectile({
                petalIndex: h("Goo"),
                cooldown: 61.875,
                health: 2,
                damage: 1,
                speed: 3,
                range: 45,
                size: .35
            }).addDrop(h("Goo")).addDrop(h("Maggot Poo"), .5).addDrop(h("Dirt"), .65), new s.XE("Firefly",30,10,25,4).setMoveInSines(1).addDrop(h("Wing")).addDrop(h("Lightbulb"), .6).addDrop(h("Battery"), .4), new s.XE("Bumblebee",25,15,30,5).setMoveInSines(1).setBumblebeeMovement(1).setProjectile({
                petalIndex: h("Pollen"),
                cooldown: 11.25,
                health: 1,
                damage: 1,
                speed: 0,
                range: 90
            }).addDrop(h("Pollen")).addDrop(h("Honey")), new s.XE("Moth",25,10,25,3).setMoveInSines(1).setNeutral(1).setFleeAtLowHealth(1).addDrop(h("Wing")).addDrop(h("Lightbulb"), .6).addDrop(h("Dust"), .4), new s.XE("Fly",15,2.5,20,6).setAggressive(1).setMoveInSines(1).addDrop(h("Wing")).addDrop(h("Faster"), .8).addDrop(h("Third Eye"), .02, 5), new s.XE("Square",50,3.5,30,0).addDrop(h("Square Egg")), new s.XE("Triangle",100,5.5,32.5,0).addDrop(h("Triangle Egg")), new s.XE("Pentagon",150,7.5,35,0).addDrop(h("Pentagon Egg")), new s.XE("Hell Beetle",35,15,35,4).setAggressive(1).setPushability(.8).addDrop(h("Dust"), .8).addDrop(h("Pincer"), .8).addDrop(h("Beetle Egg"), .8), new s.XE("Hell Spider",25,15,20,4).setAggressive(1).setPoison(5, 3).setPushability(.8).addDrop(h("Faster")).addDrop(h("Web"), .5).addDrop(h("Dahlia"), .5).setProjectile({
                petalIndex: h("Web") + 1,
                cooldown: 22.5,
                health: 1 / 0,
                damage: 0,
                speed: 0,
                range: 175,
                size: 1,
                runs: !0,
                nullCollision: !0
            }), new s.XE("Hell Yellowjacket",65,5,25,4).setAggressive(1).setProjectile({
                petalIndex: h("Missile"),
                cooldown: 90,
                health: 4,
                damage: 4,
                speed: 4.5,
                range: 65,
                aimbot: !0
            }).setPushability(.8).addDrop(h("Missile")).addDrop(h("Antennae"), 1, 2), new s.XE("Termite Overmind Egg",20,1,15,0), new s.XE("Spirit",1e-15,0,35,1).setSpins(4, 1).addDrop(h("Candy"), .1), new s.XE("Wasp",40,15,35,3).setAggressive(1).setProjectile({
                petalIndex: h("Wasp Missile.projectile"),
                cooldown: 112.5,
                health: 13,
                damage: 1.25,
                speed: 2.5,
                range: 185,
                multiShot: {
                    count: 3,
                    delay: 256,
                    spread: .2
                }
            }).addDrop(h("Missile")).setPushability(.8).addDrop(h("Antennae"), 1, 2).addDrop(h("Pollen"), .4), new s.XE("Stickbug",15,4,10,6.5).setAggressive(1).setPoison(2, 4).addDrop(h("Iris"), .75).addDrop(h("Powder")), new s.XE("Shrub",25,10,30,0).setPoison(3, 5).setPushability(.5).addDrop(h("Iris"), .75).addDrop(h("Shrub"), .6).addDrop(h("Leaf")), new s.XE("Hell Centipede",25,10,22.5,4).setAggressive(1).setSize(22.5, s.rx.SIZE_SCALE, .75, .25).addDrop(h("Powder"), .5).addDrop(h("Dust"), .5), new s.XE("Hell Centipede",25,10,22.5,4).setSystem(1).setAggressive(1).setSize(22.5, s.rx.SIZE_SCALE, .75, .25).addDrop(h("Powder"), .5).addDrop(h("Dust"), .5), new s.XE("Wilt",25,10,30,0).setPushability(0).addDrop(h("Branch")).addDrop(h("Leaf"), .6), new s.XE("Wilt",25,10,15,2.75).setSystem(1).setAggressive(1).addDrop(h("Branch")).addDrop(h("Leaf"), .6), new s.XE("Pumpkin",40,10,20,0).setSize(20, s.rx.SIZE_SCALE, .75, .25).addDrop(h("Leaf"), .5).addDrop(h("Candy"), .6).addDrop(h("Lantern"), .1), new s.XE("Jack O' Lantern",40,10,20,0).setAggressive(1).setProjectile({
                petalIndex: h("Candy"),
                cooldown: 22.5 * .175,
                health: 1,
                damage: 1,
                speed: 5,
                range: 20,
                size: .4
            }).addDrop(h("Rock"), .8).addDrop(h("Candy"), .6).addDrop(h("Lantern"), .1), new s.XE("Crab",30,10,30,7).setAggressive(1).setStrafes(125, 25, .5).addDrop(h("Sand"), .4).addDrop(h("Claw"), .8), new s.XE("Tank",50,3,20,2).setAggressive(1).setProjectile({
                petalIndex: h("Bullet.projectile"),
                cooldown: 16.875,
                health: 7.5,
                damage: 2.5,
                speed: 2.5,
                range: 33.75,
                size: .3,
                aimbot: !0
            }).addDrop(h("Square Egg"), .1).addDrop(h("Triangle Egg"), .05).addDrop(h("Pentagon Egg"), .01)]
              , o = t => r.findIndex((e => e.name === t));
            function l(t) {
                for (let e = 0; e < r.length; e++)
                    if (t(r[e]))
                        return e;
                return -1
            }
            n[h("Beetle Egg")].setSpawnable(o("Beetle"), [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 4),
            n[h("Stick")].setSpawnable(o("Sandstorm"), [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 4),
            n[h("Ant Egg")].setSpawnable(o("Soldier Ant"), [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 4),
            n[h("Branch")].setSpawnable(o("Wilt") + 1, [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5),
            n[h("Leech Egg")].setSpawnable(o("Leech"), [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3),
            n[h("Hornet Egg")].setSpawnable(o("Hornet"), [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5),
            n[h("Square Egg")].setSpawnable(o("Square"), [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 2),
            n[h("Triangle Egg")].setSpawnable(o("Triangle"), [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 2),
            n[h("Pentagon Egg")].setSpawnable(o("Pentagon"), [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 2),
            r[o("Angelic Ladybug")].setPoopable({
                index: o("Evil Ladybug"),
                interval: 135
            }),
            r[o("Ant Hole")].setAntHoleSpawns([{
                index: o("Baby Ant"),
                count: [4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7]
            }, {
                index: o("Worker Ant"),
                count: [5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8]
            }, {
                index: o("Soldier Ant"),
                count: [6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9]
            }, {
                index: o("Ant Egg"),
                count: 5
            }, {
                index: o("Queen Ant"),
                count: 1,
                minHealthRatio: .01
            }]),
            r[o("Fire Ant Hole")].setAntHoleSpawns([{
                index: o("Baby Fire Ant"),
                count: [4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7]
            }, {
                index: o("Worker Fire Ant"),
                count: [5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8]
            }, {
                index: o("Soldier Fire Ant"),
                count: [6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9]
            }, {
                index: o("Fire Ant Egg"),
                count: 5
            }, {
                index: o("Queen Fire Ant"),
                count: 1,
                minHealthRatio: .01
            }]),
            r[o("Termite Mound")].setAntHoleSpawns([{
                index: o("Baby Termite"),
                count: 6
            }, {
                index: o("Worker Termite"),
                count: 8
            }, {
                index: o("Soldier Termite"),
                count: 8
            }, {
                index: o("Termite Egg"),
                count: 5
            }, {
                index: o("Termite Overmind"),
                count: 1,
                minHealthRatio: .01
            }]),
            r[o("Ant Egg")].setHatchables([{
                index: o("Baby Ant"),
                time: 337.5
            }, {
                index: o("Worker Ant"),
                time: 562.5
            }, {
                index: o("Soldier Ant"),
                time: 787.5
            }]),
            r[o("Queen Ant Egg")].setHatchables({
                index: o("Soldier Ant"),
                time: 33.75
            }),
            r[o("Queen Ant")].setPoopable({
                index: o("Queen Ant Egg"),
                interval: 45
            }),
            r[o("Fire Ant Egg")].setHatchables([{
                index: o("Baby Fire Ant"),
                time: 337.5
            }, {
                index: o("Worker Fire Ant"),
                time: 562.5
            }, {
                index: o("Soldier Fire Ant"),
                time: 787.5
            }]),
            r[o("Queen Fire Ant Egg")].setHatchables({
                index: o("Soldier Fire Ant"),
                time: 33.75
            }),
            r[o("Queen Fire Ant")].setPoopable({
                index: o("Queen Fire Ant Egg"),
                interval: 45
            }),
            r[o("Termite Egg")].setHatchables([{
                index: o("Baby Termite"),
                time: 337.5
            }, {
                index: o("Worker Termite"),
                time: 562.5
            }, {
                index: o("Soldier Termite"),
                time: 787.5
            }]),
            r[o("Termite Overmind Egg")].setHatchables({
                index: o("Soldier Termite"),
                time: 45
            }),
            r[o("Termite Overmind")].setPoopable({
                index: o("Termite Overmind Egg"),
                interval: 90
            }),
            r[o("Centipede")].segmentWith(l((t => t.isSystem && "Centipede" === t.name))),
            r[o("Desert Centipede")].segmentWith(l((t => t.isSystem && "Desert Centipede" === t.name))),
            r[o("Evil Centipede")].segmentWith(l((t => t.isSystem && "Evil Centipede" === t.name))),
            r[o("Hell Centipede")].segmentWith(l((t => t.isSystem && "Hell Centipede" === t.name))),
            r[o("Wilt")].branchWith(l((t => t.isSystem && "Wilt" === t.name)), 5, 2);
            const d = n.length;
            r.length;
            console.log("config.js loaded", n.length, "petals", r.length, "mobs.");
            const c = t => {
                const e = [];
                return r.forEach((i => {
                    i.drops.forEach((i => {
                        i.index > -1 && t >= i.minRarity && e.push(i.index)
                    }
                    ))
                }
                )),
                e[Math.random() * e.length | 0]
            }
        }
        ,
        512: (t, e, i) => {
            i.d(e, {
                A: () => r
            });
            var s = i(110)
              , a = i(874);
            class n {
                constructor() {
                    this.grid = new Map
                }
                clear() {
                    this.grid.clear()
                }
                insert(t) {
                    const e = t._AABB.x1 >> 6
                      , i = t._AABB.y1 >> 6
                      , s = t._AABB.x2 >> 6
                      , a = t._AABB.y2 >> 6;
                    for (let n = i; n <= a; n++)
                        for (let i = e; i <= s; i++) {
                            const e = i | n << 6;
                            this.grid.has(e) ? this.grid.get(e).push(t) : this.grid.set(e, [t])
                        }
                }
                retrieve(t) {
                    const e = new Map
                      , i = t._AABB.x1 >> 6
                      , s = t._AABB.y1 >> 6
                      , a = t._AABB.x2 >> 6
                      , n = t._AABB.y2 >> 6;
                    for (let h = s; h <= n; h++)
                        for (let s = i; s <= a; s++) {
                            const i = s | h << 6;
                            if (!this.grid.has(i))
                                continue;
                            const a = this.grid.get(i);
                            for (let i = 0; i < a.length; i++)
                                !e.has(a[i].id) && this.hitDetection(t, a[i]) && e.set(a[i].id, a[i])
                        }
                    return e
                }
                hitDetection(t, e) {
                    return !(t._AABB.x1 > e._AABB.x2 || t._AABB.y1 > e._AABB.y2 || t._AABB.x2 < e._AABB.x1 || t._AABB.y2 < e._AABB.y1)
                }
                getAABB(t) {
                    const e = t.width * t.size
                      , i = t.height * t.size;
                    return {
                        x1: t.x - e,
                        y1: t.y - i,
                        x2: t.x + e,
                        y2: t.y + i
                    }
                }
            }
            const h = {
                router: null,
                width: 1024,
                height: 1024,
                isRadial: !1,
                isLineMap: !1,
                biome: 0,
                announceRarity: 7,
                gamemode: s.LX.FFA,
                isTDM: !1,
                teamCount: 2,
                isWaves: !1,
                currentWave: 0,
                mobsExpire: !1,
                dynamicRoom: !0,
                teamMinimaps: [],
                random: () => {
                    if (h.isRadial) {
                        const t = Math.random() * Math.PI * 2
                          , e = Math.random() * h.width / 2;
                        return {
                            x: Math.cos(t) * e,
                            y: Math.sin(t) * e
                        }
                    }
                    return {
                        x: -h.width / 2 + Math.random() * h.width,
                        y: -h.height / 2 + Math.random() * h.height
                    }
                }
                ,
                mapSpawns: null,
                maxMapDistFromSpawn: 0,
                mapData: [],
                mapBasedSpawn(t, e) {
                    if (null == h.mapSpawns || null == h.mapSpawns[t])
                        return h.random();
                    let i = h.mapSpawns[t];
                    if (t == s.wv.PLAYER) {
                        let t = 0;
                        i = i.filter((t => {
                            if (t.rarity <= e.highestRarity)
                                return !0
                        }
                        )),
                        i.forEach((e => {
                            t = Math.max(e.rarity, t)
                        }
                        )),
                        i = i.filter((e => {
                            if (e.rarity >= t)
                                return !0
                        }
                        ))
                    }
                    const a = i[Math.floor(Math.random() * i.length)];
                    return {
                        x: a.x * h.width,
                        y: a.y * h.height,
                        rarity: a.rarity
                    }
                },
                isValidMapSpawn: (t, e) => {
                    if (0 === h.mapData.cells.length)
                        return !0;
                    const i = Math.floor((t + h.width / 2) / h.width * h.terrainGridWidth)
                      , s = Math.floor((e + h.height / 2) / h.height * h.terrainGridHeight);
                    return !(i < 0 || i >= h.terrainGridWidth || s < 0 || s >= h.terrainGridHeight) && 0 !== h.mapDataAt(t, e).type
                }
                ,
                mapDataAt: (t, e) => {
                    const i = Math.floor((t + h.width / 2) / h.width * h.terrainGridWidth)
                      , s = Math.floor((e + h.height / 2) / h.height * h.terrainGridHeight);
                    return i < 0 || i >= h.terrainGridWidth || s < 0 || s >= h.terrainGridHeight ? null : h.mapData.cells.filter((t => {
                        if (t.x == i && t.y == s)
                            return !0
                    }
                    ))[0]
                }
                ,
                mapSpawnClosestTo: (t, e) => {
                    if (0 === h.mapData.length)
                        return h.random();
                    t /= h.width,
                    e /= h.height;
                    let i, s = 1 / 0;
                    for (const n in h.mapSpawns) {
                        const r = h.mapSpawns[n];
                        for (const n of r) {
                            const h = (0,
                            a.t1)(n, {
                                x: t,
                                y: e
                            });
                            h < s && (i = n,
                            s = h)
                        }
                    }
                    return i
                }
                ,
                getPlayerSpawn: t => {
                    if (!h.isLineMap) {
                        return h.mapBasedSpawn(s.wv.PLAYER, t)
                    }
                    return {
                        x: Math.max(-h.width / 2 + 25, Math.min(h.width / 2 - 25, -h.width / 2 + Math.min(t.level / 50, 1) * h.width / 1.5 + 64 * (Math.random() - .5))),
                        y: -h.height / 2 + Math.random() * h.height
                    }
                }
                ,
                spawnNearPlayer: t => {
                    const e = [];
                    if (h.clients.forEach((t => {
                        t.body && e.push({
                            highestRarity: t.highestRarity,
                            x: t.body.x,
                            y: t.body.y,
                            size: t.body.size
                        })
                    }
                    )),
                    0 === e.length)
                        return {
                            position: h.mapBasedSpawn(s.wv.MOB),
                            rarity: 3 * Math.random() | 0
                        };
                    const i = e[Math.floor(Math.random() * e.length)];
                    let a, n = 0, r = i.size + 512, o = !1, l = 0;
                    do {
                        const e = Math.random() * Math.PI * 2
                          , s = r + 2048 * Math.random();
                        a = {
                            x: i.x + Math.cos(e) * s,
                            y: i.y + Math.sin(e) * s
                        };
                        const n = i.x - a.x
                          , d = i.y - a.y;
                        if (n * n + d * d > r * r && h.isValidMapSpawn(a.x, a.y)) {
                            const e = h.mapSpawnClosestTo(a.x, a.y).rarity
                              , i = Math.random() > .5 * Math.pow(1.1015, e);
                            l = Math.min(11, Math.max(0, i ? e + 1 : e - (2 * Math.random() | 0)));
                            if (0 === h.spatialHash.retrieve({
                                _AABB: {
                                    x1: a.x - t.tiers[l].size,
                                    y1: a.y - t.tiers[l].size,
                                    x2: a.x + t.tiers[l].size,
                                    y2: a.y + t.tiers[l].size
                                }
                            }).size) {
                                o = !0;
                                break
                            }
                        }
                    } while (++n < 100);
                    return o || (a = h.mapBasedSpawn(s.wv.MOB)),
                    {
                        position: a,
                        rarity: l,
                        tile: h.mapDataAt(a.x, a.y)
                    }
                }
                ,
                lineMapMobSpawn: t => {
                    const e = [];
                    if (h.clients.forEach((t => {
                        t.body && e.push({
                            highestRarity: t.highestRarity,
                            x: t.body.x,
                            y: t.body.y
                        })
                    }
                    )),
                    0 === e.length) {
                        const t = h.random();
                        return t.x = Math.max(-h.width / 2 + 25, Math.min(-25, t.x)),
                        {
                            position: t,
                            rarity: Math.min(10, Math.max(0, Math.floor((t.x + h.width / 2) / h.width * 10 + 2 * (Math.random() - .5))))
                        }
                    }
                    const i = e[Math.floor(Math.random() * e.length)];
                    let s = Math.min(10, i.highestRarity + (Math.random() > .8), Math.max(0, Math.floor((i.x + h.width / 2) / h.width * 10 + 2 * (Math.random() - .5))))
                      , n = 0
                      , r = 0
                      , o = 0;
                    do {
                        const e = Math.random() * Math.PI * 2
                          , a = 128 + 8 * t.tiers[s].size + Math.random() * t.tiers[s].size * 12;
                        n = i.x + Math.cos(e) * a,
                        r = i.y + Math.sin(e) * a,
                        n = Math.max(-h.width / 2 + 25, Math.min(h.width / 2 - 25, n)),
                        r = Math.max(-h.height / 2 + 25, Math.min(h.height / 2 - 25, r)),
                        o > 0 && o % 10 == 9 && (s = Math.max(0, s - 1))
                    } while (e.some((t => (0,
                    a.t1)(t, {
                        x: n,
                        y: r
                    }) < 128)) && o++ < 100);
                    return {
                        position: {
                            x: n,
                            y: r
                        },
                        rarity: s
                    }
                }
                ,
                spatialHash: new n,
                viewsSpatialHash: new n,
                terrainSpatialHash: new n,
                entities: new Map,
                drops: new Map,
                clients: new Map,
                pentagrams: new Map,
                lightning: new Map,
                terrain: new Map,
                terrainGridWidth: 0,
                terrainGridHeight: 0,
                maxMobs: 6,
                livingMobCount: 0,
                aliveMobs: [],
                alivePlayers: [],
                inventory: Object.fromEntries(s.cK.map((t => [t.name, {}]))),
                secretKey: crypto.getRandomValues(new Uint8Array(32)).join(""),
                zones: [],
                lag: {
                    fps: 20,
                    mspt: 0,
                    ticks: 0,
                    totalTime: 0
                },
                updateTerrain: () => {
                    h.terrainSpatialHash.clear(),
                    h.terrain.forEach((t => {
                        t._AABB = t.polygon._AABB,
                        h.terrainSpatialHash.insert(t)
                    }
                    ))
                }
                ,
                sendTerrain: t => {
                    const e = new s.AU(!0);
                    e.setUint8(s.jU.PIPE_PACKET),
                    e.setUint16(t > 0 ? t : 0),
                    e.setUint8(s.de.TERRAIN),
                    e.setUint16(h.terrainGridWidth),
                    e.setUint16(h.terrainGridHeight),
                    e.setUint16(h.terrain.size),
                    h.terrain.forEach((t => {
                        e.setInt16(t.gridX),
                        e.setInt16(t.gridY),
                        e.setUint8(t.type[0]),
                        e.setUint8(t.type[1])
                    }
                    )),
                    h.router.postMessage(e.build())
                }
                ,
                mobTable: null
            };
            h.inventory && s.cK.forEach((t => {
                h.inventory[t.name] = {}
            }
            ));
            const r = h
        }
        ,
        874: (t, e, i) => {
            i.d(e, {
                Br: () => d,
                FL: () => r,
                Iv: () => g,
                TH: () => c,
                UU: () => l,
                ZL: () => h,
                jd: () => n,
                nU: () => s,
                t1: () => o
            });
            function s(t, e, i) {
                const s = (1 - i) * Math.cos(t) + i * Math.cos(e)
                  , a = (1 - i) * Math.sin(t) + i * Math.sin(e);
                return Math.atan2(a, s)
            }
            const a = .6375;
            function n(t, e) {
                const i = Math.min(11, Math.min(t, e + 1))
                  , s = Math.max(0, i - 2);
                if (s > i)
                    return s;
                let n = s;
                const h = Math.pow(a, i);
                for (let t = s; t < i; t++)
                    Math.random() < h && n++;
                return n
            }
            function h(t, e, i) {
                let s = t % e / e
                  , a = Math.floor(t / e);
                return Math.random() < s && a++,
                Math.random() < .082 && (a++,
                Math.random() < .023 && a++),
                Math.random() < .091 && a--,
                Math.random() < .074 && a--,
                Math.random() < .025 && a--,
                Math.min(i, Math.max(0, a))
            }
            function r(t, e) {
                const i = t - e;
                return Math.atan2(Math.sin(i), Math.cos(i))
            }
            function o(t, e) {
                const i = t.x - e.x
                  , s = t.y - e.y;
                return i * i + s * s
            }
            function l(t) {
                return Math.pow(t, 2.35) + Math.exp(t / 25)
            }
            function d(t, e=!1) {
                return /^[aeiou]/i.test(t) ? (e ? "An" : "an") + " " + t : (e ? "A" : "a") + " " + t
            }
            function c(t, e=!1) {
                const i = {
                    y: "ies",
                    h: "hes",
                    s: "ses",
                    x: "xes",
                    o: "oes"
                };
                for (const [e,s] of Object.entries(i))
                    if (t.endsWith(e)) {
                        t = t.slice(0, -e.length) + s;
                        break
                    }
                return Object.keys(i).some((e => t.endsWith(i[e]))) || (t += "s"),
                e && (t = t.charAt(0).toUpperCase() + t.slice(1)),
                t
            }
            const g = ( () => {
                const t = new Date
                  , e = t.getMonth() + 1
                  , i = t.getDate();
                return 10 === e && i >= 31 || 11 === e && i <= 7
            }
            )()
        }
        ,
        904: (t, e, i) => {
            i.d(e, {
                cS: () => u,
                Bw: () => y,
                ai: () => p,
                M_: () => M
            });
            var s = i(110)
              , a = i(874)
              , n = i(446)
              , h = i(512);
            class r {
                constructor(t=0, e=0) {
                    this.x = t,
                    this.y = e
                }
                get magnitude() {
                    return Math.sqrt(this.x * this.x + this.y * this.y)
                }
                get angle() {
                    return Math.atan2(this.y, this.x)
                }
                multiply(t) {
                    return this.x *= t,
                    this.y *= t,
                    this
                }
                divide(t) {
                    return this.x /= t,
                    this.y /= t,
                    this
                }
                add(t) {
                    return this.x += t.x,
                    this.y += t.y,
                    this
                }
                subtract(t) {
                    return this.x -= t.x,
                    this.y -= t.y,
                    this
                }
                normalize() {
                    return this.divide(Math.max(1e-4, this.magnitude))
                }
                addDirection(t, e) {
                    return this.x += e * Math.cos(t),
                    this.y += e * Math.sin(t),
                    this
                }
                zero() {
                    return this.x = 0,
                    this.y = 0,
                    this
                }
            }
            class o {
                constructor(t) {
                    this.health = t,
                    this.maxHealth = t,
                    this.lastDamaged = 0,
                    this.damageReduction = 0,
                    this.invulnerable = !1,
                    this.onDamage = null,
                    this.shield = 0
                }
                set(t, e=!0) {
                    this.health = t * (e ? this.ratio : 1),
                    this.maxHealth = t,
                    this.shield = Math.min(this.shield, this.maxHealth)
                }
                damage(t) {
                    if (this.invulnerable)
                        return 0;
                    let e = 0;
                    if (this.shield > 0 && (e = Math.min(this.shield, t),
                    this.shield -= e),
                    this.shield <= 0) {
                        const i = Math.max(0, Math.min(this.health, t - e - (t - e) * Math.min(.75, this.damageReduction)));
                        this.health = this.health - i,
                        e += i
                    }
                    return this.lastDamaged = Date.now(),
                    this.onDamage && this.onDamage(e),
                    e
                }
                deteriorateShield() {
                    this.shield = Math.max(0, this.shield - .015 * this.maxHealth / 23)
                }
                get ratio() {
                    return Math.max(0, this.health) / this.maxHealth
                }
                get shieldRatio() {
                    return Math.max(0, this.shield) / this.maxHealth
                }
                get isDead() {
                    return this.health <= 0
                }
            }
            class l {
                constructor(t, e) {
                    this.player = t,
                    this.index = e,
                    this.rarity = 0,
                    this.petals = [],
                    this.cooldowns = [],
                    this.boundMobs = [],
                    this.config = null,
                    this.amount = 1,
                    this.clumps = !1
                }
                get displayRatio() {
                    return 0 === this.amount || this.config.wearable ? 1 : this.petals.every((t => t && t.health.ratio > 0)) ? this.petals.reduce(( (t, e) => t + e.health.ratio), 0) / this.amount : Math.max(...this.cooldowns) / Math.max(1, this.config.cooldown)
                }
                define(t, e=0) {
                    this.config = t,
                    this.amount = this.config.tiers[e].count,
                    this.clumps = this.config.tiers[e].clumps && this.amount > 1,
                    this.petals = new Array(this.amount).fill(null),
                    this.cooldowns = new Array(this.amount).fill(0),
                    this.boundMobs = new Array(this.amount).fill(null).map(( () => [])),
                    this.player.health.set(Math.max(1e-10, this.player.health.maxHealth + this.config.tiers[e].extraHealth)),
                    this.player.health.damageReduction += this.config.tiers[e].damageReduction,
                    this.player.size += this.config.tiers[e].extraSize,
                    this.player.speed *= this.config.tiers[e].speedMultiplier,
                    this.rarity = e,
                    this.config.wearable > 0 && (this.player.wearing[this.config.wearable] ??= 0,
                    this.player.wearing[this.config.wearable]++,
                    this.config.tiers[this.rarity].damageReflection?.reflection > 0 && 1 === this.player.wearing[this.config.wearable] && (this.player.damageReflection.reflection += this.config.tiers[this.rarity].damageReflection.reflection,
                    this.player.damageReflection.cap += this.config.tiers[this.rarity].damageReflection.cap)),
                    this.config.tiers[this.rarity].extraVision && (this.player.extraVision += this.config.tiers[this.rarity].extraVision),
                    this.config.tiers[this.rarity].absorbsDamage && this.player.absorbStacks.set(this.index, new d(this.config.tiers[this.rarity].absorbsDamage.maxDamage,this.config.tiers[this.rarity].absorbsDamage.period)),
                    this.config.attractsAggro && (this.player.aggroLevel += this.rarity),
                    this.player.client && (this.player.client.camera.lightingBoost += this.config.extraLighting)
                }
                destroy() {
                    if (this.petals.forEach((t => t?.destroy())),
                    this.player.health.set(this.player.health.maxHealth - this.config.tiers[this.rarity].extraHealth),
                    this.player.health.damageReduction -= this.config.tiers[this.rarity].damageReduction,
                    this.player.size -= this.config.tiers[this.rarity].extraSize,
                    this.player.speed /= this.config.tiers[this.rarity].speedMultiplier,
                    this.cooldowns = new Array(this.amount).fill(-100),
                    this.boundMobs.forEach((t => {
                        t.forEach((t => {
                            t.segmentBodies && t.segmentBodies.forEach((t => {
                                t.destroy()
                            }
                            )),
                            t.destroy()
                        }
                        ))
                    }
                    )),
                    this.config.wearable > 0 && (this.player.wearing[this.config.wearable]--,
                    this.config.tiers[this.rarity].damageReflection?.reflection > 0 && 0 === this.player.wearing[this.config.wearable] && (this.player.damageReflection.reflection -= this.config.tiers[this.rarity].damageReflection.reflection,
                    this.player.damageReflection.cap -= this.config.tiers[this.rarity].damageReflection.cap)),
                    this.config.tiers[this.rarity].extraVision && (this.player.extraVision -= this.config.tiers[this.rarity].extraVision),
                    this.config.tiers[this.rarity].absorbsDamage) {
                        let t = 0;
                        this.player.absorbStacks.forEach((e => {
                            e.stacks.forEach((e => {
                                t += e.damagePerTick * e.remainingTicks
                            }
                            ))
                        }
                        )),
                        this.player.health.damage(t),
                        this.player.absorbStacks.delete(this.index)
                    }
                    this.config.attractsAggro && (this.player.aggroLevel -= this.rarity),
                    this.player.client && (this.player.client.camera.lightingBoost -= this.config.extraLighting)
                }
                get radianSlots() {
                    return this.clumps ? 1 : this.amount
                }
                update(t, e, i) {
                    let r = this.player.size + 52.5 * (this.config.huddles ? .65 : i);
                    !0 === this.config.wingMovement && this.player.attack && (r += (1 + Math.sin(performance.now() / 125 + this.index)) * (4 * this.player.size));
                    for (let i = 0; i < this.amount; i++) {
                        const o = this.petals[i];
                        if (o) {
                            if (0 !== this.config.tiers[this.rarity].constantHeal && this.player.health.ratio <= this.config.healWhenUnder && this.player.health.ratio > 0 && (!this.config.healsInDefense || !this.player.attack && this.player.defend) && (this.player.health.health = Math.min(this.player.health.maxHealth, this.player.health.health + this.config.tiers[this.rarity].constantHeal)),
                            this.config.healSpit && (o.range--,
                            o.range <= 0 && (o.range = this.config.healSpit.cooldown,
                            h.A.spatialHash.retrieve({
                                _AABB: {
                                    x1: this.player.x - this.config.healSpit.range,
                                    y1: this.player.y - this.config.healSpit.range,
                                    x2: this.player.x + this.config.healSpit.range,
                                    y2: this.player.y + this.config.healSpit.range
                                }
                            }).forEach((t => {
                                t.parent.id !== this.player.id || t.type !== s.wv.PLAYER || t.health.ratio >= 1 || (t.health.health = Math.min(t.health.maxHealth, t.health.health + this.config.healSpit.heal * Math.pow(s.z.HEALTH_SCALE, this.rarity)))
                            }
                            )))),
                            this.config.tiers[this.rarity].pentagramAbility && (o.range--,
                            o.range <= 0)) {
                                const t = this.config.tiers[this.rarity].pentagramAbility;
                                o.range = t.cooldown;
                                const e = o.findTarget(t.range, !0);
                                e && new A(this.player,e,25 * Math.pow(this.rarity + 1, 1.15),1e3,this.rarity).define(t.damage, t.poison.damage, t.poison.duration, t.speedDebuff.multiplier, t.speedDebuff.duration)
                            }
                            if (this.config.shootsOut > -1 && (o.range -= 3,
                            o.range <= 0 && (this.player.attack || this.player.defend))) {
                                const t = new g(this.player,-1,-1);
                                t.x = o.x,
                                t.y = o.y,
                                t.index = this.config.shootsOut;
                                const e = n.GJ[this.config.shootsOut]
                                  , i = e.tiers[this.rarity];
                                t.rarity = this.rarity,
                                t.size = e.sizeRatio * Math.pow(1.3, this.rarity),
                                t.health.set(i.health),
                                t.damage = i.damage,
                                t.speed = 0,
                                t.spinSpeed = 0,
                                t.launched = !0,
                                t.range = 100,
                                t.nullCollision = !0,
                                t.ignoreWalls = e.ignoreWalls,
                                i.poison && (t.poison.toApply.damage = i.poison.damage,
                                t.poison.toApply.timer = i.poison.duration),
                                e.enemySpeedDebuff && (t.speedDebuff.toApply.multiplier = e.enemySpeedDebuff.speedMultiplier,
                                t.speedDebuff.toApply.timer = e.enemySpeedDebuff.duration);
                                const s = Math.atan2(o.y - this.player.y, o.x - this.player.x);
                                t.velocity.x = Math.cos(s) * (this.player.attack ? 25 : 5),
                                t.velocity.y = Math.sin(s) * (this.player.attack ? 25 : 5),
                                o.health.health = 0
                            }
                            if (this.config.tiers[this.rarity].healing) {
                                let t = [];
                                h.A.spatialHash.retrieve({
                                    _AABB: {
                                        x1: this.player.x - 150,
                                        y1: this.player.y - 150,
                                        x2: this.player.x + 150,
                                        y2: this.player.y + 150
                                    }
                                }).forEach((e => {
                                    e.type !== s.wv.MOB && e.type !== s.wv.PETAL && e.team === this.player.team && t.push(e)
                                }
                                ));
                                let e = null;
                                if (this.player.health.ratio < 1)
                                    e = this.player;
                                else {
                                    let i = t.filter((t => t !== this.player && t.health?.ratio < 1));
                                    i.length > 0 && (e = i.sort(( (t, e) => (0,
                                    a.t1)(o, t) - (0,
                                    a.t1)(o, e)))[0])
                                }
                                if (e) {
                                    if (o.range--,
                                    o.moveAngle = Math.atan2(e.y - o.y, e.x - o.x),
                                    o.range <= 0) {
                                        (0,
                                        a.t1)(o, e) < e.size && (e.health.health = Math.min(e.health.maxHealth, e.health.health + this.config.tiers[this.rarity].healing),
                                        o.destroy());
                                        continue
                                    }
                                } else
                                    o.range = 22.5
                            }
                            if (this.config.tiers[this.rarity].shield > 0) {
                                let t = [];
                                h.A.spatialHash.retrieve({
                                    _AABB: {
                                        x1: this.player.x - 150,
                                        y1: this.player.y - 150,
                                        x2: this.player.x + 150,
                                        y2: this.player.y + 150
                                    }
                                }).forEach((e => {
                                    e.type !== s.wv.MOB && e.type !== s.wv.PETAL && e.team === this.player.team && t.push(e)
                                }
                                ));
                                let e = null;
                                if (this.player.health.shieldRatio < .95)
                                    e = this.player;
                                else {
                                    let i = t.filter((t => t !== this.player && t.health?.shieldRatio < .95));
                                    i.length > 0 && (e = i.sort(( (t, e) => (0,
                                    a.t1)(o, t) - (0,
                                    a.t1)(o, e)))[0])
                                }
                                if (e) {
                                    if (o.range--,
                                    o.moveAngle = Math.atan2(e.y - o.y, e.x - o.x),
                                    o.range <= 0) {
                                        (0,
                                        a.t1)(o, e) < e.size && (e.health.shield = Math.min(e.health.maxHealth, e.health.shield + this.config.tiers[this.rarity].shield),
                                        o.destroy());
                                        continue
                                    }
                                } else
                                    o.range = 22.5
                            }
                            if (!o.launched) {
                                let s = 0
                                  , a = 0;
                                if (this.clumps) {
                                    const n = e / t * Math.PI * 2 + this.player.petalRotation
                                      , h = this.player.x + Math.cos(n) * r
                                      , l = this.player.y + Math.sin(n) * r
                                      , d = i / this.amount * Math.PI * 2 - this.player.petalRotation;
                                    let c = 2.5 * o.size;
                                    2 === this.config.wingMovement && (c *= 1 + 4 * Math.sin(performance.now() / 125 + 5 * o.id)),
                                    s = h + Math.cos(d) * c,
                                    a = l + Math.sin(d) * c
                                } else {
                                    const n = (e + i) / t * Math.PI * 2 + this.player.petalRotation;
                                    s = this.player.x + Math.cos(n) * r,
                                    a = this.player.y + Math.sin(n) * r
                                }
                                const n = s - o.x
                                  , h = a - o.y;
                                o.moveStrength = Math.max(1, Math.cbrt(n * n + h * h) / o.speed),
                                o.moveAngle = Math.atan2(h, n)
                            }
                            if (this.config.launchable && !o.launched && (o.facing = (e + i) / t * Math.PI * 2 + this.player.petalRotation,
                            o.range -= 3,
                            (this.player.defend && 0 == this.config.launchedSpeed || this.player.attack) && o.range <= 0)) {
                                o.launched = !0,
                                o.speed *= this.config.launchedSpeed,
                                o.range = this.config.launchedRange;
                                const [t,e] = o.findTargetAngleWithinRadianArc(o.facing, 2 * Math.PI / (7.5 - .4 * this.rarity));
                                o.launchedAt = e,
                                o.moveAngle = t,
                                o.facing = o.moveAngle,
                                o.moveStrength = 1,
                                this.player.petalSlots[o.slotIndex].petals[o.petalIndex] = null,
                                o.slotIndex = -1,
                                o.petalIndex = -1
                            }
                            if (this.config.splits && (o.range -= 2,
                            o.range <= 0 && this.player.attack)) {
                                for (let t = 0; t < this.config.splits.count; t++) {
                                    const e = new g(this.player,-1,-1);
                                    e.rarity = this.rarity,
                                    e.index = this.config.splits.index,
                                    e.size = o.size / this.config.splits.count * 3,
                                    e.health.set(o.health.health),
                                    e.damage = o.damage,
                                    e.poison = o.poison,
                                    e.speed = .8 * o.speed,
                                    e.spinSpeed = o.spinSpeed,
                                    e.launched = !0,
                                    e.range = 100,
                                    e.facing = e.moveAngle = 2 * Math.PI / this.config.splits.count * t + o.facing + o.moveAngle,
                                    e.x = o.x,
                                    e.y = o.y
                                }
                                o.health.health = 0
                            }
                            if (!0 === this.config.wingMovement && (o.facing += .15),
                            this.config.tiers[this.rarity].spawnable && (o.range--,
                            o.range <= 0)) {
                                const t = new y(o);
                                t.parent = this.player,
                                t.team = this.player.team,
                                t.friendly = !0,
                                h.A.livingMobCount--,
                                t.define(n.ey[this.config.tiers[this.rarity].spawnable.index], this.config.tiers[this.rarity].spawnable.rarity),
                                t.health.maxHealth *= 6,
                                t.health.health *= 6,
                                this.boundMobs[i].push(t),
                                o.health.health = 0,
                                t.segmentBodies && t.segmentBodies.forEach((e => {
                                    e.size = t.size,
                                    e.health = t.health,
                                    e.damage = t.damage
                                }
                                ))
                            }
                        } else {
                            if (this.boundMobs[i].length > 0 && (this.boundMobs[i] = this.boundMobs[i].filter((t => t && !t.health.isDead)),
                            this.boundMobs[i].length > 0))
                                continue;
                            this.cooldowns[i]++,
                            this.cooldowns[i] >= this.config.cooldown && (this.petals[i] = new g(this.player,this.index,i),
                            this.petals[i].define(this.config, this.rarity),
                            this.cooldowns[i] = 0)
                        }
                    }
                    return this.clumps ? e + 1 : e + this.amount
                }
                get gui() {
                    return {
                        index: this.config.id,
                        rarity: this.rarity,
                        alive: this.petals.some((t => t?.health.ratio > 0)),
                        cooldown: Math.min(...this.cooldowns) / this.config.cooldown
                    }
                }
            }
            class d {
                constructor(t=1024, e=96, i=8) {
                    this.maxDamage = t,
                    this.ticks = e,
                    this.maxStacks = i,
                    this.stacks = []
                }
                addStack(t) {
                    return !(this.stacks.length >= this.maxStacks || t <= 0 || t >= this.maxDamage) && (this.stacks.push({
                        damagePerTick: t / this.ticks,
                        remainingTicks: this.ticks
                    }),
                    !0)
                }
                tick() {
                    let t = 0;
                    for (let e = 0; e < this.stacks.length; e++)
                        t += this.stacks[e].damagePerTick,
                        --this.stacks[e].remainingTicks <= 0 && this.stacks.splice(e--, 1);
                    return t
                }
            }
            class c {
                static idAccumulator = 1;
                constructor(t={
                    x: 0,
                    y: 0
                }) {
                    this.id = c.idAccumulator++,
                    this.parent = this,
                    this.x = t.x,
                    this.y = t.y,
                    this.size = 20,
                    this.width = 1,
                    this.height = 1,
                    this.facing = 0,
                    this.speed = 4,
                    this.velocity = new r(0,0),
                    this.health = new o(10),
                    this.type = s.wv.STANDARD,
                    this.friction = .5,
                    this.damage = 5,
                    this.pushability = 1,
                    this.density = 1,
                    this.damageReflection = {
                        reflection: 0,
                        cap: 0
                    },
                    this.healBack = 0,
                    this.aggroLevel = 0,
                    this.canBeViewed = !0,
                    this.nullCollision = !1,
                    this.hit = 0,
                    this.collisionIDs = new Set,
                    this.damagedBy = {},
                    this.speedDebuff = {
                        multiplier: 1,
                        timer: 0,
                        toApply: {
                            multiplier: 1,
                            timer: 0
                        }
                    },
                    this.poison = {
                        damage: 0,
                        timer: 0,
                        toApply: {
                            damage: 0,
                            timer: 0
                        }
                    },
                    this.absorbStacks = new Map,
                    this.lastGoodPosition = {
                        x: this.x,
                        y: this.y
                    },
                    this.guns = [],
                    h.A.entities.set(this.id, this)
                }
                bindToRoom() {
                    if (h.A.isRadial) {
                        const t = Math.atan2(this.y, this.x)
                          , e = this.x * this.x + this.y * this.y
                          , i = h.A.width / 2;
                        if (e > i * i) {
                            const e = Math.sqrt(i * i - 1);
                            this.x = Math.cos(t) * e,
                            this.y = Math.sin(t) * e
                        }
                    } else
                        this.x = Math.max(-h.A.width / 2, Math.min(h.A.width / 2, this.x)),
                        this.y = Math.max(-h.A.height / 2, Math.min(h.A.height / 2, this.y))
                }
                findTarget(t, e=!1) {
                    const i = h.A.spatialHash.retrieve({
                        _AABB: {
                            x1: this.x - t,
                            y1: this.y - t,
                            x2: this.x + t,
                            y2: this.y + t
                        }
                    });
                    if (e) {
                        const t = [];
                        return i.forEach((e => {
                            e.parent.id !== this.parent.id && e.parent.team !== this.parent.team && e.type !== s.wv.PETAL && t.push(e)
                        }
                        )),
                        t[Math.floor(Math.random() * t.length)]
                    }
                    {
                        const t = [];
                        return i.forEach((e => {
                            e.parent.id !== this.parent.id && e.parent.team !== this.parent.team && e.type !== s.wv.PETAL && t.push(e)
                        }
                        )),
                        t.sort(( (t, e) => (0,
                        a.t1)(this, t) - (0,
                        a.t1)(this, e))).sort(( (t, e) => e.parent.aggroLevel - t.parent.aggroLevel))[0] || null
                    }
                }
                update() {
                    if (this.health.isDead)
                        this.destroy();
                    else {
                        if (this.poison.timer > 0 && (this.health.damage(this.poison.damage),
                        this.poison.timer--),
                        this.absorbStacks.size > 0) {
                            let t = 0;
                            this.absorbStacks.forEach((e => {
                                t += e.tick()
                            }
                            )),
                            this.health.damage(t)
                        }
                        this.speedDebuff.timer > 0 && (this.velocity.multiply(this.speedDebuff.multiplier),
                        this.speedDebuff.timer--),
                        this.x += this.velocity.x,
                        this.y += this.velocity.y,
                        this.speedDebuff.timer > 0 && this.velocity.divide(this.speedDebuff.multiplier),
                        this.velocity.multiply(this.friction),
                        this._AABB = h.A.spatialHash.getAABB(this),
                        this.canBeViewed && h.A.viewsSpatialHash.insert(this),
                        h.A.spatialHash.insert(this),
                        this.collisionIDs.clear(),
                        this.hit = Math.max(0, this.hit - 1),
                        this.dandelionCooldown > 0 && this.dandelionCooldown--
                    }
                }
                collide() {
                    h.A.spatialHash.retrieve(this).forEach((t => {
                        if (this.collisionIDs.has(t.id) || t.collisionIDs.has(this.id) || this.id === t.id || this.parent.id === t.parent.id && this.type !== t.type)
                            return;
                        if (this.collisionIDs.add(t.id),
                        t.collisionIDs.add(this.id),
                        this.parent.team === t.parent.team && (this.type === s.wv.PETAL || t.type === s.wv.PETAL || this.type === s.wv.PLAYER && t.type === s.wv.MOB || t.type === s.wv.PLAYER && this.type === s.wv.MOB))
                            return;
                        if (this.type === s.wv.MOB && t.type === s.wv.MOB && this.team === t.team && this.segmentID > -1 && t.segmentID > -1 && this.segmentID === t.segmentID)
                            return;
                        const e = this.x - t.x
                          , i = this.y - t.y
                          , a = e * e + i * i;
                        if (!(0 === a || this.size + t.size < Math.sqrt(a))) {
                            if (this.parent.team !== t.parent.team && !this.spawnInvincibility && !t.spawnInvincibility) {
                                if (!this.nullCollision && !t.nullCollision) {
                                    let e = 0
                                      , i = 0;
                                    if (i += this.damage,
                                    e += t.damage,
                                    i -= t.armor,
                                    e -= this.armor,
                                    this.type === s.wv.PETAL && this.parent?.type === s.wv.PLAYER) {
                                        let t = this.velocity.magnitude;
                                        if (t > 4.5) {
                                            let e = 1 - Math.exp(.008 * -(t - 4.5));
                                            e = Math.min(e, .2351),
                                            Math.random() < e && (i *= 1.45)
                                        }
                                    }
                                    if (t.type === s.wv.PETAL && t.parent?.type === s.wv.PLAYER) {
                                        let i = t.velocity.magnitude;
                                        if (i > 4.5) {
                                            let t = 1 - Math.exp(.008 * -(i - 4.5));
                                            t = Math.min(t, .2351),
                                            Math.random() < t && (e *= 1.45)
                                        }
                                    }
                                    if (this.extraDamage && t.health.ratio > this.extraDamage.minHp && t.health.ratio < this.extraDamage.maxHp && (i += this.damage * this.extraDamage.multiplier),
                                    t.extraDamage && this.health.ratio > t.extraDamage.minHp && this.health.ratio < t.extraDamage.maxHp && (e += t.damage * t.extraDamage.multiplier),
                                    this.absorbStacks.size > 0) {
                                        let t = !1;
                                        this.absorbStacks.forEach((i => {
                                            !t && i.addStack(e) && (t = !0)
                                        }
                                        )),
                                        t || this.health.damage(e)
                                    } else
                                        this.health.damage(e);
                                    if (t.absorbStacks.size > 0) {
                                        let e = !1;
                                        t.absorbStacks.forEach((t => {
                                            !e && t.addStack(i) && (e = !0)
                                        }
                                        )),
                                        e || t.health.damage(i)
                                    } else
                                        t.health.damage(i);
                                    if ("Starfish" === this.config?.name && this.type === s.wv.MOB && "Dandelion" === t.config?.name && (this.dandelionCooldown = 1 + .5 * t.rarity),
                                    this.damageReflection?.reflection > 0 && !t.parent.spawnInvincibility && (this.damageReflection.cap > 0 ? t.parent.health.damage(Math.min(t.parent.health.maxHealth * this.damageReflection.cap, this.damageReflection.reflection * e)) : t.parent.health.damage(this.damageReflection.reflection * e)),
                                    t.damageReflection?.reflection > 0 && !this.parent.spawnInvincibility && (t.damageReflection.cap > 0 ? this.parent.health.damage(Math.min(this.parent.health.maxHealth * t.damageReflection.cap, t.damageReflection.reflection * i)) : this.parent.health.damage(t.damageReflection.reflection * i)),
                                    0 !== this.healBack && (this.parent.health.health = Math.min(this.parent.health.maxHealth, this.parent.health.health + this.healBack * i)),
                                    0 !== t.healBack && (t.parent.health.health = Math.min(t.parent.health.maxHealth, t.parent.health.health + t.healBack * e)),
                                    Number.isFinite(this.health?.health) && Number.isFinite(t.health?.health) && (this.hit = 3,
                                    t.hit = 3),
                                    this.type === s.wv.MOB && this.neutral && (this.target = t.parent),
                                    t.type === s.wv.MOB && t.neutral && (t.target = this.parent),
                                    this.type === s.wv.PLAYER || this.type === s.wv.MOB)
                                        if (this.parent && "Leech" === this.config?.name) {
                                            let e = this.parent.damagedBy[t.parent.id] || [0, t.parent.type, t.parent.type === s.wv.PLAYER ? t.parent.name : t.parent.index, t.parent.type === s.wv.PLAYER && t.parent.client ? t.parent.client.id : null];
                                            e[0] += t.damage,
                                            this.parent.damagedBy[t.parent.id] = e
                                        } else {
                                            let e = this.damagedBy[t.parent.id] || [0, t.parent.type, t.parent.type === s.wv.PLAYER ? t.parent.name : t.parent.index, t.parent.type === s.wv.PLAYER && t.parent.client ? t.parent.client.id : null];
                                            e[0] += t.damage,
                                            this.damagedBy[t.parent.id] = e
                                        }
                                    if (t.type === s.wv.PLAYER || t.type === s.wv.MOB)
                                        if (t.parent && "Leech" === t.config?.name) {
                                            let e = t.parent.damagedBy[this.parent.id] || [0, this.parent.type, this.parent.type === s.wv.PLAYER ? this.parent.name : this.parent.index, this.parent.type === s.wv.PLAYER && this.parent.client ? this.parent.client.id : null];
                                            e[0] += this.damage,
                                            t.parent.damagedBy[this.parent.id] = e
                                        } else {
                                            let e = t.damagedBy[this.parent.id] || [0, this.parent.type, this.parent.type === s.wv.PLAYER ? this.parent.name : this.parent.index, this.parent.type === s.wv.PLAYER && this.parent.client ? this.parent.client.id : null];
                                            e[0] += this.damage,
                                            t.damagedBy[this.parent.id] = e
                                        }
                                    this.type === s.wv.PLAYER && this.petalSlots.forEach((t => {
                                        t.petals.forEach((t => {
                                            t?.lightning?.lightningOnParentHit && (new w(this).define(t.lightning.damage, t.lightning.range, t.lightning.bounces, t.rarity).bounce(),
                                            t.lightning.chargesLeft--,
                                            t.health.health = t.health.maxHealth / t.lightning.charges * t.lightning.chargesLeft)
                                        }
                                        ))
                                    }
                                    )),
                                    this.type === s.wv.PETAL && null !== this.lightning && this.lightning.chargesLeft > 0 && !this.lightning.lightningOnParentHit && (new w(this.parent).define(this.lightning.damage, this.lightning.range, this.lightning.bounces).bounce(),
                                    this.lightning.charges > 1 && (this.lightning.chargesLeft--,
                                    this.health.health = this.health.maxHealth / this.lightning.charges * this.lightning.chargesLeft)),
                                    t.type === s.wv.PLAYER && t.petalSlots.forEach((e => {
                                        e.petals.forEach((e => {
                                            e?.lightning?.lightningOnParentHit && (new w(t).define(e.lightning.damage, e.lightning.range, e.lightning.bounces, e.rarity).bounce(),
                                            e.lightning.chargesLeft--,
                                            e.health.health = e.health.maxHealth / e.lightning.charges * e.lightning.chargesLeft)
                                        }
                                        ))
                                    }
                                    )),
                                    t.type === s.wv.PETAL && null !== t.lightning && t.lightning.chargesLeft > 0 && !t.lightning.lightningOnParentHit && (new w(t.parent).define(t.lightning.damage, t.lightning.range, t.lightning.bounces).bounce(),
                                    t.lightning.charges > 1 && (t.lightning.chargesLeft--,
                                    t.health.health = t.health.maxHealth / t.lightning.charges * t.lightning.chargesLeft))
                                }
                                this.speedDebuff.toApply.timer > 0 && (t.speedDebuff.multiplier = this.speedDebuff.toApply.multiplier,
                                t.speedDebuff.timer = this.speedDebuff.toApply.timer),
                                t.speedDebuff.toApply.timer > 0 && (this.speedDebuff.multiplier = t.speedDebuff.toApply.multiplier,
                                this.speedDebuff.timer = t.speedDebuff.toApply.timer),
                                this.poison.toApply.timer > 0 && (t.poison.damage = this.poison.toApply.damage,
                                t.poison.timer = this.poison.toApply.timer),
                                t.poison.toApply.timer > 0 && (this.poison.damage = t.poison.toApply.damage,
                                this.poison.timer = t.poison.toApply.timer)
                            }
                            if (!(this.nullCollision || t.nullCollision || this.phases || t.phases)) {
                                const s = Math.atan2(i, e)
                                  , n = this.size + t.size
                                  , h = n - Math.sqrt(a)
                                  , r = this.size / n
                                  , o = t.size / n;
                                this.velocity.x += Math.cos(s) * h * this.pushability * t.density * o,
                                this.velocity.y += Math.sin(s) * h * this.pushability * t.density * o,
                                t.velocity.x -= Math.cos(s) * h * t.pushability * this.density * r,
                                t.velocity.y -= Math.sin(s) * h * t.pushability * this.density * r
                            }
                        }
                    }
                    ))
                }
                collideTerrain() {
                    const t = h.A.terrainSpatialHash.retrieve(this)
                      , e = [];
                    if (t.forEach((t => {
                        if (t.polygon.circleIntersects(this.x, this.y, this.size)) {
                            const i = t.polygon.resolve(this.x, this.y, this.size);
                            this.x = i.x,
                            this.y = i.y,
                            this.config?.bumblebeeMovement && (this.movementAngle = Math.random() * Math.PI * 2),
                            e.push(t)
                        }
                    }
                    )),
                    e.length > 0 ? this.velocity.multiply(.5) : this.lastGoodPosition = {
                        x: this.x,
                        y: this.y
                    },
                    2 === e.length) {
                        const t = Math.abs(e[0].gridX - e[1].gridX)
                          , i = Math.abs(e[0].gridY - e[1].gridY);
                        if (t === i || t > 1 || i > 1)
                            return;
                        const s = {
                            x: 0,
                            y: 0,
                            size: 0
                        };
                        for (const t of e)
                            s.x += t.x,
                            s.y += t.y,
                            s.size += t.size;
                        s.x /= e.length,
                        s.y /= e.length,
                        s.size /= e.length;
                        const a = this.x - s.x
                          , n = this.y - s.y;
                        if (Math.sqrt(a * a + n * n) < this.size)
                            return;
                        const h = Math.atan2(this.y - s.y, this.x - s.x);
                        this.x = s.x + Math.cos(h) * (s.size + this.size + 3),
                        this.y = s.y + Math.sin(h) * (s.size + this.size + 3)
                    }
                    let i = this.x > -h.A.width / 2 && this.x < h.A.width / 2 && this.y > -h.A.height / 2 && this.y < h.A.height / 2;
                    i && (this._AABB = h.A.spatialHash.getAABB(this),
                    h.A.terrainSpatialHash.retrieve(this).forEach((t => {
                        i && t.polygon.circleIntersects(this.x, this.y, this.size) && (i = !1)
                    }
                    ))),
                    i || (this.x = this.lastGoodPosition.x,
                    this.y = this.lastGoodPosition.y)
                }
                getTopDamagers(t=3, e=-1) {
                    const i = [];
                    for (const t in this.damagedBy) {
                        const [a,h,r,o] = this.damagedBy[t];
                        -1 !== e && h !== e || (h !== s.wv.PLAYER || i.some((t => t.clientID === o)) || i.push({
                            id: +t,
                            type: h,
                            damage: a,
                            name: r,
                            clientID: o
                        }),
                        h === s.wv.MOB && i.push({
                            id: +t,
                            type: h,
                            damage: a,
                            name: n.ey[r].name
                        }))
                    }
                    return i.sort(( (t, e) => e.damage - t.damage)),
                    i.slice(0, t)
                }
                destroy() {
                    this.health.health = 0,
                    h.A.entities.delete(this.id),
                    h.A.isWaves && (h.A.aliveMobs = h.A.aliveMobs.filter((t => t.id !== this.id)))
                }
            }
            class g extends c {
                constructor(t, e, i) {
                    super(t),
                    this.parent = t,
                    this.slotIndex = e,
                    this.petalIndex = i,
                    this.moveAngle = 0,
                    this.moveDist = 1,
                    this.speed = 6,
                    this.size = 7.5,
                    this.health.set(10),
                    this.type = s.wv.PETAL,
                    this.friction = .7,
                    this.index = 0,
                    this.spinSpeed = .1,
                    this.launched = !1,
                    this.range = 33.75,
                    this.moveStrength = 1,
                    this.launchedAt = null,
                    this.attractsLightning = !1,
                    this.placeDown = !1,
                    this.rarity = 0,
                    this.armor = 0,
                    this.lightning = null,
                    this.burst = !1,
                    this.faceInRelation = !1,
                    this.ignoreWalls = !1
                }
                define(t, e) {
                    const i = t.tiers[e];
                    this.rarity = e,
                    this.health.set(i.health),
                    this.damage = i.damage,
                    this.config = t,
                    this.size *= t.sizeRatio,
                    this.index = t.id,
                    this.spinSpeed = t.launchable ? 0 : .1,
                    this.armor = 0,
                    t.enemySpeedDebuff && (this.speedDebuff.toApply.multiplier = t.enemySpeedDebuff.speedMultiplier,
                    this.speedDebuff.toApply.timer = t.enemySpeedDebuff.duration),
                    i.poison && (this.poison.toApply.damage = i.poison.damage,
                    this.poison.toApply.timer = i.poison.duration),
                    i.spawnable && (this.range = i.spawnable.timer,
                    this.spinSpeed = 0),
                    i.lightning && (this.lightning = i.lightning,
                    this.lightning.chargesLeft = i.lightning.charges),
                    t.canPlaceDown && (this.placeDown = !0),
                    i.density && (this.density = i.density),
                    t.phases && (this.health.invulnerable = !0,
                    this.phases = !0),
                    this.attractsLightning = t.attractsLightning,
                    i.boost && (this.burst = {
                        speed: i.boost.length,
                        ticks: i.boost.delay
                    }),
                    t.healWhenUnder < 1 && (this.spinSpeed = 0),
                    "Starfish" === t.name && (this.faceInRelation = 0),
                    i.healBack && (this.healBack = i.healBack),
                    t.extraDamage && (this.extraDamage = t.extraDamage),
                    0 !== i.armor && (this.armor = i.armor),
                    !t.wearable && i.damageReflection?.reflection > 0 && (this.damageReflection = {
                        reflection: i.damageReflection.reflection,
                        cap: i.damageReflection.cap
                    }),
                    this.ignoreWalls = t.ignoreWalls
                }
                findTargetAngleWithinRadianArc(t, e) {
                    let i = t
                      , n = 1 / 0
                      , r = null;
                    return h.A.entities.forEach((h => {
                        if (h.parent.id === this.parent.id || h.parent.team === this.parent.team || h.type === s.wv.PETAL)
                            return;
                        const o = Math.atan2(h.y - this.y, h.x - this.x);
                        if (Math.abs((0,
                        a.FL)(t, o)) > e / 2)
                            return;
                        const l = this.x - h.x
                          , d = this.y - h.y
                          , c = l * l + d * d;
                        c < n && (i = o,
                        n = c,
                        r = h)
                    }
                    )),
                    [i, r]
                }
                update() {
                    if (this.dandelionBind)
                        return this.x = this.dandelionBind.x + Math.cos(this.facing) * (this.size + 1.2 * this.dandelionBind.size),
                        this.y = this.dandelionBind.y + Math.sin(this.facing) * (this.size + 1.2 * this.dandelionBind.size),
                        super.update();
                    if (!1 !== this.burst && (this.burst.ticks--,
                    this.parent.type === s.wv.PLAYER && this.parent.defend && this.burst.ticks <= 0)) {
                        const t = Math.atan2(this.parent.y - this.y, this.parent.x - this.x)
                          , e = this.burst.speed / this.parent.friction;
                        return this.parent.velocity.x += Math.cos(t) * e,
                        this.parent.velocity.y += Math.sin(t) * e,
                        void this.destroy()
                    }
                    if (this.launched && null !== this.launchedAt && !this.launchedAt.health.isDead && (this.moveAngle = (0,
                    a.nU)(this.moveAngle, Math.atan2(this.launchedAt.y - this.y, this.launchedAt.x - this.x), .35),
                    this.facing = this.moveAngle),
                    this.placeDown && this.parent.attack)
                        return super.update();
                    this.velocity.x += Math.cos(this.moveAngle) * this.speed * this.moveStrength,
                    this.velocity.y += Math.sin(this.moveAngle) * this.speed * this.moveStrength,
                    this.facing += this.spinSpeed,
                    !1 !== this.faceInRelation && (this.facing = Math.atan2(this.y - this.parent.y, this.x - this.parent.x) + this.faceInRelation),
                    this.launched && (this.range--,
                    this.range <= 0) ? this.destroy() : super.update()
                }
                collide() {
                    if (this.launched && !1 === this.ignoreWalls) {
                        h.A.terrainSpatialHash.retrieve(this).forEach((t => {
                            t.polygon.circleIntersects(this.x, this.y, this.size) && this.destroy()
                        }
                        ))
                    }
                    super.collide()
                }
                destroy() {
                    this.slotIndex > -1 && (this.parent.petalSlots[this.slotIndex].petals[this.petalIndex] = null),
                    super.destroy()
                }
            }
            class p extends c {
                constructor(t={
                    x: 0,
                    y: 0
                }) {
                    super(t),
                    this.name = "guest",
                    this.nameColor = "#FFFFFF",
                    this.type = s.wv.PLAYER,
                    this.team = this.id,
                    this.health.set(40),
                    this.moveAngle = 0,
                    this.moveStrength = 0,
                    this.attack = !1,
                    this.defend = !1,
                    this.petalRotation = 0,
                    this.size = 17,
                    this.extraPickupRange = 0,
                    this.armor = 0,
                    this.petalSlots = [],
                    this.initSlots(5),
                    this.client = null,
                    this.wearing = [],
                    this.extraVision = 0,
                    this.lightVision = 2
                }
                get level() {
                    return this.client ? this.client.level : 1
                }
                get rarity() {
                    if (this.client)
                        return this.client.highestRarity;
                    let t = 0;
                    return this.petalSlots.forEach((e => {
                        t = Math.max(t, e.rarity)
                    }
                    )),
                    t
                }
                initSlots(t) {
                    if (t > this.petalSlots.length) {
                        for (let e = this.petalSlots.length; e < t; e++)
                            if (this.client?.slots[e]) {
                                const t = new l(this,e);
                                t.define(n.GJ[0], 0),
                                this.petalSlots.push(t)
                            }
                    } else
                        for (let e = this.petalSlots.length - 1; e >= t; e--)
                            this.petalSlots[e].destroy(),
                            this.petalSlots.pop()
                }
                setSlot(t, e, i) {
                    this.petalSlots[t] && (this.petalSlots[t].destroy(),
                    this.petalSlots[t].define(n.GJ[e], i))
                }
                update() {
                    if (this.health.isDead)
                        for (const t of this.petalSlots)
                            if (t.config.tiers[t.rarity].deathDefying?.duration > 0 && t.petals.some((t => t && !t.health.isDead))) {
                                this.health.health = Math.min(t.config.tiers[t.rarity].deathDefying.health * this.health.maxHealth, this.health.maxHealth),
                                t.petals.forEach((t => t?.destroy())),
                                this.health.invulnerable || (this.health.invulnerable = !0,
                                setTimeout(( () => this.health.invulnerable = !1), 1e3 * t.config.tiers[t.rarity].deathDefying.duration));
                                break
                            }
                    this.health.shield > 0 && this.health.deteriorateShield(),
                    this.velocity.x += Math.cos(this.moveAngle) * this.moveStrength,
                    this.velocity.y += Math.sin(this.moveAngle) * this.moveStrength,
                    this.bindToRoom(),
                    this.facing = this.moveAngle,
                    super.update(),
                    this.health.lastDamaged + 15e3 < Date.now() && (this.health.health = Math.min(this.health.maxHealth, this.health.health + .0025 * this.health.maxHealth))
                }
                collide() {
                    super.collide(),
                    this.collideTerrain();
                    let t = 0
                      , e = 0
                      , i = 0;
                    const s = this.petalSlots.reduce(( (t, s) => (s.config.yinYangMovement && e++,
                    s.config.tiers[s.rarity].extraRange > i && (i = s.config.tiers[s.rarity].extraRange),
                    t + s.radianSlots)), 0);
                    let a = 1;
                    a = e % 3 == 0 ? 1 : e % 3 == 1 ? -1 : 0,
                    this.petalRotation += .125 * a,
                    this.extraPickupRange = 0;
                    const n = (1 + .5 * this.attack - .4 * this.defend) * (1 + i * this.attack);
                    this.petalSlots.forEach((e => {
                        t = e.update(s, t, n),
                        e.config.tiers[e.rarity].extraRadians && (this.petalRotation += e.config.tiers[e.rarity].extraRadians * a),
                        this.extraPickupRange = Math.max(this.extraPickupRange, e.config.tiers[e.rarity].extraPickupRange)
                    }
                    ))
                }
                destroy() {
                    if (this.petalSlots.forEach((t => t.destroy())),
                    super.destroy(),
                    null !== this.client) {
                        const t = this.getTopDamagers(10)
                          , e = []
                          , i = {}
                          , n = this.petalSlots.reduce(( (t, e) => t + Math.pow(e.rarity + 1, 3)), 0);
                        this.client.addXP(.1 * -Math.random() * this.client.xp),
                        t.forEach((t => {
                            if (t.type === s.wv.PLAYER && (e.push(t.name),
                            null !== t.clientID)) {
                                const e = h.A.clients.get(t.clientID);
                                e && e.addXP(n)
                            }
                            t.type === s.wv.MOB && (i[t.name] = (i[t.name] || 0) + 1)
                        }
                        ));
                        const r = [...e, ...Object.entries(i).map(( ([t,e]) => (1 === e ? "a" : e) + " " + (e > 1 ? (0,
                        a.TH)(t) : t)))];
                        let o = "You were killed by ";
                        r.length > 0 ? o += r.slice(0, -1).join(", ") + (r.length > 1 ? " and " : "") + r[r.length - 1] : o += '"the game"',
                        this.client.talk(s.de.DEATH, o),
                        this.client.body = null,
                        h.A.alivePlayers = h.A.alivePlayers.filter((t => t.id !== this.client.id))
                    }
                }
            }
            class m {
                constructor(t) {
                    this.id = t,
                    this.body = null,
                    this.camera = {
                        lightingBoost: 1
                    },
                    this.level = 1,
                    this.xp = 1,
                    this.slots = new Array(5).fill(null).map(( () => ({
                        id: 0,
                        rarity: 2
                    }))),
                    this.secondarySlots = new Array(5).fill(null).map(( () => null))
                }
                talk() {}
                addXP(t) {
                    if (!Number.isFinite(t))
                        return;
                    for (this.xp += t; this.xp < (0,
                    a.UU)(this.level - 1); )
                        this.level--,
                        this.body && !this.body.health.isDead && (this.body.health.set(this.healthAdjustement + this.body.petalSlots.reduce(( (t, e) => t + e.config.tiers[e.rarity].extraHealth), 0)),
                        this.body.damage = this.bodyDamageAdjustment);
                    for (; this.xp >= (0,
                    a.UU)(this.level); )
                        this.level++,
                        this.body && !this.body.health.isDead && (this.body.health.set(this.healthAdjustement + this.body.petalSlots.reduce(( (t, e) => t + e.config.tiers[e.rarity].extraHealth), 0)),
                        this.body.damage = this.bodyDamageAdjustment);
                    let e = 5 + Math.min(5, Math.floor(this.level / 10));
                    if (e !== this.slots.length)
                        if (e > this.slots.length)
                            for (let t = this.slots.length; t < e; t++)
                                this.slots.push({
                                    id: 0,
                                    rarity: 0
                                }),
                                this.secondarySlots.push(null);
                        else if (e < this.slots.length)
                            for (let t = this.slots.length - 1; t >= e; t--)
                                this.slots.pop(),
                                this.secondarySlots.pop();
                    this.body && !this.body.health.isDead && this.body.initSlots(e)
                }
                get healthAdjustement() {
                    return 40 + 5 * Math.pow(this.level, 1.5)
                }
                get bodyDamageAdjustment() {
                    return 5 + 1 * Math.pow(this.level, 1.5)
                }
                get highestRarity() {
                    let t = 0;
                    for (const e of this.slots)
                        e.rarity > t && (t = e.rarity);
                    for (const e of this.secondarySlots)
                        e && e.rarity > t && (t = e.rarity);
                    return t
                }
            }
            class u extends p {
                static names = ["Abe", "Abraham", "Adam", "Adrian", "Al", "Alan", "Albert", "Alex", "Alexander", "Alfred", "Allan", "Allen", "Alvin", "Andre", "Andrew", "Andy", "Anthony", "Antonio", "Archie", "Arnold", "Arthur", "Austin", "Barry", "Ben", "Benjamin", "Bernard", "Bill", "Billy", "Bob", "Bobby", "Brad", "Bradley", "Brandon", "Brent", "Brett", "Brian", "Bruce", "Bryan", "Calvin", "Carl", "Cary", "Casey", "Cecil", "Chad", "Charles", "Charlie", "Chester", "Chris", "Christian", "Christopher", "Chuck", "Clarence", "Clifford", "Clint", "Clyde", "Cody", "Colin", "Corey", "Craig", "Curtis", "Dale", "Dan", "Daniel", "Danny", "Darrell", "Darren", "Dave", "David", "Dean", "Dennis", "Derek", "Derrick", "Don", "Donald", "Doug", "Douglas", "Duane", "Dustin", "Dwayne", "Dwight", "Dylan", "Earl", "Ed", "Eddie", "Edgar", "Edward", "Edwin", "Eli", "Eric", "Ernest", "Eugene", "Evan", "Floyd", "Francis", "Frank", "Franklin", "Fred", "Freddie", "Gabriel", "Garry", "Gary", "Gene", "Geoffrey", "George", "Gerald", "Gilbert", "Glen", "Glenn", "Gordon", "Greg", "Gregory", "Guy", "Harold", "Harry", "Harvey", "Henry", "Herbert", "Homer", "Horace", "Howard", "Hugh", "Ian", "Ira", "Isaac", "Jack", "Jacob", "Jake", "James", "Jamie", "Jason", "Jay", "Jeff", "Jeffery", "Jeffrey", "Jeremiah", "Jeremy", "Jerome", "Jerry", "Jesse", "Jim", "Jimmy", "Joe", "Joel", "John", "Johnny", "Jon", "Jonathan", "Jordan", "Jose", "Joseph", "Josh", "Joshua", "Juan", "Julian", "Justin", "Karl", "Keith", "Ken", "Kenneth", "Kenny", "Kent", "Kevin", "Kirk", "Kurt", "Kyle", "Lance", "Larry", "Lawrence", "Lee", "Leo", "Leon", "Leonard", "Leroy", "Leslie", "Lewis", "Lloyd", "Lonnie", "Louis", "Lucas", "Luther", "Marc", "Marcus", "Mario", "Marion", "Mark", "Marshall", "Martin", "Marvin", "Matt", "Matthew", "Maurice", "Max", "Melvin", "Michael", "Micheal", "Mike", "Mitchell", "Nathan", "Nathaniel", "Neil", "Nelson", "Nicholas", "Norman", "Oliver", "Oscar", "Otis", "Patrick", "Paul", "Perry", "Peter", "Phil", "Philip", "Phillip", "Ralph", "Randall", "Randy", "Ray", "Raymond", "Reginald", "Rex", "Richard", "Rick", "Rickey", "Ricky", "Robert", "Rodney", "Roger", "Ron", "Ronald", "Ronnie", "Ross", "Roy", "Russell", "Ryan", "Sam", "Samuel", "Scott", "Sean", "Seth", "Shane", "Shannon", "Shaun", "Shawn", "Sidney", "Stanley", "Stephen", "Steve", "Steven", "Ted", "Terry", "Theodore", "Thomas", "Tim", "Timothy", "Todd", "Tom", "Tommy", "Tony", "Tracy", "Travis", "Troy", "Tyler", "Tyrone", "Vernon", "Victor", "Vincent", "Virgil", "Wade", "Wallace", "Walter", "Warren", "Wayne", "Wesley", "Willard", "William", "Willie", "Zachary", "Zane", "Thot Clapper", "Grim Reaper", "real dev", "fake dev", "the void", "&#*!@$^*&$", "error 404", "ej", "Amara", "Lucifer", "Castiel"];
                constructor(t={
                    x: 0,
                    y: 0
                }, e=0, i=5) {
                    super(t),
                    this.team = -69,
                    this.target = null,
                    this.targetTick = 0,
                    this.randomMovementTick = 0,
                    this.name = ":" + u.names[Math.floor(Math.random() * u.names.length)] + ":",
                    this.client = new m(1024 + this.id),
                    this.client.body = this,
                    this.client.addXP((0,
                    a.UU)(i) + 1),
                    this.index = 255;
                    for (let t = 0; t < this.petalSlots.length; t++) {
                        const i = Math.max(0, e - 2 * Math.random() | 0)
                          , s = (0,
                        n.hf)(e);
                        this.client.slots[t] = {
                            id: s,
                            rarity: i
                        },
                        this.petalSlots[t].define(n.GJ[s], i)
                    }
                    h.A.livingMobCount++,
                    h.A.isWaves && h.A.aliveMobs.push(this)
                }
                update() {
                    this.target && this.target.health.isDead && (this.target = null),
                    this.target ? (this.moveAngle = Math.atan2(this.target.y - this.y, this.target.x - this.x),
                    this.moveStrength = this.speed,
                    this.health.ratio < .334 ? (this.defend = !0,
                    this.attack = !1,
                    this.moveAngle += Math.PI + .5 * Math.sin(performance.now() / 2500)) : (this.defend = !1,
                    this.attack = !0)) : this.attack = this.defend = !1,
                    super.update()
                }
                collide() {
                    super.collide(),
                    this.targetTick-- <= 0 && (this.targetTick = 30,
                    this.target = this.findTarget(1024, !0))
                }
                destroy() {
                    super.destroy(),
                    h.A.isWaves && (h.A.aliveMobs = h.A.aliveMobs.filter((t => t.id !== this.id))),
                    h.A.livingMobCount--;
                    this.getTopDamagers(10).filter((t => t.type === s.wv.PLAYER)).forEach((t => {
                        const e = h.A.clients.get(t.clientID);
                        if (e)
                            for (let t = 0; t < this.petalSlots.length; t++)
                                Math.random() < .85 || new f({
                                    x: this.x + 75 * Math.random() - 37.5,
                                    y: this.y + 75 * Math.random() - 37.5
                                },e,this.petalSlots[t].config.id,Math.min(e.highestRarity + 1, this.petalSlots[t].rarity))
                    }
                    ))
                }
            }
            class y extends c {
                static segmentedLength = 0;
                static TEMPORARY_RANDOM_RARITY() {
                    const t = Math.random();
                    return t > .99995 ? 5 : t > .995 ? 4 : t > .9 ? 3 : t > .8 ? 2 : t > .6 ? 1 : 0
                }
                constructor(t={
                    x: 0,
                    y: 0
                }) {
                    super(t),
                    this.type = s.wv.MOB,
                    this.index = 0,
                    this.rarity = 0,
                    this.facing = Math.random() * Math.PI * 2,
                    this.movementAngle = Math.random() * Math.PI * 2,
                    this.moveStrength = 0,
                    this.tick = 0,
                    this.team = -69,
                    this.aggressive = !1,
                    this.neutral = !1,
                    this.head = null,
                    this.target = null,
                    this.targetTick = 0,
                    this.extraTicker = 0,
                    this.projectile = null,
                    this.givesXP = !0,
                    h.A.livingMobCount++,
                    this.config = n.ey[0],
                    this.lastSeen = performance.now() + 1e4,
                    this.hatchable = null,
                    this.poopable = null,
                    this.deathEvent = null,
                    this.movesInBursts = !1,
                    this.spins = {
                        rate: 0,
                        constant: !1
                    },
                    this.fleeAtLowHealth = 0,
                    this.healing = 0,
                    this.segmentID = -1,
                    this.ropeBodies = null,
                    this._countsTowardsMobCount = !0
                }
                get countsTowardsMobCount() {
                    return this._countsTowardsMobCount
                }
                set countsTowardsMobCount(t) {
                    const e = this._countsTowardsMobCount;
                    e !== t && (this._countsTowardsMobCount = t,
                    e && !t && h.A.livingMobCount--,
                    !e && t && h.A.livingMobCount++)
                }
                define(t, e=0) {
                    this.config = t,
                    e = Math.min(t.tiers.length - 1, e);
                    const i = t.tiers[e];
                    if (this.health.set(i.health),
                    this.damage = i.damage,
                    this.size = i.size * (.98 + .04 * Math.random()) * (t.sizeRand.min + Math.random() * t.sizeRand.max),
                    this.speed = t.speed,
                    this.index = t.id,
                    this.rarity = e,
                    this.aggressive = t.aggressive,
                    this.neutral = t.neutral,
                    this.spins = t.spins,
                    this.healing = t.healing,
                    this.fleeAtLowHealth = t.fleeAtLowHealth,
                    this.armor = 0,
                    this.spawnInvincibility = !0,
                    setTimeout(( () => {
                        this.spawnInvincibility = !1
                    }
                    ), 334),
                    this.health.damageReduction += i.damageReduction,
                    i.projectile && (this.projectile = {
                        ...i.projectile,
                        tick: 0
                    }),
                    i.poison && (this.poison.toApply.damage = i.poison.damage,
                    this.poison.toApply.timer = i.poison.duration),
                    "Demon" === t.name && (this.extraTicker = 100),
                    t.damageReflection && (this.damageReflection.reflection = t.damageReflection.reflection,
                    this.damageReflection.cap = t.damageReflection.cap),
                    i.armor && (this.armor = i.armor),
                    i.antHoleSpawns) {
                        const t = structuredClone(i.antHoleSpawns)
                          , e = t => {
                            const e = Math.random() * Math.PI * 2
                              , i = this.size + t + 1;
                            return {
                                x: this.x + Math.cos(e) * i,
                                y: this.y + Math.sin(e) * i
                            }
                        }
                        ;
                        for (let e = 0; e < t.length; e++)
                            t[e].maxCount = t[e].count;
                        for (const i of t)
                            if (i.count > 4)
                                for (let t = 0, s = 4 * Math.random() | 0; t < s; t++)
                                    setTimeout(( () => {
                                        const t = Math.max(0, this.rarity - (2 * Math.random() | 0))
                                          , s = new y(e(n.ey[i.index].tiers[t].size));
                                        s.define(n.ey[i.index], t),
                                        s.team = this.team,
                                        s.friendly = this.friendly,
                                        i.count--,
                                        i.maxCount--,
                                        h.A.isWaves && (h.A.maxMobs++,
                                        h.A.aliveMobs.push(s))
                                    }
                                    ), 64);
                        this.health.onDamage = () => {
                            for (const i of t)
                                if (!(i.count <= 0) && (!i.minHealthRatio || this.health.ratio <= i.minHealthRatio))
                                    for (; i.count > 0 && (i.minHealthRatio < 1 || this.health.ratio <= (i.count + 1) / i.maxCount); ) {
                                        const t = 1 === i.maxCount ? this.rarity : Math.max(0, this.rarity - (2 * Math.random() | 0))
                                          , s = new y(e(n.ey[i.index].tiers[t].size));
                                        s.define(n.ey[i.index], t),
                                        s.aggressive = !0,
                                        s.team = this.team,
                                        s.friendly = this.friendly,
                                        i.count--,
                                        h.A.isWaves && (h.A.maxMobs++,
                                        h.A.aliveMobs.push(s))
                                    }
                        }
                    }
                    if (t.hatchables?.length > 0 && (this.hatchable = structuredClone(t.hatchables[Math.random() * t.hatchables.length | 0])),
                    t.poopable && (this.poopable = {
                        index: t.poopable.index,
                        ticker: 0,
                        interval: t.poopable.interval
                    }),
                    t.segment) {
                        const e = y.segmentedLength++;
                        let i = 3
                          , s = Math.max(.1, .8 - this.rarity / 9 * .31);
                        for (let t = 0; t < 27 && Math.random() < s; t++)
                            i++;
                        let a = this;
                        this.segmentID = e,
                        this.segmentBodies = [];
                        for (let s = 0; s < i; s++) {
                            const i = new y(this);
                            i.head = a,
                            i.define(n.ey[t.segment], this.rarity),
                            i.countsTowardsMobCount = !1,
                            i.segmentID = e,
                            i.team = this.team,
                            i.friendly = this.friendly,
                            i.x = a.x - Math.cos(this.facing) * (this.size + i.size + 1),
                            i.y = a.y - Math.sin(this.facing) * (this.size + i.size + 1),
                            i.facing = this.facing,
                            this.segmentBodies.push(i),
                            h.A.isWaves && !i.friendly && h.A.aliveMobs.push(i),
                            a = i
                        }
                    }
                    if (t.branch) {
                        const e = y.segmentedLength++;
                        for (let i = 0; i < t.branch.branches; i++) {
                            const s = t.branch.branchLength;
                            let a = this;
                            this.segmentID = e;
                            for (let r = 0; r < s; r++) {
                                const s = new y(this);
                                s.head = a,
                                s.define(n.ey[t.branch.index], this.rarity),
                                s.countsTowardsMobCount = !1,
                                s.segmentID = e,
                                s.team = this.team,
                                s.friendly = this.friendly;
                                const r = this.facing + i * (2 * Math.PI) / t.branch.branches;
                                s.x = a.x - Math.cos(r) * (this.size + s.size + 1),
                                s.y = a.y - Math.sin(r) * (this.size + s.size + 1),
                                this.facing = r / 3,
                                s.facing = r,
                                h.A.isWaves && !s.friendly && h.A.aliveMobs.push(s),
                                a = s
                            }
                        }
                    }
                    if ("Leech" === t.name && !this.head) {
                        const t = 4 + 5 * Math.random() | 0;
                        let e = this;
                        const i = y.segmentedLength++;
                        this.segmentID = i,
                        this.ropeBodies = [];
                        for (let s = 0; s < t; s++) {
                            const t = new y(this);
                            t.head = e,
                            t.define(n.ey[this.index], this.rarity),
                            t.size = this.size,
                            t.givesXP = !1,
                            t.health = this.health,
                            t.canBeViewed = !1,
                            t.countsTowardsMobCount = !1,
                            t.segmentID = i,
                            t.team = this.team,
                            t.parent = this,
                            t.x = e.x - Math.cos(this.facing) * (this.size + t.size + 1),
                            t.y = e.y - Math.sin(this.facing) * (this.size + t.size + 1),
                            t.facing = this.facing,
                            this.ropeBodies.push(t),
                            e = t
                        }
                    }
                    if (this.movesInBursts = t.movesInBursts,
                    "Dandelion" === this.config.name) {
                        const t = [];
                        this.id--,
                        c.idAccumulator--;
                        for (let e = 0; e < 8; e++) {
                            const i = 2 * Math.PI / 8 * e
                              , s = new g(this,-1,-1);
                            s.team = this.team,
                            s.define(n.GJ[(0,
                            n.zw)("Dandelion")], this.rarity),
                            s.facing = i,
                            s.pushability = 0,
                            s.dandelionBind = this,
                            s.size = this.size / 2,
                            s.damage *= .5,
                            s.health.set(.85 * s.health.maxHealth),
                            s.x = this.x + Math.cos(i) * (this.size + 1.2 * s.size),
                            s.y = this.y + Math.sin(i) * (this.size + 1.2 * s.size),
                            t.push(s)
                        }
                        let e = !1;
                        this.health.onDamage = () => {
                            t.forEach((t => {
                                t.dandelionBind = !1,
                                t.moveAngle = t.facing,
                                t.launched = !0,
                                t.range = 67.5
                            }
                            )),
                            e = !0
                        }
                        ,
                        this.deathEvent = () => {
                            e || t.forEach((t => t.destroy()))
                        }
                        ,
                        this.id = c.idAccumulator++,
                        h.A.entities.set(this.id, this)
                    }
                    "Spirit" === this.config.name && (this.deathEvent = () => {
                        const t = n.ey.filter((t => {
                            if (!t.isSystem)
                                return !0
                        }
                        ))
                          , e = new y(this);
                        e.friendly = this.friendly,
                        e.team = this.team,
                        e.define(t[Math.random() * t.length | 0], this.rarity)
                    }
                    ),
                    t.strafes && (this.strafes = {
                        ...t.strafes,
                        cTick: 0,
                        mTick: 0,
                        direction: 0
                    }),
                    this.pushability = t.pushability
                }
                update() {
                    if (this.parent.type === s.wv.PLAYER && this.parent.health.isDead)
                        this.destroy();
                    else {
                        if (h.A.mobsExpire && (null === this.head || this.head.health.isDead) && this.lastSeen + (this.health.ratio <= .8 ? 12e4 : 3e4) < performance.now())
                            return this.damagedBy = [],
                            void this.destroy();
                        if (this.healing > 0 && this.health.ratio > 0 && !this.dandelionCooldown && (this.health.health = Math.min(this.health.maxHealth, this.health.health + this.health.maxHealth * this.healing)),
                        null !== this.hatchable && (this.hatchable.time--,
                        this.hatchable.time <= 0)) {
                            this.destroy();
                            const t = new y(this);
                            return t.define(n.ey[this.hatchable.index], this.rarity),
                            t.target = this.parent.target,
                            t.team = this.team,
                            t.friendly = this.friendly,
                            h.A.isWaves && !t.friendly && h.A.aliveMobs.push(t),
                            void (this.hatchable = null)
                        }
                        if (null !== this.head) {
                            if (this.head.health.isDead)
                                return this.head = null,
                                void (this.countsTowardsMobCount = !0);
                            const t = Math.atan2(this.head.y - this.y, this.head.x - this.x);
                            this.x = this.head.x - Math.cos(t) * (this.size + this.head.size + 1),
                            this.y = this.head.y - Math.sin(t) * (this.size + this.head.size + 1),
                            this.facing = t
                        } else if (this.speed > 0) {
                            if (this.tick--,
                            this.tick2 && this.tick2--,
                            this.target?.health.ratio > 0) {
                                if (null !== this.poopable && (this.poopable.ticker++,
                                this.poopable.ticker >= this.poopable.interval - 22.5 && this.velocity.multiply(-.1),
                                this.poopable.ticker >= this.poopable.interval)) {
                                    this.poopable.ticker = 0;
                                    const t = new y(this);
                                    t.x -= Math.cos(this.facing) * this.size * 2,
                                    t.y -= Math.sin(this.facing) * this.size * 2,
                                    t.define(n.ey[this.poopable.index], Math.max(0, this.rarity - 1)),
                                    t.team = this.team,
                                    t.parent = this,
                                    t.friendly = this.friendly,
                                    h.A.isWaves && (h.A.maxMobs++,
                                    h.A.aliveMobs.push(t))
                                }
                                if ("Demon" === this.config.name && (this.extraTicker--,
                                this.extraTicker <= 0)) {
                                    const t = Math.random() * Math.PI * 2
                                      , e = Math.random() * (8 * this.target.size);
                                    new A(this,{
                                        x: this.target.x + Math.cos(t) * e,
                                        y: this.target.y + Math.sin(t) * e
                                    },1.25 * this.size * (1 + .2 * Math.random() - .1),1500 + 1500 * Math.random()),
                                    this.extraTicker = 100 + 100 * Math.random()
                                }
                                if (this.config.sandstormMovement) {
                                    const t = Math.atan2(this.target.y - this.y, this.target.x - this.x);
                                    if ((0,
                                    a.t1)(this, this.target) > Math.pow(5 * this.size + 4 * this.target.size + 50, 2))
                                        this.movementAngle = t,
                                        this.moveStrength = this.speed,
                                        this.extraTicker = t + Math.PI + Math.random() * Math.PI / 1.5 - Math.PI / 3;
                                    else {
                                        const e = (.7 * Math.sin(this.extraTicker) + .6) * (10 * this.target.size + 5 * this.size)
                                          , i = this.target.x + Math.cos(this.extraTicker) * e
                                          , s = this.target.y + Math.sin(this.extraTicker) * e
                                          , n = (0,
                                        a.t1)(this, {
                                            x: i,
                                            y: s
                                        })
                                          , h = Math.atan2(s - this.y, i - this.x);
                                        n < 1.25 * this.size && (this.extraTicker = t + Math.PI + Math.random() * Math.PI - Math.PI / 2),
                                        this.movementAngle = h,
                                        this.moveStrength = this.speed
                                    }
                                } else if (this.movesInBursts)
                                    this.tick <= 0 && (this.tick = 35 - this.rarity,
                                    this.movementAngle = Math.atan2(this.target.y - this.y, this.target.x - this.x),
                                    this.moveStrength = this.speed),
                                    this.moveStrength *= .7;
                                else if (this.strafes?.cTick < this.strafes?.cooldown)
                                    this.strafes.cTick++;
                                else {
                                    if (this.movementAngle = Math.atan2(this.target.y - this.y, this.target.x - this.x),
                                    this.config.tiers[this.rarity].lightning) {
                                        (0,
                                        a.t1)(this, this.target) < .85 * Math.pow(this.config.tiers[this.rarity].lightning.range, 2) ? this.moveStrength = 0 : this.moveStrength = this.speed
                                    } else if (this.projectile && !this.strafes || this.strafes?.mTick > this.strafes?.length)
                                        if (!1 === this.projectile.runs) {
                                            (0,
                                            a.t1)(this, this.target) < .85 * Math.pow(this.projectile.range * this.projectile.speed, 2) ? this.moveStrength = 0 : this.moveStrength = this.speed
                                        } else
                                            this.moveStrength = this.speed;
                                    else
                                        this.moveStrength = this.speed;
                                    this.health.ratio < this.fleeAtLowHealth && (this.movementAngle += Math.PI,
                                    this.moveStrength *= .85),
                                    this.strafes && (this.strafes.mTick < this.strafes.length ? (this.movementAngle += (0 == this.strafes.direction ? Math.PI : -Math.PI) / 2,
                                    this.moveStrength *= this.strafes.speedMult,
                                    this.strafes.cTick = this.strafes.cooldown,
                                    Math.random() < .025 && (this.strafes.direction = !this.strafes.direction)) : (this.strafes.mTick = 0,
                                    this.strafes.cTick = 0),
                                    this.strafes.mTick++)
                                }
                            } else
                                this.movesInBursts ? this.moveStrength *= .7 : this.config.centipedeMovement ? this.parent.type === s.wv.PLAYER ? (this.movementAngle = Math.atan2(this.parent.y - this.y, this.parent.x - this.x),
                                this.moveStrength = (0,
                                a.t1)(this, this.parent) < this.size + 2 * this.parent.size ? 0 : this.speed) : this.tick <= 0 && (this.tick = 90,
                                this.moveStrength !== this.speed / 5 && (this.movementAngle = Math.random() * Math.PI * 2,
                                this.moveStrength = this.speed / 5),
                                Math.random() > .5 ? this.movementAngle += 1.2 * (.4 * Math.random() + .6) : this.movementAngle -= 1.2 * (.4 * Math.random() + .6)) : this.config.desertCentipedeMovement ? this.tick <= 0 && (this.tick = 2.25,
                                this.clockwise ? this.movementAngle -= .15 : this.movementAngle += .15,
                                (!this.tick2 || this.tick2 <= 0) && (this.tick2 = 90,
                                this.movementAngle = Math.random() * Math.PI * 2,
                                this.clockwise = Math.random() > .5),
                                this.moveStrength !== this.speed && (this.movementAngle = Math.random() * Math.PI * 2,
                                this.moveStrength = this.speed)) : this.config.bumblebeeMovement ? this.tick <= 0 && (this.tick = 135,
                                this.movementAngle = Math.random() * Math.PI * 2,
                                this.moveStrength = this.speed) : (this.parent.type === s.wv.PLAYER ? (this.movementAngle = Math.atan2(this.parent.y - this.y, this.parent.x - this.x),
                                this.moveStrength = (0,
                                a.t1)(this, this.parent) < this.size + 2 * this.parent.size ? 0 : this.speed) : this.tick <= 0 && (this.tick = 90,
                                this.movementAngle = Math.random() * Math.PI * 2,
                                this.moveStrength = this.speed),
                                this.moveStrength *= .95);
                            this.config.moveInSines && (this.config.bumblebeeMovement ? this.movementAngle += .1 * Math.sin(performance.now() / 120 + this.id) * (.5 * this.velocity.magnitude) : this.movementAngle += .1 * Math.sin(performance.now() / 120 + this.id) * this.velocity.magnitude),
                            this.velocity.x += Math.cos(this.movementAngle) * this.moveStrength,
                            this.velocity.y += Math.sin(this.movementAngle) * this.moveStrength,
                            this.spins ? this.facing += (0 == this.spins.constant ? this.velocity.magnitude : 1) / this.speed * .1 * this.spins.rate : this.facing = this.movementAngle,
                            this.strafes && this.target && this.strafes.cTick == this.strafes.cooldown && (this.facing -= (0 == this.strafes.direction ? Math.PI : -Math.PI) / 2)
                        }
                        if (null !== this.projectile) {
                            if (this.projectile.tick++,
                            this.projectile.aimbot && this.target?.velocity.magnitude > 0) {
                                const t = Math.sqrt((0,
                                a.t1)(this, this.target)) / this.projectile.speed / 2
                                  , e = this.target.x + this.target.velocity.x * t
                                  , i = this.target.y + this.target.velocity.y * t;
                                this.facing = Math.atan2(i - this.y, e - this.x)
                            }
                            if (("Bumblebee" === this.config.name || this.target?.health.ratio > 0) && this.projectile.tick >= this.projectile.cooldown)
                                if (this.projectile.tick = 0,
                                this.projectile.multiShot)
                                    for (let t = 0; t < this.projectile.multiShot.count; t++)
                                        setTimeout(( () => {
                                            if (this.health.isDead || null === this.target || this.target.health.isDead)
                                                return;
                                            const t = new g(this,-1,-1);
                                            t.define(n.GJ[this.projectile.petalIndex], this.rarity),
                                            t.index = this.projectile.petalIndex,
                                            t.size = this.size * this.projectile.size,
                                            t.health.set(this.projectile.health),
                                            t.damage = this.projectile.damage,
                                            t.speed = this.projectile.speed,
                                            t.launched = !0,
                                            t.range = this.projectile.range,
                                            t.spinSpeed = 0,
                                            t.nullCollision = this.projectile.nullCollision;
                                            let e = this.facing;
                                            this.projectile.multiShot.spread > 0 && (e += (Math.random() - .5) * this.projectile.multiShot.spread,
                                            t.speed *= 1 + (Math.random() - .5) * this.projectile.multiShot.spread),
                                            t.facing = t.moveAngle = e
                                        }
                                        ), t * this.projectile.multiShot.delay);
                                else {
                                    const t = new g(this,-1,-1);
                                    t.define(n.GJ[this.projectile.petalIndex], this.rarity),
                                    t.index = this.projectile.petalIndex,
                                    t.size = this.size * this.projectile.size,
                                    t.health.set(this.projectile.health),
                                    t.damage = this.projectile.damage,
                                    t.speed = this.projectile.speed,
                                    t.launched = !0,
                                    t.range = this.projectile.range,
                                    t.spinSpeed = 0,
                                    t.nullCollision = this.projectile.nullCollision,
                                    t.facing = t.moveAngle = this.facing,
                                    "Tank" === this.config.name && (t.x += Math.cos(this.facing) * this.size * 1.25,
                                    t.y += Math.sin(this.facing) * this.size * 1.25)
                                }
                        }
                        this.bindToRoom(),
                        super.update()
                    }
                }
                collide() {
                    if (super.collide(),
                    this.collideTerrain(),
                    this.targetTick--,
                    this.aggressive && ((this.targetTick <= 0 || null === this.target || this.target.health.isDead) && (this.targetTick = 25 + 100 * Math.random() | 0,
                    this.target = this.findTarget(12 * this.size + 50)),
                    this.target?.health.ratio > 0 && this.config.tiers[this.rarity].lightning)) {
                        const t = this.config.tiers[this.rarity].lightning;
                        this.extraTicker--,
                        this.extraTicker <= 0 && (new w(this).define(t.damage, t.range, t.bounces).bounce(),
                        this.extraTicker = t.cooldown * (.95 + .1 * Math.random()))
                    }
                }
                destroy() {
                    if (this.deathEvent && this.deathEvent(),
                    super.destroy(),
                    !this.friendly && this.countsTowardsMobCount && h.A.livingMobCount--,
                    !this.givesXP)
                        return;
                    const t = this.getTopDamagers(3, s.wv.PLAYER);
                    let e = "";
                    if (t.forEach((t => {
                        if (t.clientID > 0) {
                            const e = h.A.clients.get(t.clientID);
                            if (e) {
                                e.addXP((.3 * Math.random() + .7) * Math.pow(3, this.rarity + 1));
                                const t = [];
                                for (const i of n.ey[this.index].drops) {
                                    if (Math.random() > i.chance)
                                        continue;
                                    const s = (0,
                                    a.jd)(this.rarity, e.highestRarity + 5);
                                    s < i.minRarity || t.push(new f(this,e,i.index,s))
                                }
                                for (let e = 0; e < t.length; e++)
                                    t[e].x += 30 * Math.cos(e / t.length * Math.PI * 2),
                                    t[e].y += 30 * Math.sin(e / t.length * Math.PI * 2)
                            }
                        }
                    }
                    )),
                    !1 === this.config.isSystem && !this.friendly && !["Queen Ant Egg", "Termite Overmind Egg", "Queen Fire Ant Egg"].includes(this.config.name) && this.rarity >= h.A.announceRarity) {
                        if (t.length > 0) {
                            e = (0,
                            a.Br)(s.cK[this.rarity].name, !0) + " " + this.config.name + " was killed by ";
                            for (let i = 0, s = t.length; i < s; i++) {
                                if (!h.A.clients.has(t[i].clientID))
                                    continue;
                                const a = h.A.clients.get(t[i].clientID).username;
                                e += i === s - 1 ? 1 === s ? a : 2 === s ? " and " + a : ", and " + a : 0 === i ? a : ", " + a
                            }
                        } else
                            e = (0,
                            a.Br)(s.cK[this.rarity].name, !0) + " " + this.config.name + " despawned";
                        h.A.clients.forEach((t => t.systemMessage(e, s.cK[this.rarity].color)))
                    }
                }
            }
            class f {
                static idAccumulator = 1;
                constructor(t={
                    x: 0,
                    y: 0
                }, e, i, s) {
                    this.id = f.idAccumulator++,
                    this.x = t.x,
                    this.y = t.y,
                    this.client = e,
                    this.size = 30,
                    this.index = i,
                    this.rarity = s,
                    this.duration = 20 * Math.pow(1.1, s),
                    this.creation = performance.now(),
                    this.client.addDrop(this),
                    h.A.drops.set(this.id, this)
                }
                update() {
                    if (this.creation + 1e3 * this.duration < performance.now() && this.destroy(),
                    null === this.client.body || this.client.body.health.isDead)
                        return;
                    const t = this.x - this.client.body.x
                      , e = this.y - this.client.body.y;
                    t * t + e * e < Math.pow(this.size + this.client.body.size + this.client.body.extraPickupRange, 2) && this.client.pickupDrop(this) && this.destroy()
                }
                destroy() {
                    this.client.removeDrop(this),
                    h.A.drops.delete(this.id)
                }
            }
            class A {
                static idAccum = 1;
                constructor(t, e, i, s, a=t.rarity ?? 0) {
                    this.id = A.idAccum++,
                    this.parent = t,
                    this.x = e.x,
                    this.y = e.y,
                    this.size = i,
                    this.createdAt = Date.now(),
                    this.timer = s,
                    this.rarity = a,
                    h.A.pentagrams.set(this.id, this),
                    setTimeout(this.destroy.bind(this), s),
                    this.damage = Math.pow(this.rarity + 1, 3),
                    this.poisonDamage = .5 / 22.5 * Math.pow(this.rarity + 1, 3),
                    this.poisonTime = 112.5,
                    this.speedDebuff = .75,
                    this.speedDebuffTime = 112.5
                }
                define(t, e, i, s, a) {
                    return this.damage = t,
                    this.poisonDamage = e,
                    this.poisonTime = i,
                    this.speedDebuff = s,
                    this.speedDebuffTime = a,
                    this
                }
                destroy() {
                    h.A.pentagrams.delete(this.id),
                    this.parent.health.isDead || h.A.entities.forEach((t => {
                        if (t.parent.id === this.parent.id || t.parent.team === this.parent.team)
                            return;
                        const e = this.x - t.x
                          , i = this.y - t.y;
                        e * e + i * i < this.size * this.size && (t.health.damage(this.damage),
                        t.parent && "Leech" === t.config?.name ? (t.parent.damagedBy[this.parent.id] ??= [0, this.parent.type, this.parent.type === s.wv.PLAYER ? this.parent.name : this.parent.index, this.parent.type === s.wv.PLAYER && this.parent.client ? this.parent.client.id : null],
                        t.parent.damagedBy[this.parent.id][0] += this.damage) : (t.damagedBy[this.parent.id] ??= [0, this.parent.type, this.parent.type === s.wv.PLAYER ? this.parent.name : this.parent.index, this.parent.type === s.wv.PLAYER && this.parent.client ? this.parent.client.id : null],
                        t.damagedBy[this.parent.id][0] += this.damage),
                        t.poison.timer = this.poisonTime,
                        t.poison.damage = this.poisonDamage,
                        t.speedDebuff.timer = this.speedDebuffTime,
                        t.speedDebuff.multiplier = this.speedDebuff)
                    }
                    ))
                }
            }
            class w {
                static idAccum = 1;
                constructor(t) {
                    this.id = w.idAccum++,
                    this.parent = t,
                    this.points = [{
                        x: t.x,
                        y: t.y,
                        id: -1
                    }],
                    this.damage = 0,
                    this.range = 0,
                    this.bounces = 0,
                    this.remainTick = 3,
                    h.A.lightning.set(this.id, this)
                }
                define(t, e, i) {
                    return this.damage = t,
                    this.range = e,
                    this.bounces = i,
                    this
                }
                bounce() {
                    for (let t = 0; t < this.bounces; t++) {
                        const t = this.points[this.points.length - 1]
                          , e = h.A.spatialHash.retrieve({
                            _AABB: {
                                x1: t.x - this.range,
                                y1: t.y - this.range,
                                x2: t.x + this.range,
                                y2: t.y + this.range
                            }
                        });
                        let i = null
                          , a = 1 / 0;
                        if (e.forEach((e => {
                            if (e.parent.id === this.parent.id || e.parent.team === this.parent.team || this.points.some((t => t.id === e.id)) || e.type === s.wv.PETAL && !e.attractsLightning)
                                return;
                            if (e.type === s.wv.PETAL)
                                return i = e,
                                void (a = 0);
                            const n = t.x - e.x
                              , h = t.y - e.y
                              , r = n * n + h * h;
                            r < a && (i = e,
                            a = r)
                        }
                        )),
                        null === i)
                            break;
                        if (this.points.push({
                            x: i.x,
                            y: i.y,
                            id: i.id
                        }),
                        i.type === s.wv.PETAL)
                            break
                    }
                    for (let t = 1; t < this.points.length; t++) {
                        const e = h.A.entities.get(this.points[t].id);
                        if (e) {
                            if (e.type === s.wv.PLAYER) {
                                this.points[t].x += Math.random() * e.size * 2 - e.size,
                                this.points[t].y += Math.random() * e.size * 2 - e.size;
                                if ((0,
                                a.t1)(this.points[t], e) > e.size * e.size)
                                    continue
                            }
                            e.health.damage(this.damage),
                            e.parent && "Leech" === e.config?.name ? (e.parent.damagedBy[this.parent.id] ??= [0, this.parent.type, this.parent.type === s.wv.PLAYER ? this.parent.name : this.parent.index, this.parent.type === s.wv.PLAYER && this.parent.client ? this.parent.client.id : null],
                            e.parent.damagedBy[this.parent.id][0] += this.damage) : (e.damagedBy[this.parent.id] ??= [0, this.parent.type, this.parent.type === s.wv.PLAYER ? this.parent.name : this.parent.index, this.parent.type === s.wv.PLAYER && this.parent.client ? this.parent.client.id : null],
                            e.damagedBy[this.parent.id][0] += this.damage),
                            e.type === s.wv.MOB && e.neutral && (e.target = this.parent)
                        }
                    }
                }
                update() {
                    this.remainTick-- <= 0 && this.destroy()
                }
                destroy() {
                    h.A.lightning.delete(this.id)
                }
            }
            class b {
                constructor(t, e, i, s, a) {
                    this.numSides = t.length,
                    this.numPoints = 2 * this.numSides,
                    this.sides = new Float32Array(this.numPoints),
                    this.points = new Float32Array(this.numPoints),
                    this.x = 0,
                    this.y = 0,
                    this.radius = 0,
                    this.rotation = 0,
                    this._AABB = {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 0
                    };
                    for (let e = 0; e < this.numSides; e++)
                        this.sides[2 * e] = t[e].x,
                        this.sides[2 * e + 1] = t[e].y;
                    this.transform(e, i, s, a)
                }
                transform(t, e, i, s) {
                    if (this.x === t && this.y === e && this.radius === i && this.rotation === s)
                        return;
                    const a = Math.cos(s)
                      , n = Math.sin(s);
                    for (let s = 0; s < this.numPoints; s += 2) {
                        const h = this.sides[s]
                          , r = this.sides[s + 1];
                        this.points[s] = t + (h * a - r * n) * i,
                        this.points[s + 1] = e + (h * n + r * a) * i
                    }
                    this.x = t,
                    this.y = e,
                    this.radius = i,
                    this.rotation = s,
                    this._AABB = this.getAABB()
                }
                getAABB() {
                    let t = 1 / 0
                      , e = 1 / 0
                      , i = -1 / 0
                      , s = -1 / 0;
                    for (let a = 0; a < this.numPoints; a += 2) {
                        const n = this.points[a]
                          , h = this.points[a + 1];
                        n < t && (t = n),
                        h < e && (e = h),
                        n > i && (i = n),
                        h > s && (s = h)
                    }
                    return {
                        x1: t,
                        y1: e,
                        x2: i,
                        y2: s
                    }
                }
                pointIsInside(t, e) {
                    let i = !1
                      , s = this.points[this.numPoints - 2]
                      , a = this.points[this.numPoints - 1];
                    for (let n = 0; n < this.numPoints; n += 2) {
                        let h = this.points[n]
                          , r = this.points[n + 1];
                        e < a != e < r && t < (h - s) * (e - a) / (r - a) + s && (i = !i),
                        s = h,
                        a = r
                    }
                    return i
                }
                circleIntersectsEdge(t, e, i, s, a, n, h) {
                    const r = i - t
                      , o = s - e
                      , l = a - t
                      , d = n - e
                      , c = Math.max(0, Math.min(1, (r * l + o * d) / (r * r + o * o)))
                      , g = t + r * c - a
                      , p = e + o * c - n;
                    return g * g + p * p <= h * h
                }
                circleIntersects(t, e, i) {
                    if (this.pointIsInside(t, e))
                        return !0;
                    for (let s = 0; s < this.numPoints; s += 2)
                        if (this.circleIntersectsEdge(this.points[s], this.points[s + 1], this.points[(s + 2) % this.numPoints], this.points[(s + 3) % this.numPoints], t, e, i))
                            return !0;
                    return !1
                }
                getClosestPointOnEdge(t, e, i, s, a, n) {
                    const h = i - t
                      , r = s - e
                      , o = (h * (a - t) + r * (n - e)) / (h * h + r * r)
                      , l = Math.max(0, Math.min(1, o));
                    return {
                        x: t + h * l,
                        y: e + r * l
                    }
                }
                resolve(t, e, i) {
                    i += 3;
                    let s = 1 / 0
                      , a = null;
                    for (let i = 0; i < this.numPoints; i += 2) {
                        const n = this.getClosestPointOnEdge(this.points[i], this.points[i + 1], this.points[(i + 2) % this.numPoints], this.points[(i + 3) % this.numPoints], t, e)
                          , h = n.x - t
                          , r = n.y - e
                          , o = h * h + r * r;
                        o < s && (s = o,
                        a = n)
                    }
                    const n = a.x - t
                      , h = a.y - e
                      , r = Math.atan2(h, n);
                    t = a.x - Math.cos(r) * i,
                    e = a.y - Math.sin(r) * i;
                    let o = Math.atan2(e - a.y, t - a.x);
                    return this.pointIsInside(t, e) && (o += Math.PI),
                    {
                        x: a.x + Math.cos(o) * i,
                        y: a.y + Math.sin(o) * i,
                        angle: o
                    }
                }
            }
            class M {
                static idAccum = 1;
                constructor(t, e, i) {
                    this.id = M.idAccum++,
                    this.x = t.x,
                    this.y = t.y,
                    this.size = e;
                    const a = (0,
                    s.ai)(i);
                    this.type = a.id,
                    this.polygon = new b(a.terrain,this.x,this.y,this.size,0),
                    this.gridX = 0,
                    this.gridY = 0,
                    h.A.terrain.set(this.id, this)
                }
                destroy() {
                    h.A.terrain.delete(this.id),
                    h.A.updateTerrain()
                }
            }
        }
    }, n = {};
    function h(t) {
        var e = n[t];
        if (void 0 !== e)
            return e.exports;
        var i = n[t] = {
            exports: {}
        };
        return a[t](i, i.exports, h),
        i.exports
    }
    t = "function" == typeof Symbol ? Symbol("webpack queues") : "__webpack_queues__",
    e = "function" == typeof Symbol ? Symbol("webpack exports") : "__webpack_exports__",
    i = "function" == typeof Symbol ? Symbol("webpack error") : "__webpack_error__",
    s = t => {
        t && t.d < 1 && (t.d = 1,
        t.forEach((t => t.r--)),
        t.forEach((t => t.r-- ? t.r++ : t())))
    }
    ,
    h.a = (a, n, h) => {
        var r;
        h && ((r = []).d = -1);
        var o, l, d, c = new Set, g = a.exports, p = new Promise(( (t, e) => {
            d = e,
            l = t
        }
        ));
        p[e] = g,
        p[t] = t => (r && t(r),
        c.forEach(t),
        p.catch((t => {}
        ))),
        a.exports = p,
        n((a => {
            var n;
            o = (a => a.map((a => {
                if (null !== a && "object" == typeof a) {
                    if (a[t])
                        return a;
                    if (a.then) {
                        var n = [];
                        n.d = 0,
                        a.then((t => {
                            h[e] = t,
                            s(n)
                        }
                        ), (t => {
                            h[i] = t,
                            s(n)
                        }
                        ));
                        var h = {};
                        return h[t] = t => t(n),
                        h
                    }
                }
                var r = {};
                return r[t] = t => {}
                ,
                r[e] = a,
                r
            }
            )))(a);
            var h = () => o.map((t => {
                if (t[i])
                    throw t[i];
                return t[e]
            }
            ))
              , l = new Promise((e => {
                (n = () => e(h)).r = 0;
                var i = t => t !== r && !c.has(t) && (c.add(t),
                t && !t.d && (n.r++,
                t.push(n)));
                o.map((e => e[t](i)))
            }
            ));
            return n.r ? l : h()
        }
        ), (t => (t ? d(p[i] = t) : l(g),
        s(r)))),
        r && r.d < 0 && (r.d = 0)
    }
    ,
    h.d = (t, e) => {
        for (var i in e)
            h.o(e, i) && !h.o(t, i) && Object.defineProperty(t, i, {
                enumerable: !0,
                get: e[i]
            })
    }
    ,
    h.o = (t, e) => Object.prototype.hasOwnProperty.call(t, e);
    h(58)
}
)();
