var e=Object.defineProperty,t=(t,r,i)=>((t,r,i)=>r in t?e(t,r,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[r]=i)(t,"symbol"!=typeof r?r+"":r,i);import{A as r,x as i,y as n,u as a}from"./preact-DoPIZWeU.js";import{S as s,G as o,A as h,a as d}from"./render-D473Hyb3.js";import{A as l,c,S as p}from"./main-DmEDFPQH.js";const u="_snow_hp0qe_1";function w(e,t){return Math.random()*(t-e)+e}const m=class e extends s{constructor(r){super(e.texture),t(this,"vx"),t(this,"vy"),this.x=r.x,this.y=r.y,this.vx=r.vx,this.vy=r.vy,this.alpha=r.alpha}static getRandomParticle(){return new e({x:w(0,e.app.renderer.width),y:-5,vx:w(-2,2),vy:w(8,10),alpha:w(0,1)})}static getRandomParticles(t){return Array.from({length:t},((t,r)=>e.getRandomParticle()))}reset(){this.x=w(0,e.app.renderer.width),this.y=0,this.vx=w(-3,3)}randomize(){this.vx+=w(-1,1),this.vy=w(2,6)}update(t){this.y>0&&(this.x+=this.vx),this.y+=this.vy,Math.random()>.9&&this.randomize();(this.x>e.app.renderer.width||this.x<0||this.y>e.app.renderer.height)&&this.reset()}};t(m,"graphics",(new o).beginFill(new l(16777215)).drawCircle(c.snow.size/2,c.snow.size/2,c.snow.size).endFill()),t(m,"texture"),t(m,"app");let x=m;function v(){if(![11,0,1].includes((new Date).getMonth()))return null;const e=r(null),t=i(p);if(t.load(),!t.settings.value.enableSnow)return null;function s(){const t=new h({width:window.innerWidth,height:window.innerHeight,resizeTo:window,view:e.current,backgroundAlpha:0,antialias:!0});x.texture=t.renderer.generateTexture(x.graphics),x.app=t;const r=x.getRandomParticles(c.snow.amount),i=new d(c.snow.amount,{scale:!0,position:!0});r.forEach((e=>i.addChild(e))),t.stage.addChild(i),t.ticker.add((e=>r.forEach((t=>t.update(e)))))}return n(s,[]),n(s,[t.settings.value]),a("canvas",{ref:e,className:u})}export{v as Snow};