// TFB: every active partner appears once per round, regardless of tier or fee.
// Premium only gets the additional Splash placement. No preferred left slot.
(function(){
 const KEY='tfb_partner_equal_rotation_v1';let state=null,assignments={};
 function shuffled(ids){const rows=ids.slice();for(let i=rows.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[rows[i],rows[j]]=[rows[j],rows[i]];}return rows;}
 function load(rows){
  const ids=rows.map(p=>p.id),signature=ids.slice().sort().join('|');
  if(state?.signature===signature)return;
  let saved;try{saved=JSON.parse(sessionStorage.getItem(KEY)||'null');}catch(_){}
  state=saved?.signature===signature&&Array.isArray(saved.order)&&saved.order.length===ids.length&&new Set(saved.order).size===ids.length&&saved.order.every(id=>ids.includes(id))&&Number.isInteger(saved.cursor)&&saved.cursor>=0&&saved.cursor<=ids.length?saved:{signature,order:shuffled(ids),cursor:0};assignments={};
 }
 TFB.resetPartnerRotation=()=>{state=null;assignments={};};
 TFB.partnerPair=page=>{
  const rows=(TFB.partners||[]).filter(p=>p.logo&&p.active!==false);if(!rows.length)return [];
  load(rows);if(assignments[page])return assignments[page];
  const pair=[];while(pair.length<Math.min(2,rows.length)){
   if(state.cursor>=state.order.length){state.order=shuffled(rows.map(p=>p.id));state.cursor=0;
    if(pair.length&&state.order[0]===pair[0].id)[state.order[0],state.order[1]]=[state.order[1],state.order[0]];
   }
   const id=state.order[state.cursor++],partner=rows.find(p=>p.id===id);if(partner&&!pair.some(p=>p.id===partner.id))pair.push(partner);
  }
  try{sessionStorage.setItem(KEY,JSON.stringify(state));}catch(_){}
  assignments[page]=pair;return pair;
 };
})();
