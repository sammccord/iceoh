function i(){return(i=Object.assign||function(i){for(var t=1;t<arguments.length;t++){var e=arguments[t];for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(i[n]=e[n])}return i}).apply(this,arguments)}var t,e=Math.atan(.5),n=Math.PI/6,s=Math.PI/4,r={x:0,y:0},o={x:.5,y:.5},h={x:1,y:1};function a(i,t,e){for(var n=i;t.length-1;){var s=t.shift();s in n||(n[s]={}),n=n[s]}return n[t[0]]=e,n[t[0]]}function l(i,t,e){for(var n=i;t.length;){var s=t.shift();if(!(s in n)){if(!e)return;n[s]={},t.length||(n[s]=e)}n=n[s]}return n}function u(i){return i.reduce(function(i,t){return t?i+t:i},0)}(t=exports.DIRECTION||(exports.DIRECTION={})).NONE="NONE",t.N="N",t.NE="NE",t.E="E",t.SE="SE",t.S="S",t.SW="SW",t.W="W",t.NW="NW";var p=function(){function i(i){var t=i.worldOrigin,e=i.baseTileOrigin,n=i.baseTileDimensions,s=i.getGlobalDimensions,a=i.getWorldPosition,l=i.getWorldScale;this.worldOrigin=o,this.baseTileOrigin=o,this.tiles=[],this.map={},this.worldOrigin=t||o,this.baseTileOrigin=e||o,this.baseTileDimensions=n,this.getGlobalDimensions=s,this.getWorldPosition=a||function(){return r},this.getWorldScale=l||function(){return h}}var t,e=i.prototype;return e.add=function(i,t,e,n){void 0===e&&(e=this.baseTileDimensions),void 0===n&&(n=this.baseTileOrigin),this.tiles.push(i);var s=this.tiles[this.tiles.indexOf(i)];return a(this.map,[t.z,t.x,t.y],s),this._project(this._getAbsolutePosition(t),e,n)},e.get=function(i){return l(this.map,[i.z||0,i.x,i.y])},e.getColumn=function(i,t){return Object.entries(t||this.map).map(function(t){return l(t[1],[i.x,i.y])})},e.move=function(i,t,e,n){void 0===e&&(e=this.baseTileDimensions),void 0===n&&(n=this.baseTileOrigin);var s=this.remove(i);return s?this.add(s,t,e,n):null},e.remove=function(i){var t=this.get(i);return t?(delete this.map[i.z][i.x][i.y],this.tiles.splice(this.tiles.indexOf(t),1)[0]):null},e.toPoint=function(i,t,e){void 0===t&&(t=this.baseTileDimensions),void 0===e&&(e=this.baseTileOrigin);var n=this.getWorldScale(),s=this.getWorldPosition(),r=this._project(this._getAbsolutePosition(i,t,e));return r.x+=r.x*(n.x-1)+s.x,r.y+=r.y*(n.y-1)+s.y,r},e.toTile=function(i,t,e){void 0===t&&(t=this.baseTileDimensions);var n=this._unproject(i);return{x:Math.round(n.x/t.width),y:Math.round(n.y/t.height),z:i.z||0}},e.centerToTile=function(i){return this.centerToPoint(this.toPoint(i))},e.centerToPoint=function(i){var t=this.getGlobalDimensions(),e=this.getWorldPosition();return{x:e.x+t.width/2-i.x,y:e.y+t.height/2-i.y}},e.center=function(){return this.centerToTile(this.centerTile)},e.getBounds=function(){var i=Object.values(this.map),t=i.map(function(i){return Object.keys(i).map(Number)}).flat(),e=i.map(Object.values).flat().map(function(i){return Object.keys(i).map(Number)}).flat(),n=Math.min.apply(Math,t),s=Math.max.apply(Math,t),r=Math.min.apply(Math,e),o={x:0,y:0,width:s-r,height:Math.max.apply(Math,e)-r,depth:i.length};return o.x=Math.round(n+o.width/2),o.y=Math.round(r+o.height/2),o},e._project=function(i,t,e){var n=this.getGlobalDimensions();return{x:i.x+n.width*this.worldOrigin.x,y:i.y+n.height*this.worldOrigin.y,z:i.z||0}},e._unproject=function(i,t){void 0===t&&(t={x:0,y:0,z:0});var e=this.getGlobalDimensions(),n=e.height;return t.x=i.x-e.width*this.worldOrigin.x,t.y=i.y-n*this.worldOrigin.y+(i.z||0),t.z=i.z,t},e._getAbsolutePosition=function(i,t,e){return{x:this.baseTileDimensions.width*i.x,y:this.baseTileDimensions.height*i.y,z:i.z}},(t=[{key:"centerTile",get:function(){return this.getBounds()}}])&&function(i,t){for(var e=0;e<t.length;e++){var n=t[e];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(i,n.key,n)}}(i.prototype,t),i}(),c=function(t){var n,s;function r(n){var s,r=n.angle,o=void 0===r?e:r,h=n.clamp,a=void 0===h||h,l=function(i,t){if(null==i)return{};var e,n,s={},r=Object.keys(i);for(n=0;n<r.length;n++)t.indexOf(e=r[n])>=0||(s[e]=i[e]);return s}(n,["angle","clamp"]);return(s=t.call(this,i({},l))||this).depthMap={},s.angle=o,s.angleCos=Math.cos(s.angle),s.angleSin=Math.sin(s.angle),s.clamp=a,s.baseOrigin={x:s.baseTileDimensions.width*s.baseTileOrigin.x,y:s.baseTileDimensions.height*s.baseTileOrigin.y},s.baseSurfaceHeight=s.baseTileDimensions.height-s.baseTileDimensions.depth,s.baseSurfaceHalfHeight=s.baseSurfaceHeight/2,s}s=t,(n=r).prototype=Object.create(s.prototype),n.prototype.constructor=n,n.__proto__=s;var o=r.prototype;return o.add=function(i,t,e,n){void 0===e&&(e=this.baseTileDimensions),void 0===n&&(n=this.baseTileOrigin),this.tiles.push(i);var s=this.tiles[this.tiles.indexOf(i)];if(e!==this.baseTileDimensions)for(var r=e.depth/this.baseTileDimensions.depth,o=t.z;r>0;r--,o++)a(this.depthMap,[o,t.x,t.y],r>1?this.baseTileDimensions.depth:this.baseTileDimensions.depth*r),a(this.map,[o,t.x,t.y],s);else a(this.depthMap,[t.z,t.x,t.y],this.baseTileDimensions.depth),a(this.map,[t.z,t.x,t.y],s);return this._project(this._getAbsolutePosition(t),e,n,u(this.getColumn(t,this.depthMap).slice(1,t.z)))},o.remove=function(i){var t=this,e=this.get(i);return e?(Object.entries(this.map).forEach(function(n){var s=n[0],r=n[1];try{r[i.x][i.y]===e&&(delete t.depthMap[s][i.x][i.y],delete t.map[s][i.x][i.y])}catch(i){}}),this.tiles.splice(this.tiles.indexOf(e),1)[0]):null},o.toTile=function(i,t,e){void 0===t&&(t=this.baseTileDimensions),void 0===e&&(e=this.baseTileOrigin);var n=this._unproject(i),s=t.width*e.x,r=t.width*e.y;return n.x=Math.floor((n.x+s)/s),n.y=Math.floor((n.y+r)/r),n.z=n.z||0,n},o._project=function(i,t,e,n){void 0===t&&(t=this.baseTileDimensions),void 0===e&&(e=this.baseTileOrigin),void 0===n&&(n=0);var s=this.getGlobalDimensions(),r={x:(i.x-i.y)*this.angleCos+s.width*this.worldOrigin.x,y:(i.x+i.y)*this.angleSin+s.height*this.worldOrigin.y,z:(i.x+i.y)*(i.z+1||1)};return t!==this.baseTileDimensions?(r.y-=this.baseSurfaceHalfHeight+0-this.baseTileOrigin.y,r.y+=t.height*e.y-(t.height-(t.height-t.depth)/2),r.y-=n):r.y-=this.baseTileDimensions.depth*i.z,this.clamp&&(r.x=~~(r.x+(r.x>0?.5:-.5)),r.y=~~(r.y+(r.y>0?.5:-.5))),r},o._unproject=function(i,t){void 0===t&&(t={x:0,y:0,z:0});var e=this.getGlobalDimensions(),n=i.x-e.width*this.worldOrigin.x,s=i.y-e.height*this.worldOrigin.y;return t.x=n/(2*this.angleCos)+s/(2*this.angleSin),t.y=-n/(2*this.angleCos)+s/(2*this.angleSin),t.z=i.z||0,t},o._getAbsolutePosition=function(i,t,e){return void 0===t&&(t=this.baseTileDimensions),void 0===e&&(e=this.baseTileOrigin),{x:t.width*e.x*i.x,y:t.width*e.y*i.y,z:i.z||0}},r}(p);exports.CLASSIC=e,exports.FULL=h,exports.ISOMETRIC=n,exports.IsoTilemap=c,exports.MIDDLE=o,exports.MILITARY=s,exports.TOP_LEFT=r,exports.Tilemap=p,exports.get=l,exports.getDirection=function(i,t){var e=t.x-i.x,n=t.y-i.y;return 0===e&&n<0?exports.DIRECTION.N:e>0&&n<0?exports.DIRECTION.NE:e>0&&0===n?exports.DIRECTION.E:e>0&&n>0?exports.DIRECTION.SE:0===e&&n>0?exports.DIRECTION.S:e<0&&n>0?exports.DIRECTION.SW:e<0&&0===n?exports.DIRECTION.W:e<0&&n<0?exports.DIRECTION.NW:exports.DIRECTION.NONE},exports.getDistance=function(i,t){return Math.sqrt((t.x-i.x)*(t.x-i.x)+(t.y-i.y)*(t.y-i.y))},exports.set=a,exports.sum=u;
//# sourceMappingURL=index.js.map
