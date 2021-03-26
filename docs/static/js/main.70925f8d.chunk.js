(this.webpackJsonpwebmap=this.webpackJsonpwebmap||[]).push([[0],{29:function(e,t,r){},47:function(e,t,r){},49:function(e,t,r){},50:function(e,t,r){"use strict";r.r(t);var n=r(11),c=r.n(n),a=r(4),i=r(21),s=r(0),o=r.n(s),l=r(20),u=r(5),d=r(22),j=r(53),f=r(54),m=r(55),h=r(56),b=r(1),p=function(e){return Object(b.jsx)("div",{className:"map-legend",children:Object(b.jsx)("table",{children:Object(b.jsxs)("tbody",{children:[Object(b.jsxs)("tr",{className:null==e.selected?"selected":null,onClick:function(){return e.onSelect()},children:[Object(b.jsx)("td",{children:Object(b.jsx)("span",{className:"dot"})}),Object(b.jsx)("td",{children:Object(b.jsx)("label",{children:"All works"})})]}),e.index.markers.map((function(t){return Object(b.jsxs)("tr",{className:e.selected===t?"selected":null,onClick:function(){return e.onSelect(t)},children:[Object(b.jsx)("td",{children:Object(b.jsx)("span",{className:"dot"})}),Object(b.jsx)("td",{children:Object(b.jsx)("label",{children:t})})]},t)}))]})})})},O=(r(28),r(29),{stroke:!0,color:"#4e4e4e",weight:1.5,opacity:.65,fill:!0,fillColor:"#b7b7b7",fillOpacity:.7}),x=Object(u.a)(Object(u.a)({},O),{},{color:"#bf7814",fillColor:"#ff9a1e",fillOpacity:1}),g=function(e){var t=Object(d.a)(e);return[t.slice(0,2).slice().reverse(),t.slice(2).slice().reverse()]},k=function(e){var t=e.data,r=e.index,n=e.timerange,c=Object(s.useState)(),i=Object(a.a)(c,2),l=i[0],u=i[1],d=null===t||void 0===t?void 0:t.features.filter((function(e){return"Point"===(null===e||void 0===e?void 0:e.geometry.type)})),k=r&&function(e){var t=e.minWorks,r=999/(e.maxWorks-t),n=25-r*t;return function(e){return Math.sqrt(r*e+n)}}(r),v=n?d.filter((function(e){var t=n.min,r=n.max;return e.records.filter((function(e){return e.year>=t&&e.year<=r})).length>0})):d;return Object(b.jsx)(b.Fragment,{children:v&&Object(b.jsxs)(b.Fragment,{children:[Object(b.jsxs)(f.a,{bounds:g(t),preferCanvas:!0,children:[Object(b.jsx)(m.a,{url:"https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"}),v.map((function(e){var t=function(e){var t=n?e.records.filter((function(e){return e.year>=n.min&&e.year<=n.max})):e.records,r=l?t.filter((function(e){return e.markers.includes(l)})):t;return{outerRadius:k(t.length),innerRadius:r.length>0?k(r.length):0,popup:Object(b.jsxs)(j.a,{children:[Object(b.jsx)("h1",{children:Object(b.jsx)("a",{href:e.properties.geonames_uri,children:e.properties.placename})}),l?Object(b.jsxs)(b.Fragment,{children:[Object(b.jsxs)("p",{children:[r.length," works '",l,"'"]}),Object(b.jsxs)("p",{children:[t.length," works total"]})]}):Object(b.jsxs)("p",{children:[t.length," works"]})]})}}(e),r=t.outerRadius,c=t.innerRadius,a=t.popup;return Object(b.jsxs)(o.a.Fragment,{children:[Object(b.jsx)(h.a,{center:e.geometry.coordinates.slice().reverse(),radius:r,pathOptions:O,children:a},"".concat(e.properties.placename,"-outer")),l&&c>0&&Object(b.jsx)(h.a,{center:e.geometry.coordinates.slice().reverse(),radius:c,pathOptions:x,children:a},"".concat(e.properties.placename,"-inner"))]},e.properties.placename)}))]}),Object(b.jsx)(p,{index:r,selected:l,onSelect:function(e){return u(e)}})]})})},v=r(17),y=r.n(v),w=(r(47),r(48),function(e){var t=e.data[0],r=e.data[e.data.length-1],n=Object(s.useState)({min:t,max:r}),c=Object(a.a)(n,2),i=c[0],o=c[1],l=function(e){return(e-t)/(r-t)*100};return Object(b.jsx)("div",{className:"t6e-timeline",children:Object(b.jsxs)("div",{className:"t6e-timeline-inner",children:[Object(b.jsx)("div",{className:"t6e-ticks",children:e.data.map((function(e){return Object(b.jsx)("div",{className:"t6e-tick-wrapper",style:{left:"".concat(l(e),"%")},children:Object(b.jsx)("div",{className:"t6e-tick"})},e)}))}),Object(b.jsx)(y.a,{draggableTrack:!0,minValue:t,maxValue:r,value:i,onChange:function(n){var c={min:Math.max(t,n.min),max:Math.min(r,n.max)};o(c),e.onChange(n)}})]})})}),_=r(18),N=r(19),S=function(){function e(t){var r=this;Object(_.a)(this,e),this.findByMarker=function(e){return r._byMarker[e]};var n=t.features.filter((function(e){return"Point"===(null===e||void 0===e?void 0:e.geometry.type)})),c=0,a=1/0,i={};n.forEach((function(e){var t,r=e.properties.num_works;r>c&&(c=r),r<a&&(a=r),(t=e,Array.from(t.records.reduce((function(e,t){return t.markers.forEach((function(t){return e.add(t)})),e}),new Set))).forEach((function(t){var r=i[t];r?r.push(e):i[t]=[e]}))})),this._features=n,this._maxWorksByPlace=c,this._minWorksByPlace=a,this._byMarker=i}return Object(N.a)(e,[{key:"features",get:function(){return this._features}},{key:"maxWorks",get:function(){return this._maxWorksByPlace}},{key:"minWorks",get:function(){return this._minWorksByPlace}},{key:"markers",get:function(){return Object.keys(this._byMarker).slice().sort()}}]),e}(),W=(r(49),function(e){var t=e.features.reduce((function(e,t){return t.records.forEach((function(t){t.year&&e.add(t.year)})),e}),new Set);return Object(i.a)(Array.from(t).slice().sort())}),C=function(){var e=Object(l.a)("map.json",(function(e){return fetch(e).then((function(e){return e.json()}))})).data,t=Object(s.useState)(),r=Object(a.a)(t,2),n=r[0],c=r[1],i=e?new S(e):null;return Object(b.jsxs)("div",{className:"App",children:[Object(b.jsx)(k,{data:e,index:i,timerange:n}),e&&Object(b.jsx)(w,{data:W(e),onChange:function(e){return c(e)}})]})},M=r(3),B=r.n(M);delete B.a.Icon.Default.prototype._getIconUrl,B.a.Icon.Default.mergeOptions({iconRetinaUrl:"images/leaflet/marker-icon-2x.png",iconUrl:"images/leaflet/marker-icon.png",shadowUrl:"images/leaflet/marker-shadow.png"}),c.a.render(Object(b.jsx)(C,{}),document.getElementById("root"))}},[[50,1,2]]]);
//# sourceMappingURL=main.70925f8d.chunk.js.map