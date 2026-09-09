
/* /v67inj:map/ V67 地图单例：REGIONS 全量渲染 + 缩放 + 迷雾 + 城市卡 + 真实旅行 */
(function(){
  try{
    var MAP = {
      ZOOMS: [0.8, 1, 1.3, 1.7, 2.2, 2.8],
      zoomIdx: 1,
      _box: null,
      _sel: null,
      open: function(){
        var box = document.createElement("div");
        box.className = "box";
        box.innerHTML = MAP._render();
        MAP._box = box;
        openModal(box);
      },
      _collect: function(){
        var cities = [], rk, ck, R, C;
        for(rk in REGIONS){ R = REGIONS[rk]; for(ck in R.cities){ C = R.cities[ck];
          cities.push({id:rk+"_"+ck, cn:C.cn, x:(C.x||0), y:-(C.y||0), desc:C.desc||"", region:rk, unlock:!!R.unlock, danger:(R.danger||1)});
        }}
        var minX=1e9,maxX=-1e9,minY=1e9,maxY=-1e9;
        for(var i=0;i<cities.length;i++){ var c=cities[i];
          if(c.x<minX)minX=c.x; if(c.x>maxX)maxX=c.x; if(c.y<minY)minY=c.y; if(c.y>maxY)maxY=c.y;
        }
        if(cities.length===0){ minX=-400; maxX=400; minY=-400; maxY=400; }
        return {cities:cities, minX:minX-80, minY:minY-80, w:(maxX-minX)+160, h:(maxY-minY)+160};
      },
      _render: function(){
        var d = MAP._collect();
        var z = MAP.ZOOMS[MAP.zoomIdx];
        var ww = d.w/z, wh = d.h/z;
        var cx = d.minX + d.w/2, cy = d.minY + d.h/2;
        var vx = cx - ww/2, vy = cy - wh/2;
        var html = "<h2>大陆地图</h2>";
        html += "<div style='display:flex;align-items:center;gap:8px;margin-bottom:8px;color:var(--text-secondary);font-size:13px'>";
        html += "<span>缩放</span><button class='btn' onclick='v67_map.zoom(1)'>＋</button><button class='btn' onclick='v67_map.zoom(-1)'>－</button>";
        html += "<span id='v67-map-zoom-label'>"+Math.round(z*100)+"%</span>";
        html += "<span style='margin-left:auto;color:var(--text-muted)'>金圈 = 你所在</span></div>";
        html += "<div style='position:relative;'>";
        html += "<svg viewBox='"+vx+" "+vy+" "+ww+" "+wh+"' style='width:100%;height:440px;background:linear-gradient(160deg,#efe6cf,#e4d8bc);border:1px solid var(--border);border-radius:10px;' xmlns='http://www.w3.org/2000/svg'>";
        var gi, gx, gy;
        for(gx=d.minX; gx<=d.minX+d.w; gx+=100){ html += "<line x1='"+gx+"' y1='"+d.minY+"' x2='"+gx+"' y2='"+(d.minY+d.h)+"' stroke='rgba(90,70,30,.08)' stroke-width='1'/>"; }
        for(gy=d.minY; gy<=d.minY+d.h; gy+=100){ html += "<line x1='"+d.minX+"' y1='"+gy+"' x2='"+(d.minX+d.w)+"' y2='"+gy+"' stroke='rgba(90,70,30,.08)' stroke-width='1'/>"; }
        var seen = (typeof S!=="undefined" && S && S.visited) ? S.visited : null;
        var wars = null;
        try{ if(typeof S!=="undefined" && S && S.worldState && S.worldState.wars && S.worldState.wars.length) wars = S.worldState.wars; }catch(e){}
        var frontSet = {};
        if(wars){ for(var wi=0; wi<wars.length; wi++){ if(wars[wi].front) frontSet[wars[wi].front]=1; } }
        var here = (typeof S!=="undefined" && S) ? S.loc : "";
        for(var i2=0; i2<d.cities.length; i2++){
          var c2 = d.cities[i2];
          var isHere = (c2.id===here);
          var visited = !!(seen && seen[c2.id]);
          var locked = !c2.unlock;
          var cx2 = c2.x, cy2 = c2.y;
          var r = isHere ? 10 : (visited ? 8 : 6);
          var fill = isHere ? "#d4a017" : (visited ? "#6a5a2a" : "#9a8a5a");
          html += "<g onclick='v67_map.select(\""+c2.id+"\")' style='cursor:pointer'>";
          if(frontSet[c2.id]){ html += "<circle cx='"+cx2+"' cy='"+cy2+"' r='"+(r+6)+"' fill='none' stroke='#b03030' stroke-width='3'/>"; }
          if(isHere){ html += "<circle cx='"+cx2+"' cy='"+cy2+"' r='"+(r+4)+"' fill='none' stroke='#d4a017' stroke-width='2'><animate attributeName='r' values='"+(r+3)+";"+(r+7)+";"+(r+3)+"' dur='2s' repeatCount='indefinite'/></circle>"; }
          html += "<circle cx='"+cx2+"' cy='"+cy2+"' r='"+r+"' fill='"+(locked?"rgba(0,0,0,.35)":fill)+"' stroke='#fff' stroke-width='1.5'/>";
          var label = locked ? "？？？" : c2.cn;
          html += "<text x='"+cx2+"' y='"+(cy2-r-6)+"' font-size='"+(isHere?14:13)+"' fill='"+(locked?"#8a7a5a":"#3a2e10")+"' text-anchor='middle' style='font-family:Georgia,serif'>"+label+"</text>";
          html += "</g>";
        }
        html += "</svg>";
        html += "<div id='v67-map-card' style='position:absolute;left:10px;top:10px;min-width:210px;max-width:300px;background:rgba(24,18,8,.88);color:#e8dcc0;border:1px solid #d4a017;border-radius:8px;padding:10px 12px;font-size:13px;display:none;box-shadow:0 6px 20px rgba(0,0,0,.4)'></div>";
        html += "</div>";
        return html;
      },
      zoom: function(dir){
        MAP.zoomIdx = Math.max(0, Math.min(MAP.ZOOMS.length-1, MAP.zoomIdx + dir));
        if(MAP._box){ MAP._box.innerHTML = MAP._render(); MAP._showCard(MAP._sel); }
      },
      select: function(id){
        MAP._sel = id;
        MAP._showCard(id);
      },
      _showCard: function(id){
        var card = document.getElementById("v67-map-card");
        if(!card) return;
        if(!id){ card.style.display = "none"; return; }
        var c = null;
        for(var rk in REGIONS){ var R=REGIONS[rk]; for(var ck in R.cities){ if((rk+"_"+ck)===id){ c=R.cities[ck]; } } }
        if(!c) return;
        var here = (typeof S!=="undefined" && S) ? S.loc : "";
        var html = "<div style='font-weight:bold;color:#d4a017;margin-bottom:4px'>"+c.cn+"</div>";
        html += "<div style='opacity:.85;margin-bottom:6px'>"+(c.desc||"")+"</div>";
        if(here===id){ html += "<div style='color:#7fbf7f;margin-bottom:6px'>◆ 你正在此地</div>"; }
        html += "<div style='display:flex;gap:6px;flex-wrap:wrap'>";
        html += "<button class='btn' onclick='v67_map.travel(\""+id+"\")'>前往</button>";
        html += "<button class='btn' onclick='v67_map.citySpots(\""+id+"\")'>城中各处</button>";
        html += "<button class='btn' onclick='v67_map.hideCard()'>关闭</button>";
        html += "</div>";
        card.innerHTML = html;
        card.style.display = "block";
      },
      hideCard: function(){ MAP._sel = null; var card = document.getElementById("v67-map-card"); if(card) card.style.display = "none"; },
      travel: function(id){
        try{ if(window.v67_ui) v67_ui.close(); else closeModal(); }catch(e){}
        try{ if(window.travelTo) travelTo(id); }catch(e){}
      },
      citySpots: function(id){
        try{ if(window.openCitySpots) openCitySpots(id); }catch(e){}
      }
    };
    window.v67_map = MAP;
  }catch(e){ try{ console.error("[v67map]", e); }catch(_){} }
})();
