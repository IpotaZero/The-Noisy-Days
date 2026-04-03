const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./Stage.js","./Bullet.js","./Dom.js","./Stage2.js","./StageBlue.js","./EnemyRendererMob.js","./Ctx.js","./StageCrimson.js","./StageCyan.js","./StageDust.js","./StageGreen.js","./StageNavy.js","./StageNibi.js","./StageOrange.js","./StageSILO.js","./StageSoot.js","./StageTutorial.js","./isSmartPhone.js","./StageYellow.js","./Stageアオ.js","./Stageシオン.js","./Stageヤナガワ.js","./Stageレイ.js","./Stage一か月前その1.js","./Stage一か月前その2.js","./Stage一か月前その3.js","./Stage人.js","./Stage信じましたが.js","./Stage合成人.js","./Stage心.js","./Stage機械大戦.js","./Stage犠牲.js","./Stage隣.js","./SceneStage.js","./preload-helper.js","./Selector.js"])))=>i.map(i=>d[i]);
import{t as e}from"./Dom.js";import{a as t,i as n,n as r,r as i,t as a}from"./preload-helper.js";import{t as o}from"./Selector.js";var s=[{"stage-name":`Tutorial`,description:`チュートリアル`},{"stage-name":`Yellow`,description:`やや拡大する弾を撃つ衛星を持つ`},{"stage-name":`Orange`,description:`速射する衛星を持つ`},{"stage-name":`Crimson`,description:`弾速の大きい弾を撃つ衛星を持つ`}],c=[{"stage-name":`シオン`,description:`シオン・シマについて`},{"stage-name":`Cyan`,description:`扇状に弾を撃つ衛星を持つ`},{"stage-name":`Blue`,description:`針を飛ばす衛星を持つ`},{"stage-name":`Navy`,description:`波状隘路攻撃`}],l=[{"stage-name":`SILO`,description:`逆説的措置`},{"stage-name":`Green`,description:``},{"stage-name":`Purple`,description:``},{"stage-name":`Violet`,description:``}],u=[{"stage-name":`機械大戦`,description:`歴史`},{"stage-name":`White`,description:``},{"stage-name":`Gray`,description:`全方位弾と自機狙いの衛星を持つ`},{"stage-name":`Black`,description:``}],d=[{"act-name":`Warm`,description:`自機外しのコアと一つの衛星を持つドローン`,stages:s},{"act-name":`Cool`,description:`自機狙いのコアと二つの衛星を持つドローン`,stages:c},{"act-name":`Neutral`,description:`移動を妨げるコアと二つの衛星を持つドローン`,stages:l},{"act-name":`Achromatic`,description:``,stages:u}],f=[{"stage-name":`アオ`,description:``},{"stage-name":`Scarlet`,description:``},{"stage-name":`Cobalt`,description:``},{"stage-name":`Gold`,description:``}],p=[{"stage-name":`ヤナガワ`,description:``},{"stage-name":`Rust`,description:``},{"stage-name":`Khaki`,description:``},{"stage-name":`Olive`,description:``}],m=[{"stage-name":`レイ`,description:``},{"stage-name":`Blush`,description:``},{"stage-name":`Sage`,description:``},{"stage-name":`Lavender`,description:``}],h=[{"stage-name":`合成人`,description:``},{"stage-name":`Mud`,description:``},{"stage-name":`Moss`,description:``},{"stage-name":`Soot`,description:``}],g=[{"act-name":`Vivid`,description:``,stages:f},{"act-name":`Muted`,description:``,stages:p},{"act-name":`Pale`,description:``,stages:m},{"act-name":`Dull`,description:``,stages:h}],_=[{"stage-name":`犠牲`,description:``},{"stage-name":`Pearl`,description:``},{"stage-name":`Ivory`,description:``},{"stage-name":`Snow`,description:``}],v=[{"stage-name":``,description:``},{"stage-name":`Obsidian`,description:``},{"stage-name":`Noir`,description:``},{"stage-name":`Pitch`,description:``}],y=[{"stage-name":``,description:``},{"stage-name":`Amber`,description:``},{"stage-name":`Vermilion`,description:``},{"stage-name":`Lime`,description:``}],b=[{"stage-name":`一か月前その3`,description:`レイ・コウダ`},{"stage-name":`Fog`,description:``},{"stage-name":`Stone`,description:``},{"stage-name":`Dust`,description:``}],x=[{"act-name":`Light`,description:``,stages:_},{"act-name":`Dark`,description:``,stages:v},{"act-name":`High`,description:``,stages:y},{"act-name":`Low`,description:``,stages:b}],S=[{"stage-name":`隣`,description:``},{"stage-name":`Glass`,description:``},{"stage-name":`Ice`,description:``},{"stage-name":`Haze`,description:``}],C=[{"stage-name":`人`,description:``},{"stage-name":`Veil`,description:``},{"stage-name":`Frost`,description:``},{"stage-name":`Dusk`,description:``}],w=[{"stage-name":`心`,description:``},{"stage-name":`Lead`,description:``},{"stage-name":`Clay`,description:``},{"stage-name":`Tar`,description:``}],T=[{"stage-name":`信じましたが`,description:``},{"stage-name":`Phosphor`,description:``},{"stage-name":`Glow`,description:``},{"stage-name":`Dawn`,description:``}],E=[{"act-name":`Clear`,description:``,stages:S},{"act-name":`Translucent`,description:``,stages:C},{"act-name":`Opaque`,description:``,stages:w},{"act-name":`Luminous`,description:``,stages:T}],D=[{"chapter-name":`Hue`,description:`小さめの飛行兵器`,acts:d},{"chapter-name":`Saturation`,description:``,acts:g},{"chapter-name":`Brightness`,description:``,acts:x},{"chapter-name":`Alpha`,description:``,acts:E}];D.flatMap(e=>e.acts.flatMap(e=>e.stages.flatMap(e=>e[`stage-name`])));var O=class{static sum(e){return e.reduce((e,t)=>e+t,0)}static sorted012(e){return e.toSorted((e,t)=>e-t)}static sorted210(e){return e.toSorted((e,t)=>t-e)}},k=class{pages=new t;selector;constructor(e={}){this.config=e,this.selector=new o({"[data-stage]":{alias:`stage-button`,expectedCount:64},".act-button":{alias:`act-button`,expectedCount:16},".chapter-button":{alias:`chapter-button`,expectedCount:4},"#swipe-ratio":{alias:`swipe-ratio`},"#volume-bgm":{alias:`volume-bgm`},"#volume-se":{alias:`volume-se`},"#delete-data":{alias:`delete-data`}})}async start(){e.container.innerHTML=``;let t=A();e.container.insertAdjacentHTML(`beforeend`,t),await this.pages.loadFromFile(e.container,`./asset/page/title/title.html`,{history:this.config.history??[`title`],override:!1}),this.selector.load(e.container),this.selector.onClick(`stage-button`,({element:e,index:t})=>{let n=e.dataset.stage;if(!n)throw Error(`Stage name is missing`);this.gotoStage(t,n)}),this.selector.onClick(`delete-data`,()=>{confirm(`データを初期化する?`)&&(r.clear(),alert(`データを初期化した`),this.setupSetting(),this.lockButtons(),this.evaluateStageCleared())}),this.setupSetting(),this.lockButtons(),this.evaluateStageCleared()}setupSetting(){let e=this.selector.getFirst(`swipe-ratio`);e.oninput=()=>{r.setSwipeRatio(e.value)};let t=this.selector.getFirst(`volume-bgm`);t.oninput=()=>{};let n=this.selector.getFirst(`volume-se`);n.oninput=()=>{r.setVolumeSE(n.value),i.setVolume(r.getVolumeSE()/9)},e.value=r.getSwipeRatio(),t.value=r.getVolumeBGM(),n.value=r.getVolumeSE()}lockButtons(){let e=r.getFirstUncleared(),t=Math.floor(e/4),n=Math.floor(t/4);this.selector.getAll(`stage-button`).filter(e=>e instanceof HTMLButtonElement).forEach((t,n)=>{n>e&&this.lock(t)}),this.selector.getAll(`act-button`).filter(e=>e instanceof HTMLButtonElement).forEach((e,n)=>{n>t&&this.lock(e)}),this.selector.getAll(`chapter-button`).filter(e=>e instanceof HTMLButtonElement).forEach((e,t)=>{t>n&&this.lock(e)}),this.lock(this.selector.getAll(`stage-button`)[10])}lock(e){e.insertAdjacentHTML(`beforeend`,`<div class="lock">--:: 封 ::--</div>`),e.disabled=!0}evaluateStageCleared(){let e=r.getStages(),t=`var(--gold)`,n=`var(--silver)`;this.selector.getAll(`stage-button`).forEach((r,i)=>{let a=r.querySelector(`.rank`),o=e[i];if(o===0){a.textContent=``;return}a.textContent=`★`,a.style.background=o===2?t:n,a.style.backgroundClip=`text`,a.style.webkitTextFillColor=`transparent`}),this.selector.getAll(`act-button`).forEach((r,i)=>{let a=i*4,o=e.slice(a,a+4),s=r.querySelector(`.rank`);s.innerHTML=o.map(e=>e===0?`<span>☆</span>`:`<span style="background: ${e===2?t:n}; background-clip: text;">★</span>`).join(``)}),this.selector.getAll(`chapter-button`).forEach((t,n)=>{let r=n*4*4,i=e.slice(r,r+16),a=t.querySelector(`.rank`),o=O.sum(i);a.textContent=`${Math.floor(o/32*100)}%`})}async end(){}gotoStage(e,t){i.start.play(),document.querySelectorAll(`button`).forEach(e=>e.disabled=!0),n.goto(async()=>{let{default:n}=await Object.assign({"../Stage/Stage.ts":()=>a(()=>import(`./Stage.js`),__vite__mapDeps([0,1,2,3]),import.meta.url),"../Stage/StageBlue.ts":()=>a(()=>import(`./StageBlue.js`),__vite__mapDeps([4,2,1,5,6,3]),import.meta.url),"../Stage/StageCrimson.ts":()=>a(()=>import(`./StageCrimson.js`),__vite__mapDeps([7,2,1,5,6,3]),import.meta.url),"../Stage/StageCyan.ts":()=>a(()=>import(`./StageCyan.js`),__vite__mapDeps([8,2,1,5,6,3]),import.meta.url),"../Stage/StageDust.ts":()=>a(()=>import(`./StageDust.js`),__vite__mapDeps([9,1,2,3]),import.meta.url),"../Stage/StageGreen.ts":()=>a(()=>import(`./StageGreen.js`),__vite__mapDeps([10,2,1,5,6,3]),import.meta.url),"../Stage/StageNavy.ts":()=>a(()=>import(`./StageNavy.js`),__vite__mapDeps([11,2,1,5,6,3]),import.meta.url),"../Stage/StageNibi.ts":()=>a(()=>import(`./StageNibi.js`),__vite__mapDeps([12,1,2,3]),import.meta.url),"../Stage/StageOrange.ts":()=>a(()=>import(`./StageOrange.js`),__vite__mapDeps([13,2,1,5,6,3]),import.meta.url),"../Stage/StageSILO.ts":()=>a(()=>import(`./StageSILO.js`),__vite__mapDeps([14,1,2,3]),import.meta.url),"../Stage/StageSoot.ts":()=>a(()=>import(`./StageSoot.js`),__vite__mapDeps([15,1,2,3]),import.meta.url),"../Stage/StageTutorial.ts":()=>a(()=>import(`./StageTutorial.js`),__vite__mapDeps([16,2,1,5,6,3,17]),import.meta.url),"../Stage/StageYellow.ts":()=>a(()=>import(`./StageYellow.js`),__vite__mapDeps([18,2,1,5,6,3]),import.meta.url),"../Stage/Stageアオ.ts":()=>a(()=>import(`./Stageアオ.js`),__vite__mapDeps([19,1,2,3]),import.meta.url),"../Stage/Stageシオン.ts":()=>a(()=>import(`./Stageシオン.js`),__vite__mapDeps([20,1,2,3]),import.meta.url),"../Stage/Stageヤナガワ.ts":()=>a(()=>import(`./Stageヤナガワ.js`),__vite__mapDeps([21,1,2,3]),import.meta.url),"../Stage/Stageレイ.ts":()=>a(()=>import(`./Stageレイ.js`),__vite__mapDeps([22,1,2,3]),import.meta.url),"../Stage/Stage一か月前その1.ts":()=>a(()=>import(`./Stage一か月前その1.js`),__vite__mapDeps([23,1,2,3]),import.meta.url),"../Stage/Stage一か月前その2.ts":()=>a(()=>import(`./Stage一か月前その2.js`),__vite__mapDeps([24,1,2,3]),import.meta.url),"../Stage/Stage一か月前その3.ts":()=>a(()=>import(`./Stage一か月前その3.js`),__vite__mapDeps([25,1,2,3]),import.meta.url),"../Stage/Stage人.ts":()=>a(()=>import(`./Stage人.js`),__vite__mapDeps([26,1,2,3]),import.meta.url),"../Stage/Stage信じましたが.ts":()=>a(()=>import(`./Stage信じましたが.js`),__vite__mapDeps([27,1,2,3]),import.meta.url),"../Stage/Stage合成人.ts":()=>a(()=>import(`./Stage合成人.js`),__vite__mapDeps([28,1,2,3]),import.meta.url),"../Stage/Stage心.ts":()=>a(()=>import(`./Stage心.js`),__vite__mapDeps([29,1,2,3]),import.meta.url),"../Stage/Stage機械大戦.ts":()=>a(()=>import(`./Stage機械大戦.js`),__vite__mapDeps([30,1,2,3]),import.meta.url),"../Stage/Stage犠牲.ts":()=>a(()=>import(`./Stage犠牲.js`),__vite__mapDeps([31,1,2,3]),import.meta.url),"../Stage/Stage隣.ts":()=>a(()=>import(`./Stage隣.js`),__vite__mapDeps([32,1,2,3]),import.meta.url)})[`../Stage/Stage${t}.ts`](),r=new n;return await a(()=>import(`./SceneStage.js`).then(t=>new t.default(e,r,this.pages.getHistory())),__vite__mapDeps([33,34,2,1,6,35]),import.meta.url)},{msIn:1e3,msOut:1e3})}};function A(){return`
        <div class="page" id="chapters">
            <section class="page-description">
                <h2>Chapters</h2>
                <p>西暦2XXX年 トウキョウ</p>
            </section>

            <div class="options" data-direction="column">${D.map(j).join(``)}</div>

            <div class="options" data-direction="row"><button data-back>Back</button></div>
        </div>
    `+D.map(e=>`
                <div class="page" id="chapter-${e[`chapter-name`]}">
                    <section class="page-description">
                        <h2>Chapters > ${e[`chapter-name`]}</h2>
                        <p>${e.description}</p>
                    </section>

                    <div class="options" data-direction="column">
                        ${e.acts.map(M).join(``)}
                    </div>

                    <div class="options" data-direction="row"><button data-back>Back</button></div>
                </div>
            `+e.acts.map(t=>N(e[`chapter-name`],t)).join(``)).join(``)}function j(e){return`
        <button class="button chapter-button" data-link="chapter-${e[`chapter-name`]}">
            <img class="icon" src="asset/image/background.png" />
            <section>
                <div class="title">
                    <span class="name">${e[`chapter-name`]}</span>
                    <span class="rank"></span>
                </div>
                <p class="description">${e.description}</p>
            </section>
            <span class="button-arrow">＼<br>／</span>
        </button>
    `}function M(e){return`
        <button class="button act-button" data-link="act-${e[`act-name`]}">
            <img class="icon" src="asset/image/background.png" />
            <section>
                <div class="title">
                    <span class="name">${e[`act-name`]}</span>
                    <span class="rank"></span>
                </div>
                <p class="description">${e.description}</p>
            </section>
            <span class="button-arrow">＼<br>／</span>
        </button>
    `}function N(e,t){return`
        <div class="page" id="act-${t[`act-name`]}">
            <section class="page-description">
                <h3>Chapters > ${e} > ${t[`act-name`]}</h3>
                <p>${t.description}</p>
            </section>

            <div class="options" data-direction="column">
                ${t.stages.map(P).join(``)}
            </div>

            <div class="options" data-direction="row"><button data-back>Back</button></div>
        </div>
    `}function P(e){return`
        <button class="button" data-stage="${e[`stage-name`]}">
            <img class="icon" src="asset/image/background.png" />
            <section>
                <div class="title">
                    <span class="name">${e[`stage-name`]}</span>
                    <span class="rank"></span>
                </div>
                <p class="description">${e.description}</p>
            </section>
        </button>
    `}export{k as default};
//# sourceMappingURL=SceneTitle.js.map