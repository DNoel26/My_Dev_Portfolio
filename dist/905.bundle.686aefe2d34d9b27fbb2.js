(self.webpackChunkMy_Dev_Portfolio=self.webpackChunkMy_Dev_Portfolio||[]).push([[905],{5905:(t,e,o)=>{"use strict";o.r(e),o.d(e,{default:()=>h});var n=o(6610),i=o(5991),s=o(6156);o(8674),o(1539);const h=function(){function t(e,o,i,h){(0,n.Z)(this,t),(0,s.Z)(this,"endpoint",void 0),(0,s.Z)(this,"method",void 0),(0,s.Z)(this,"headers",{}),(0,s.Z)(this,"body",{}),(0,s.Z)(this,"response",void 0),(0,s.Z)(this,"response_data",void 0),this.endpoint=e,this.method=o,this.headers=i,this.body=h}return(0,i.Z)(t,[{key:"fetch_api",value:function(){var t=this;return new Promise((function(e,o){fetch(t.endpoint,{method:t.method,headers:t.head,body:t.body}).then((function(e){return t.response=e,e.json()})).then((function(o){t.response_data=o,e(o)})).catch((function(){return console.log("Failed to fetch API @ ".concat(t.endpoint),o())}))}))}}]),t}()}}]);