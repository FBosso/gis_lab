(window.webpackJsonp=window.webpackJsonp||[]).push([[100],{330:function(e,t,n){"use strict";n.r(t);var o=n(3),c=n(9),a=n(5),w=n(2),i=n(1),r=n(4);function u(e,t){document.getElementById(e).value=t.toFixed(2)}function p(e){return e-360*Math.floor((e+180)/360)}new o.a({layers:[new a.a({source:new c.b})],target:"map",view:new w.a({center:[0,0],zoom:2})}).on("moveend",(function(e){var t=e.map,n=t.getView().calculateExtent(t.getSize()),o=Object(r.p)(Object(i.w)(n)),c=Object(r.p)(Object(i.E)(n));u("left",p(o[0])),u("bottom",o[1]),u("right",p(c[0])),u("top",c[1])}))}},[[330,0]]]);
//# sourceMappingURL=moveend.js.map