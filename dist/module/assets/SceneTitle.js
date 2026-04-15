const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./StageBlack.js","./Dom.js","./Bullet.js","./Curves.js","./Ctx.js","./Stage.js","./StageBlue.js","./EnemyRendererMob.js","./StageCrimson.js","./StageCyan.js","./StageDust.js","./StageGray.js","./StageGreen.js","./StageNavy.js","./StageOrange.js","./StagePurple.js","./StageSILO.js","./StageTutorial.js","./isSmartPhone.js","./StageViolet.js","./StageWhite.js","./StageYellow.js","./Stage機械大戦.js","./StageScarlet.js","./Stageアオ.js","./SceneStage.js","./preload-helper.js","./Selector.js"])))=>i.map(i=>d[i]);
import{a as e,i as t,n,o as r,r as i,t as a}from"./preload-helper.js";import{t as o}from"./Dom.js";import{t as s}from"./HTMLNumberElement.js";import{t as c}from"./Selector.js";var l=[{"stage-name":`Tutorial`,description:`チュートリアル`},{"stage-name":`Yellow`,description:`やや拡大する弾を撃つ衛星を持つ`},{"stage-name":`Orange`,description:`速射する衛星を持つ`},{"stage-name":`Crimson`,description:`弾速の大きい弾を撃つ衛星を持つ`}],u=[{"stage-name":`シオン`,description:`シオン・シマについて`},{"stage-name":`Cyan`,description:`扇状に弾を撃つ衛星を持つ`},{"stage-name":`Blue`,description:`針を飛ばす衛星を持つ`},{"stage-name":`Navy`,description:`波状隘路攻撃`}],d=[{"stage-name":`SILO`,description:`逆説的措置`},{"stage-name":`Green`,description:`単純な自機狙い`},{"stage-name":`Purple`,description:`画面端で跳ね返る自機狙い`},{"stage-name":`Violet`,description:`弾幕`}],f=[{"stage-name":`機械大戦`,description:`歴史`},{"stage-name":`White`,description:``},{"stage-name":`Gray`,description:``},{"stage-name":`Black`,description:``}],p=[{"act-name":`Warm`,description:`自機外しのコアと一つの衛星を持つドローン`,stages:l},{"act-name":`Cool`,description:`自機狙いのコアと二つの衛星を持つドローン`,stages:u},{"act-name":`Neutral`,description:`移動を妨げるコアと二つの衛星を持つドローン`,stages:d},{"act-name":`Achromatic`,description:`激しく動くコアと二つの衛星を持つドローン`,stages:f}],m=[{"stage-name":`アオ`,description:``},{"stage-name":`Scarlet`,description:``},{"stage-name":`Cobalt`,description:``},{"stage-name":`Gold`,description:``}],h=[{"stage-name":`ヤナガワ`,description:``},{"stage-name":`Rust`,description:``},{"stage-name":`Khaki`,description:``},{"stage-name":`Olive`,description:``}],g=[{"stage-name":`レイ`,description:``},{"stage-name":`Blush`,description:``},{"stage-name":`Sage`,description:``},{"stage-name":`Lavender`,description:``}],_=[{"stage-name":`合成人`,description:``},{"stage-name":`Mud`,description:``},{"stage-name":`Moss`,description:``},{"stage-name":`Soot`,description:``}],v=[{"act-name":`Vivid`,description:``,stages:m},{"act-name":`Muted`,description:``,stages:h},{"act-name":`Pale`,description:``,stages:g},{"act-name":`Dull`,description:``,stages:_}],y=[{"stage-name":`犠牲`,description:``},{"stage-name":`Pearl`,description:``},{"stage-name":`Ivory`,description:``},{"stage-name":`Snow`,description:``}],b=[{"stage-name":``,description:``},{"stage-name":`Obsidian`,description:``},{"stage-name":`Noir`,description:``},{"stage-name":`Pitch`,description:``}],x=[{"stage-name":``,description:``},{"stage-name":`Amber`,description:``},{"stage-name":`Vermilion`,description:``},{"stage-name":`Lime`,description:``}],S=[{"stage-name":`一か月前その3`,description:`レイ・コウダ`},{"stage-name":`Fog`,description:``},{"stage-name":`Stone`,description:``},{"stage-name":`Dust`,description:``}],C=[{"act-name":`Light`,description:``,stages:y},{"act-name":`Dark`,description:``,stages:b},{"act-name":`High`,description:``,stages:x},{"act-name":`Low`,description:``,stages:S}],w=[{"stage-name":`隣`,description:``},{"stage-name":`Glass`,description:``},{"stage-name":`Ice`,description:``},{"stage-name":`Haze`,description:``}],T=[{"stage-name":`人`,description:``},{"stage-name":`Veil`,description:``},{"stage-name":`Frost`,description:``},{"stage-name":`Dusk`,description:``}],E=[{"stage-name":`心`,description:``},{"stage-name":`Lead`,description:``},{"stage-name":`Clay`,description:``},{"stage-name":`Tar`,description:``}],D=[{"stage-name":`信じましたが`,description:``},{"stage-name":`Phosphor`,description:``},{"stage-name":`Glow`,description:``},{"stage-name":`Dawn`,description:``}],O=[{"act-name":`Clear`,description:``,stages:w},{"act-name":`Translucent`,description:``,stages:T},{"act-name":`Opaque`,description:``,stages:E},{"act-name":`Luminous`,description:``,stages:D}],k=[{"chapter-name":`Hue`,description:`小さめの飛行兵器`,acts:p},{"chapter-name":`Saturation`,description:``,acts:v},{"chapter-name":`Brightness`,description:``,acts:C},{"chapter-name":`Alpha`,description:``,acts:O}],A=k.map(e=>e[`chapter-name`]),j=k.flatMap(e=>e.acts.map(e=>e[`act-name`]));k.flatMap(e=>e.acts.flatMap(e=>e.stages.flatMap(e=>e[`stage-name`])));var M=class{static sum(e){return e.reduce((e,t)=>e+t,0)}static sorted012(e){return e.toSorted((e,t)=>e-t)}static sorted210(e){return e.toSorted((e,t)=>t-e)}},N=class{pages=new e;selector;constructor(e={}){this.config=e,this.selector=new c({"[data-stage]":{alias:`stage-button`,expectedCount:64},".act-button":{alias:`act-button`,expectedCount:16},".chapter-button":{alias:`chapter-button`,expectedCount:4},"#swipe-ratio":{alias:`swipe-ratio`},"#volume-bgm":{alias:`volume-bgm`},"#volume-se":{alias:`volume-se`},"#delete-data":{alias:`delete-data`}})}async start(){o.container.style.opacity=`0`,o.container.innerHTML=``;let e=P();o.container.insertAdjacentHTML(`beforeend`,e),await this.pages.loadFromFile(o.container,`./asset/page/title/title.html`,{history:this.config.history??[`title`],override:!1}),o.container.style.opacity=`1`,this.selector.load(o.container),this.selector.onClick(`stage-button`,({element:e,index:t})=>{let n=e.dataset.stage;if(!n)throw Error(`Stage name is missing`);this.gotoStage(t,n)}),this.setupSetting(),this.lockButtons(),this.evaluateStageCleared(),this.setupUnlockAnimation(),this.unlockStage(),this.lock(this.selector.getAll(`stage-button`,HTMLButtonElement)[18],`unimplemented`)}setupUnlockAnimation(){this.pages.onEnter(`act-.*`,async()=>{this.unlockStage()}),this.pages.onEnter(`chapter-.*`,async()=>{this.unlockAct()})}async unlockAct(){if(this.config.clear===void 0||this.config.clear%4!=3)return;let e=n.getFirstUncleared();if(this.config.clear+1<e)return;let t=A[Math.floor(this.config.clear/16)];if(this.pages.getCurrentPageId()!==`chapter-`+t)return;let r=Math.floor(this.config.clear/4)+1,i=this.selector.getAll(`act-button`,HTMLButtonElement)[r];i&&await this.unlockButtonAnimation(i)}async unlockStage(){if(this.config.clear===17||this.config.clear===void 0)return;let e=n.getFirstUncleared();if(this.config.clear+1<e)return;let t=this.config.clear+1,r=j[Math.floor(t/4)];if(this.pages.getCurrentPageId()!==`act-`+r)return;let i=this.selector.getAll(`stage-button`,HTMLButtonElement)[t];i&&await this.unlockButtonAnimation(i)}async unlockButtonAnimation(e){this.lock(e),e.disabled=!1;let t=e.querySelector(`.lock.lock-normal`);t.classList.add(`unlocking`),i.unlock.play(),await r.sleep(1e3),t.remove()}setupSetting(){let e=this.selector.getFirst(`swipe-ratio`,s);e.oninput=()=>{n.setSwipeRatio(e.value)};let t=this.selector.getFirst(`volume-bgm`,s);t.oninput=()=>{n.setVolumeBGM(t.value)};let r=this.selector.getFirst(`volume-se`,s);r.oninput=()=>{n.setVolumeSE(r.value),i.setVolume(n.getVolumeSE()/9)},e.value=n.getSwipeRatio(),t.value=n.getVolumeBGM(),r.value=n.getVolumeSE(),this.selector.onClick(`delete-data`,()=>{confirm(`データを初期化する?`)&&(n.clear(),alert(`データを初期化した`),this.setupSetting(),this.lockButtons(),this.evaluateStageCleared())})}lockButtons(){let e=n.getFirstUncleared(),t=Math.floor(e/4),r=Math.floor(t/4);this.selector.getAll(`stage-button`,HTMLButtonElement).forEach((t,n)=>{n>e&&this.lock(t)}),this.selector.getAll(`act-button`,HTMLButtonElement).forEach((e,n)=>{n>t&&this.lock(e)}),this.selector.getAll(`chapter-button`,HTMLButtonElement).forEach((e,t)=>{t>r&&this.lock(e)})}lock(e,t=`normal`){let n=t===`normal`?`--:: 封 ::--`:`×=× 未 ×=×`,r=t===`normal`?`lock-normal`:`lock-unimplemented`;e.insertAdjacentHTML(`beforeend`,`<div class="lock ${r}">${n}</div>`),e.disabled=!0}evaluateStageCleared(){let e=n.getStages(),t=`var(--gold)`,r=`var(--silver)`;this.selector.getAll(`stage-button`).forEach((n,i)=>{let a=n.querySelector(`.rank`),o=e[i];if(o===0){a.textContent=``;return}a.textContent=`★`,a.style.background=o===2?t:r,a.style.backgroundClip=`text`,a.style.webkitTextFillColor=`transparent`}),this.selector.getAll(`act-button`).forEach((n,i)=>{let a=i*4,o=e.slice(a,a+4),s=n.querySelector(`.rank`);s.innerHTML=o.map(e=>e===0?`<span>☆</span>`:`<span style="background: ${e===2?t:r}; background-clip: text;">★</span>`).join(``)}),this.selector.getAll(`chapter-button`).forEach((t,n)=>{let r=n*4*4,i=e.slice(r,r+16),a=Math.floor(M.sum(i)/32*100),o=t.querySelector(`.rank`);o.innerHTML=`${a}%`})}async end(){}gotoStage(e,n){i.start.play(),document.querySelectorAll(`button`).forEach(e=>e.disabled=!0);let r=A[Math.floor(e/16)];t.goto(async()=>{let{default:t}=await Object.assign({"../Stage/Hue/StageBlack.ts":()=>a(()=>import(`./StageBlack.js`),__vite__mapDeps([0,1,2,3,4,5]),import.meta.url),"../Stage/Hue/StageBlue.ts":()=>a(()=>import(`./StageBlue.js`),__vite__mapDeps([6,1,2,3,4,7,5]),import.meta.url),"../Stage/Hue/StageCrimson.ts":()=>a(()=>import(`./StageCrimson.js`),__vite__mapDeps([8,1,2,3,4,7,5]),import.meta.url),"../Stage/Hue/StageCyan.ts":()=>a(()=>import(`./StageCyan.js`),__vite__mapDeps([9,1,2,3,4,7,5]),import.meta.url),"../Stage/Hue/StageDust.ts":()=>a(()=>import(`./StageDust.js`),__vite__mapDeps([10,2,1,5]),import.meta.url),"../Stage/Hue/StageGray.ts":()=>a(()=>import(`./StageGray.js`),__vite__mapDeps([11,1,2,3,4,7,5]),import.meta.url),"../Stage/Hue/StageGreen.ts":()=>a(()=>import(`./StageGreen.js`),__vite__mapDeps([12,1,2,3,4,7,5]),import.meta.url),"../Stage/Hue/StageNavy.ts":()=>a(()=>import(`./StageNavy.js`),__vite__mapDeps([13,1,2,3,4,7,5]),import.meta.url),"../Stage/Hue/StageOrange.ts":()=>a(()=>import(`./StageOrange.js`),__vite__mapDeps([14,1,2,3,4,7,5]),import.meta.url),"../Stage/Hue/StagePurple.ts":()=>a(()=>import(`./StagePurple.js`),__vite__mapDeps([15,1,2,3,4,7,5]),import.meta.url),"../Stage/Hue/StageSILO.ts":()=>a(()=>import(`./StageSILO.js`),__vite__mapDeps([16,2,1,5]),import.meta.url),"../Stage/Hue/StageTutorial.ts":()=>a(()=>import(`./StageTutorial.js`),__vite__mapDeps([17,1,2,3,4,7,5,18]),import.meta.url),"../Stage/Hue/StageViolet.ts":()=>a(()=>import(`./StageViolet.js`),__vite__mapDeps([19,1,2,3,4,7,5]),import.meta.url),"../Stage/Hue/StageWhite.ts":()=>a(()=>import(`./StageWhite.js`),__vite__mapDeps([20,1,2,3,4,7,5]),import.meta.url),"../Stage/Hue/StageYellow.ts":()=>a(()=>import(`./StageYellow.js`),__vite__mapDeps([21,1,2,3,4,7,5]),import.meta.url),"../Stage/Hue/Stage機械大戦.ts":()=>a(()=>import(`./Stage機械大戦.js`),__vite__mapDeps([22,2,1,5]),import.meta.url),"../Stage/Saturation/StageScarlet.ts":()=>a(()=>import(`./StageScarlet.js`),__vite__mapDeps([23,1,2,3,4,7,5]),import.meta.url),"../Stage/Saturation/Stageアオ.ts":()=>a(()=>import(`./Stageアオ.js`),__vite__mapDeps([24,2,1,5]),import.meta.url)})[`../Stage/${r}/Stage${n}.ts`](),i=new t;return await a(()=>import(`./SceneStage.js`).then(t=>new t.default(e,i,this.pages.getHistory())),__vite__mapDeps([25,26,1,2,4,27]),import.meta.url)},{msIn:1e3,msOut:1e3})}};function P(){return`
        <div class="page" id="chapters">
            <section class="page-description">
                <h2>Chapters</h2>
                <p>西暦2XXX年 トウキョウ</p>
            </section>

            <div class="options" data-direction="column">${k.map(F).join(``)}</div>

            <div class="options" data-direction="row"><button data-back>Back</button></div>
        </div>
    `+k.map(e=>`
                <div class="page" id="chapter-${e[`chapter-name`]}">
                    <section class="page-description">
                        <h2>Chapters > ${e[`chapter-name`]}</h2>
                        <p>${e.description}</p>
                    </section>

                    <div class="options" data-direction="column">
                        ${e.acts.map(I).join(``)}
                    </div>

                    <div class="options" data-direction="row"><button data-back>Back</button></div>
                </div>
            `+e.acts.map(t=>L(e[`chapter-name`],t)).join(``)).join(``)}function F(e){return`
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
    `}function I(e){return`
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
    `}function L(e,t){return`
        <div class="page" id="act-${t[`act-name`]}">
            <section class="page-description">
                <h3>Chapters > ${e} > ${t[`act-name`]}</h3>
                <p>${t.description}</p>
            </section>

            <div class="options" data-direction="column">
                ${t.stages.map(R).join(``)}
            </div>

            <div class="options" data-direction="row"><button data-back>Back</button></div>
        </div>
    `}function R(e){return`
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
    `}export{N as default};
//# sourceMappingURL=SceneTitle.js.map