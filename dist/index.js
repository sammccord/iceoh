function t(){return(t=Object.assign||function(t){for(var i=1;i<arguments.length;i++){var e=arguments[i];for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])}return t}).apply(this,arguments)}var i,e=Math.atan(.5),n=Math.PI/6,s=Math.PI/4,r={x:0,y:0},o={x:.5,y:.5},h={x:1,y:1};function a(t,i,e){for(var n=t;i.length-1;){var s=i.shift();s in n||(n[s]={}),n=n[s]}return n[i[0]]=e,n[i[0]]}function l(t,i,e){for(var n=t;i.length;){var s=i.shift();if(!(s in n)){if(!e)return;n[s]={},i.length||(n[s]=e)}n=n[s]}return n}function u(t){return t.reduce(function(t,i){return i?t+i:t},0)}(i=exports.DIRECTION||(exports.DIRECTION={})).NONE="NONE",i.N="N",i.NE="NE",i.E="E",i.SE="SE",i.S="S",i.SW="SW",i.W="W",i.NW="NW";var p=function(){function t(t){var i=t.worldOrigin,e=t.baseTileOrigin,n=t.baseTileDimensions,s=t.getGlobalDimensions,a=t.getWorldPosition,l=t.getWorldScale;this.worldOrigin=o,this.baseTileOrigin=o,this.tiles=[],this.map={},this.worldOrigin=i||o,this.baseTileOrigin=e||o,this.baseTileDimensions=n,this.getGlobalDimensions=s,this.getWorldPosition=a||function(){return r},this.getWorldScale=l||function(){return h}}var i,e=t.prototype;return e.add=function(t,i,e,n){void 0===e&&(e=this.baseTileDimensions),void 0===n&&(n=this.baseTileOrigin),this.tiles.push(t);var s=this.tiles[this.tiles.indexOf(t)];return a(this.map,[i.z,i.x,i.y],s),this._project(this._getAbsolutePosition(i),e,n)},e.get=function(t){return l(this.map,[t.z||0,t.x,t.y])},e.getColumn=function(t,i){return Object.entries(i||this.map).map(function(i){return l(i[1],[t.x,t.y])})},e.move=function(t,i,e,n){void 0===e&&(e=this.baseTileDimensions),void 0===n&&(n=this.baseTileOrigin);var s=this.remove(t);return s?this.add(s,i,e,n):null},e.remove=function(t){var i=this.get(t);return i?(delete this.map[t.z][t.x][t.y],this.tiles.splice(this.tiles.indexOf(i),1)[0]):null},e.toPoint=function(t,i,e){void 0===i&&(i=this.baseTileDimensions),void 0===e&&(e=this.baseTileOrigin);var n=this.getWorldScale(),s=this.getWorldPosition(),r=this._project(this._getAbsolutePosition(t,i,e));return r.x+=r.x*(n.x-1)+s.x,r.y+=r.y*(n.y-1)+s.y,r},e.toTile=function(t,i,e){void 0===i&&(i=this.baseTileDimensions);var n=this._unproject(t);return{x:Math.round(n.x/i.width),y:Math.round(n.y/i.height),z:t.z||0}},e.centerToTile=function(t){return this.centerToPoint(this.toPoint(t))},e.centerToPoint=function(t){var i=this.getGlobalDimensions(),e=this.getWorldPosition();return{x:e.x+i.width/2-t.x,y:e.y+i.height/2-t.y}},e.center=function(){return this.centerToTile(this.centerTile)},e.getBounds=function(){var t=Object.values(this.map),i=t.map(function(t){return Object.keys(t).map(Number)}).flat(),e=t.map(Object.values).flat().map(function(t){return Object.keys(t).map(Number)}).flat(),n=Math.min.apply(Math,i),s=Math.max.apply(Math,i),r=Math.min.apply(Math,e),o={x:0,y:0,width:s-r,height:Math.max.apply(Math,e)-r,depth:t.length};return o.x=Math.round(n+o.width/2),o.y=Math.round(r+o.height/2),o},e._project=function(t,i,e){var n=this.getGlobalDimensions();return{x:t.x+n.width*this.worldOrigin.x,y:t.y+n.height*this.worldOrigin.y,z:t.z||0}},e._unproject=function(t,i){void 0===i&&(i={x:0,y:0,z:0});var e=this.getGlobalDimensions(),n=e.height;return i.x=t.x-e.width*this.worldOrigin.x,i.y=t.y-n*this.worldOrigin.y+(t.z||0),i.z=t.z,i},e._getAbsolutePosition=function(t,i,e){return{x:this.baseTileDimensions.width*t.x,y:this.baseTileDimensions.height*t.y,z:t.z}},(i=[{key:"centerTile",get:function(){return this.getBounds()}}])&&function(t,i){for(var e=0;e<i.length;e++){var n=i[e];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}(t.prototype,i),t}(),c=function(i){var n,s;function r(n){var s,r=n.projectionAngle,o=void 0===r?e:r,h=function(t,i){if(null==t)return{};var e,n,s={},r=Object.keys(t);for(n=0;n<r.length;n++)i.indexOf(e=r[n])>=0||(s[e]=t[e]);return s}(n,["projectionAngle"]);return(s=i.call(this,t({},h))||this).transform=null,s.depthMap={},s.transform=[Math.cos(o),Math.sin(o)],s.baseOrigin={x:s.baseTileDimensions.width*s.baseTileOrigin.x,y:s.baseTileDimensions.height*s.baseTileOrigin.y},s.baseSurfaceHeight=s.baseTileDimensions.height-s.baseTileDimensions.depth,s.baseSurfaceHalfHeight=s.baseSurfaceHeight/2,s}s=i,(n=r).prototype=Object.create(s.prototype),n.prototype.constructor=n,n.__proto__=s;var o=r.prototype;return o.add=function(t,i,e,n){void 0===e&&(e=this.baseTileDimensions),void 0===n&&(n=this.baseTileOrigin),this.tiles.push(t);var s=this.tiles[this.tiles.indexOf(t)];if(e!==this.baseTileDimensions)for(var r=e.depth/this.baseTileDimensions.depth,o=i.z;r>0;r--,o++)a(this.depthMap,[o,i.x,i.y],r>1?this.baseTileDimensions.depth:this.baseTileDimensions.depth*r),a(this.map,[o,i.x,i.y],s);else a(this.depthMap,[i.z,i.x,i.y],this.baseTileDimensions.depth),a(this.map,[i.z,i.x,i.y],s);return this._project(this._getAbsolutePosition(i),e,n,u(this.getColumn(i,this.depthMap).slice(1,i.z)))},o.remove=function(t){var i=this,e=this.get(t);return e?(Object.entries(this.map).forEach(function(n){var s=n[0],r=n[1];try{r[t.x][t.y]===e&&(delete i.depthMap[s][t.x][t.y],delete i.map[s][t.x][t.y])}catch(t){}}),this.tiles.splice(this.tiles.indexOf(e),1)[0]):null},o.toTile=function(t,i,e){void 0===i&&(i=this.baseTileDimensions),void 0===e&&(e=this.baseTileOrigin);var n=this._unproject(t),s=i.width*e.x,r=i.width*e.y;return n.x=Math.floor((n.x+s)/s),n.y=Math.floor((n.y+r)/r),n.z=n.z||0,n},o._project=function(t,i,e,n){void 0===i&&(i=this.baseTileDimensions),void 0===e&&(e=this.baseTileOrigin),void 0===n&&(n=0);var s={x:(t.x-t.y)*this.transform[0],y:(t.x+t.y)*this.transform[1],z:t.z||0},r=this.getGlobalDimensions(),o=r.height;return s.x+=r.width*this.worldOrigin.x,s.y+=+o*this.worldOrigin.y,s.z=(t.x+t.y)*(t.z+1||1),i!==this.baseTileDimensions?(s.y-=this.baseSurfaceHalfHeight+0-this.baseTileOrigin.y,s.y+=i.height*e.y-(i.height-(i.height-i.depth)/2),s.y-=n):s.y-=this.baseTileDimensions.depth*t.z,s},o._unproject=function(t,i){void 0===i&&(i={x:0,y:0,z:0});var e=this.getGlobalDimensions(),n=t.x-e.width*this.worldOrigin.x,s=t.y-e.height*this.worldOrigin.y;return i.x=n/(2*this.transform[0])+s/(2*this.transform[1]),i.y=-n/(2*this.transform[0])+s/(2*this.transform[1]),i.z=t.z||0,i},o._getAbsolutePosition=function(t,i,e){return void 0===i&&(i=this.baseTileDimensions),void 0===e&&(e=this.baseTileOrigin),{x:i.width*e.x*t.x,y:i.width*e.y*t.y,z:t.z||0}},r}(p);exports.CLASSIC=e,exports.FULL=h,exports.ISOMETRIC=n,exports.IsoTilemap=c,exports.MIDDLE=o,exports.MILITARY=s,exports.TOP_LEFT=r,exports.Tilemap=p,exports.get=l,exports.getDirection=function(t,i){var e=i.x-t.x,n=i.y-t.y;return 0===e&&n<0?exports.DIRECTION.N:e>0&&n<0?exports.DIRECTION.NE:e>0&&0===n?exports.DIRECTION.E:e>0&&n>0?exports.DIRECTION.SE:0===e&&n>0?exports.DIRECTION.S:e<0&&n>0?exports.DIRECTION.SW:e<0&&0===n?exports.DIRECTION.W:e<0&&n<0?exports.DIRECTION.NW:exports.DIRECTION.NONE},exports.getDistance=function(t,i){return Math.sqrt((i.x-t.x)*(i.x-t.x)+(i.y-t.y)*(i.y-t.y))},exports.set=a,exports.sum=u;
//# sourceMappingURL=index.js.map
