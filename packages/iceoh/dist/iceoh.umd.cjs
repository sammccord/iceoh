(function(o,c){typeof exports=="object"&&typeof module<"u"?c(exports):typeof define=="function"&&define.amd?define(["exports"],c):(o=typeof globalThis<"u"?globalThis:o||self,c(o.Iceoh={}))})(this,function(o){"use strict";var F=Object.defineProperty;var X=(o,c,d)=>c in o?F(o,c,{enumerable:!0,configurable:!0,writable:!0,value:d}):o[c]=d;var a=(o,c,d)=>(X(o,typeof c!="symbol"?c+"":c,d),d);const c=Math.atan(.5),d=Math.PI/6,j=Math.PI/4,P={x:0,y:0},T={x:.5,y:.5},v={x:1,y:1};var W=(h=>(h.NONE="NONE",h.N="N",h.NE="NE",h.E="E",h.SE="SE",h.S="S",h.SW="SW",h.W="W",h.NW="NW",h))(W||{});function H(h){const i=[];for(const e of[...h.keys()].sort()){const t=h.get(e);for(const s of[...t.keys()].sort()){const n=t.get(s);for(const r of[...n.keys()].sort())i.push(n.get(r))}}return i}function y(h,i,e){let t=h;for(;i.length-1;){var s=i.shift();let n=t.get(s);if(n)t=n;else{const r=new Map;t.set(s,r),t=r}}return t.set(i[0],e),e}function w(h,i,e){for(var t=h;i.length;){var s=i.shift();let n=t.get(s);if(!n){if(e&&!i.length)return t.set(s,e),e;if(e)n=new Map,t.set(s,n);else return}t=n}return t}function _(h,i){return w(h,[i.z||0,i.x,i.y])}function S(h,i){let e=h;for(;i.length-1;){var t=i.shift();let s=e.get(t);if(s)e=s;else return!1}return e.delete(i[0])}function A(h,i){return Math.sqrt((i.x-h.x)*(i.x-h.x)+(i.y-h.y)*(i.y-h.y))}function B(h){return{x:O(h.map(i=>i.x))/h.length,y:O(h.map(i=>i.y))/h.length}}function O(h){return h.reduce((i,e)=>e?i+e:i,0)}const u=0;function N(h,i){let e=i.x-h.x,t=i.y-h.y;return e===u&&t<u?"N":e>u&&t<u?"NE":e>u&&t===u?"E":e>u&&t>u?"SE":e===u&&t>u?"S":e<u&&t>u?"SW":e<u&&t===u?"W":e<u&&t<u?"NW":"NONE"}class C{constructor({worldOrigin:i,baseTileOrigin:e,baseTileDimensions:t,getScreenDimensions:s,getWorldPosition:n,getWorldScale:r}){a(this,"getScreenDimensions");a(this,"getWorldPosition");a(this,"getWorldScale");a(this,"baseTileDimensions");a(this,"worldOrigin",T);a(this,"baseTileOrigin",T);a(this,"map",new Map);a(this,"bounds",{x:{min:0,max:0},y:{min:0,max:0},z:{min:0,max:0}});this.worldOrigin=i||T,this.baseTileOrigin=e||T,this.baseTileDimensions=t,this.getScreenDimensions=s,this.getWorldPosition=n||(()=>P),this.getWorldScale=r||(()=>v)}add(i,e,t=this.baseTileDimensions,s=this.baseTileOrigin){return y(this.map,[e.z||0,e.x,e.y],i),this.recalculateBounds(e),this.toWorldPoint(e,t,s)}get(i){return _(this.map,i)}getColumn(i,e){const t=[];for(const[s,n]of e||this.map)t[s]=w(n,[i.x,i.y]);return t}move(i,e,t=this.baseTileDimensions,s=this.baseTileOrigin){const n=this.remove(i);return n?this.add(n,e,t,s):null}remove(i){i.z===void 0&&(i.z=0);const e=this.get(i);if(!!e)return S(this.map,[i.z||0,i.x,i.y]),this.recalculateBounds(i),e}toScreenPoint(i,e=this.baseTileDimensions,t=this.baseTileOrigin){const s=this.toWorldPoint(i,e,t),n=this.getWorldScale(),r=this.getWorldPosition();return s.x=s.x*n.x+r.x,s.y=s.y*n.y+r.y,s}toWorldPoint(i,e=this.baseTileDimensions,t=this.baseTileOrigin){return this._project(this._getAbsolutePosition(i),e,t)}worldToTile(i,e=this.baseTileDimensions,t=this.baseTileOrigin){const s=this._unproject(i);return{x:Math.round(s.x/e.width),y:Math.round(s.y/e.height),z:i.z||0}}centerToTile(i){return this.centerToPoint(this.toScreenPoint(i))}centerToPoint(i){const e=this.getScreenDimensions(),t=this.getWorldPosition();return{x:t.x+e.width/2-i.x,y:t.y+e.height/2-i.y}}get centerTile(){return this.getBounds()}center(){return this.centerToTile(this.centerTile)}getBounds(){const i={x:0,y:0,width:this.bounds.x.max-this.bounds.x.min,height:this.bounds.y.max-this.bounds.y.min,depth:this.bounds.z.max-this.bounds.z.min};return i.x=Math.round(this.bounds.x.min+i.width/2),i.y=Math.round(this.bounds.y.min+i.height/2),i}recalculateBounds(i){i.x<this.bounds.x.min&&(this.bounds.x.min=i.x),i.x>this.bounds.x.max&&(this.bounds.x.max=i.x),i.y<this.bounds.y.min&&(this.bounds.y.min=i.y),i.y>this.bounds.y.max&&(this.bounds.y.max=i.y),i.z!==void 0&&(i.z<this.bounds.z.min&&(this.bounds.z.min=i.z),i.z>this.bounds.z.max&&(this.bounds.z.max=i.z))}_project(i,e=this.baseTileDimensions,t=this.baseTileOrigin,s=0){const{width:n,height:r}=this.getScreenDimensions();return{x:i.x+n*this.worldOrigin.x,y:i.y+r*this.worldOrigin.y,z:i.z||0}}_unproject(i,e={x:0,y:0,z:0}){const{width:t,height:s}=this.getScreenDimensions();return e.x=i.x-t*this.worldOrigin.x,e.y=i.y-s*this.worldOrigin.y+(i.z||0),e.z=i.z||0,e}_getAbsolutePosition(i,e=this.baseTileDimensions,t=this.baseTileOrigin){return{x:e.width*i.x,y:e.height*i.y,z:i.z||0}}}class Y extends C{constructor({angle:e=c,clamp:t=!0,...s}){super({...s});a(this,"angle");a(this,"angleCos");a(this,"angleSin");a(this,"clamp");a(this,"baseOrigin");a(this,"baseSurfaceHeight");a(this,"baseSurfaceHalfHeight");a(this,"tileDimensions",new Map);this.angle=e,this.angleCos=Math.cos(this.angle),this.angleSin=Math.sin(this.angle),this.clamp=t,this.baseOrigin={x:this.baseTileDimensions.width*this.baseTileOrigin.x,y:this.baseTileDimensions.height*this.baseTileOrigin.y},this.baseSurfaceHeight=this.baseTileDimensions.height-this.baseTileDimensions.depth,this.baseSurfaceHalfHeight=this.baseSurfaceHeight/2}add(e,t,s=this.baseTileDimensions,n=this.baseTileOrigin){const r=this.toWorldPoint(t,s,n);if(s!==this.baseTileDimensions){let x=(s.depth||this.baseTileDimensions.depth)/this.baseTileDimensions.depth;for(let l=x,g=t.z||0;l>0;l--,g++)l>1?y(this.tileDimensions,[g,t.x,t.y],{...s,origin:n,depth:this.baseTileDimensions.depth,z:g,x:r.x,y:r.y,value:e}):y(this.tileDimensions,[g,t.x,t.y],{...s,origin:n,depth:this.baseTileDimensions.depth*l,z:g,x:r.x,y:r.y,value:e}),y(this.map,[g,t.x,t.y],t)}else y(this.tileDimensions,[t.z||0,t.x,t.y],{...s,origin:n,z:t.z||0,x:r.x,y:r.y,value:e}),y(this.map,[t.z||0,t.x,t.y],t);return this.recalculateBounds(t),r}remove(e){const t=this.get(e);if(!t)return null;for(const[s,n]of this.map)try{w(n,[e.x,e.y])===t&&(S(this.tileDimensions,[s,e.x,e.y]),S(this.map,[s,e.x,e.y]))}catch{}return this.recalculateBounds(e),t}worldToTile(e,t=this.baseTileDimensions,s=this.baseTileOrigin){const n=this._unproject(e),r={x:t.width*s.x,y:t.width*s.y};return n.x=Math.floor((n.x+r.x)/r.x),n.y=Math.floor((n.y+r.y)/r.y),n.z=n.z||0,n}toWorldPoint(e,t=this.baseTileDimensions,s=this.baseTileOrigin){return this._project(this._getAbsolutePosition(e),t,s,O(this.getDimensionsColumn(e).map(n=>(n==null?void 0:n.depth)||this.baseTileDimensions.depth).slice(1,e.z||0)))}getDimensionsColumn(e){return this.getColumn(e,this.tileDimensions)}castRay(e,t){const s=this.worldToTile(e);for(let n=this.bounds.z.max;n>=this.bounds.z.min;n--){const r=s.x+n,x=s.y+n;for(let l of this.getDimensionsColumn({x:r,y:x}).reverse()){if(!l)continue;const{x:g,y:z,value:f,origin:m,width:D,height:M,tile:b}=l;if(e.x>=g-D*m.x&&e.x<=g+D*m.x&&e.y>=z-M*m.y&&e.y<=z+M*m.y)if(t){if(t(f,b))return f}else return f}}}collisionMap(e,t){const s=new Map,n=this.worldToTile(e);for(let r=this.bounds.z.min;r<=this.bounds.z.max;r++){let x=!1;const l=n.x+r,g=n.y+r;for(let z of this.getDimensionsColumn({x:l,y:g})){if(!z)continue;const{x:f,y:m,value:D,z:M,origin:b,width:E,height:L,tile:k}=z;if(e.x>=f-E*b.x&&e.x<=f+E*b.x&&e.y>=m-L*b.y&&e.y<=m+L*b.y){if(t&&!t(D,k))continue;x=!0,y(s,[M,l,g],D)}else if(x)break}}return s}_project(e,t=this.baseTileDimensions,s=this.baseTileOrigin,n=0){const{width:r,height:x}=this.getScreenDimensions(),l={x:(e.x-e.y)*this.angleCos+r*this.worldOrigin.x,y:(e.x+e.y)*this.angleSin+x*this.worldOrigin.y,z:(e.x+e.y)*(e.z+1||1)};return t!==this.baseTileDimensions?(l.y-=this.baseSurfaceHalfHeight+0-this.baseTileOrigin.y,l.y+=t.height*s.y-(t.height-(t.height-t.depth)/2),l.y-=n):l.y-=this.baseTileDimensions.depth*e.z,this.clamp&&(l.x=~~(l.x+(l.x>0?.5:-.5)),l.y=~~(l.y+(l.y>0?.5:-.5))),l}_unproject(e,t={x:0,y:0,z:0}){const s=this.getScreenDimensions(),n=e.x-s.width*this.worldOrigin.x,r=e.y-s.height*this.worldOrigin.y;return t.x=n/(2*this.angleCos)+r/(2*this.angleSin),t.y=-(n/(2*this.angleCos))+r/(2*this.angleSin),t.z=e.z||0,t}_getAbsolutePosition(e,t=this.baseTileDimensions,s=this.baseTileOrigin){return{x:t.width*s.x*e.x,y:t.height*s.y*e.y,z:e.z||0}}}o.CLASSIC=c,o.DIRECTION=W,o.FULL=v,o.ISOMETRIC=d,o.IsoTilemap=Y,o.MIDDLE=T,o.MILITARY=j,o.TOP_LEFT=P,o.Tilemap=C,o.collectRay=H,o.get=w,o.getCenter=B,o.getDirection=N,o.getDistance=A,o.pointGet=_,o.remove=S,o.set=y,o.sum=O,Object.defineProperties(o,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
