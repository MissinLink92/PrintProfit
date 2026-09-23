(()=>{
'use strict';
if(window.__printProfitModelPreviewInstalled)return;
window.__printProfitModelPreviewInstalled=true;

const $=id=>document.getElementById(id);
const modelExts=new Set(['3mf','stl','obj','amf','ply','step','stp','gcode','gco','nc','ngc','gc','g']);
const gcodeExts=new Set(['gcode','gco','nc','ngc','gc','g']);
let activeToken=0;

function ext(name){
  return (String(name||'').toLowerCase().match(/\.([a-z0-9]+)$/)||[])[1]||'';
}
function escapeHtml(value){
  return String(value??'').replace(/[&<>"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
}

function addStyles(){
  if($('ppModelPreviewStyles'))return;
  const s=document.createElement('style');
  s.id='ppModelPreviewStyles';
  s.textContent=
    '.pp-model-preview-wrap{margin-bottom:9px;border:1px solid #315463;border-radius:12px;background:linear-gradient(145deg,#081923,#0b202b);overflow:hidden;box-shadow:inset 0 1px 0 #ffffff08}'+
    '.pp-model-preview-head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 10px;border-bottom:1px solid #284653;background:#091a24}'+
    '.pp-model-preview-title{font:800 10px/1 Inter,Segoe UI,system-ui,sans-serif;color:#f5f8fb;display:flex;align-items:center;gap:7px}'+
    '.pp-model-preview-title .cube{width:20px;height:20px;border:1px solid #2f6072;border-radius:6px;display:grid;place-items:center;color:#42b8ff;font-size:10px}'+
    '.pp-model-preview-mode{font:700 8px/1 Inter,Segoe UI,system-ui,sans-serif;color:#8fa6b2}'+
    '.pp-model-preview-stage{position:relative;height:240px;min-height:180px;background:radial-gradient(circle at 50% 28%,#0f3341 0,#09212c 34%,#07141d 75%);display:flex;align-items:center;justify-content:center;overflow:hidden}'+
    '.pp-model-preview-stage:before{content:"";position:absolute;inset:0;background-image:linear-gradient(#ffffff08 1px,transparent 1px),linear-gradient(90deg,#ffffff08 1px,transparent 1px);background-size:28px 28px;mask-image:linear-gradient(180deg,transparent,#000 12%,#000 88%,transparent);pointer-events:none}'+
    '.pp-model-preview-stage canvas{position:relative;z-index:1;width:100%;height:100%;display:block;touch-action:none;cursor:grab}'+
    '.pp-model-preview-stage canvas.dragging{cursor:grabbing}'+
    '.pp-model-preview-image{position:relative;z-index:1;max-width:90%;max-height:88%;object-fit:contain;filter:drop-shadow(0 16px 20px #0008)}'+
    '.pp-model-preview-empty{position:relative;z-index:1;text-align:center;color:#819aa7;padding:24px;font:500 10px/1.5 Inter,Segoe UI,system-ui,sans-serif}'+
    '.pp-model-preview-empty strong{display:block;color:#dbe5ea;font-size:12px;margin-bottom:4px}'+
    '.pp-model-preview-help{padding:6px 10px;font:500 8.5px/1.35 Inter,Segoe UI,system-ui,sans-serif;color:#7f97a4;border-top:1px solid #223f4c}'+
    '.pp-model-preview-controls{display:flex;gap:6px;align-items:center}'+
    '.pp-model-preview-reset{border:1px solid #365766;background:#0a1b24;color:#c7d5db;border-radius:6px;padding:4px 7px;font:700 8px/1 Inter,Segoe UI,system-ui,sans-serif;cursor:pointer}'+
    '.pp-model-preview-reset:hover{border-color:#ff7800;color:#fff}'+
    '@media(max-width:650px){.pp-model-preview-stage{height:220px}.pp-model-preview-head{padding:8px}}';
  document.head.appendChild(s);
}

function ensureHost(){
  const first=[...document.querySelectorAll('section.panel')].find(section=>{
    const h=section.querySelector('h2');
    return h&&/^1\.\s*Your Model$/i.test(h.textContent.trim());
  }) || [...document.querySelectorAll('section.panel')].find(section=>{
    const h=section.querySelector('h2');
    return h&&/^1\.\s*/.test(h.textContent.trim());
  });
  if(!first)return null;
  addStyles();
  let host=first.querySelector('#ppModelPreview');
  if(!host){
    host=document.createElement('div');
    host.id='ppModelPreview';
    host.className='pp-model-preview-wrap';
    const header=first.querySelector('.head');
    if(header)header.insertAdjacentElement('afterend',host);
    else first.insertBefore(host,first.firstChild);
  }
  return host;
}

function setMessage(title,text,mode){
  const host=ensureHost();
  if(!host)return;
  host.innerHTML=
    '<div class="pp-model-preview-head">'+
      '<div class="pp-model-preview-title"><span class="cube">◇</span><span>Model Preview</span></div>'+
      '<div class="pp-model-preview-mode">'+escapeHtml(mode||'Waiting')+'</div>'+
    '</div>'+
    '<div class="pp-model-preview-stage">'+
      '<div class="pp-model-preview-empty"><strong>'+escapeHtml(title)+'</strong>'+escapeHtml(text)+'</div>'+
    '</div>';
}

function setImage(blob,mode,label){
  const host=ensureHost();
  if(!host)return;
  const url=URL.createObjectURL(blob);
  host.innerHTML=
    '<div class="pp-model-preview-head">'+
      '<div class="pp-model-preview-title"><span class="cube">▧</span><span>Model Preview</span></div>'+
      '<div class="pp-model-preview-mode">'+escapeHtml(mode)+'</div>'+
    '</div>'+
    '<div class="pp-model-preview-stage"><img class="pp-model-preview-image" alt="'+escapeHtml(label||'3D print preview')+'" src="'+url+'"></div>'+
    '<div class="pp-model-preview-help">Embedded slicer preview extracted from the uploaded file.</div>';
  const img=host.querySelector('img');
  if(img)img.addEventListener('error',()=>{
    URL.revokeObjectURL(url);
    setMessage('Preview image could not be displayed','The file was recognised, but its embedded preview format was not readable in this browser.',mode);
  },{once:true});
}

function setCanvasPreview(type,data,label){
  const host=ensureHost();
  if(!host)return;
  host.innerHTML=
    '<div class="pp-model-preview-head">'+
      '<div class="pp-model-preview-title"><span class="cube">◇</span><span>Model Preview</span></div>'+
      '<div class="pp-model-preview-controls"><span class="pp-model-preview-mode">'+escapeHtml(type)+'</span><button type="button" class="pp-model-preview-reset">Reset View</button></div>'+
    '</div>'+
    '<div class="pp-model-preview-stage"><canvas aria-label="'+escapeHtml(label||'3D model preview')+'"></canvas></div>'+
    '<div class="pp-model-preview-help">'+(type==='G-code'?'Preview generated from toolpaths.':'Drag to rotate the model.')+'</div>';
  const canvas=host.querySelector('canvas');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  if(!ctx)return;
  let yaw=-0.62,pitch=0.58,zoom=1;
  let dragging=false,lastX=0,lastY=0;
  const render=()=>{
    const rect=canvas.getBoundingClientRect();
    const dpr=Math.min(window.devicePixelRatio||1,2);
    const w=Math.max(280,Math.round(rect.width*dpr));
    const h=Math.max(180,Math.round(rect.height*dpr));
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
    ctx.clearRect(0,0,w,h);
    if(type==='G-code'){renderGcode(ctx,w,h,data);return;}
    renderMesh(ctx,w,h,data,yaw,pitch,zoom);
  };
  const resize=()=>requestAnimationFrame(render);
  canvas.addEventListener('pointerdown',e=>{
    dragging=true;lastX=e.clientX;lastY=e.clientY;canvas.classList.add('dragging');canvas.setPointerCapture?.(e.pointerId);
  });
  canvas.addEventListener('pointermove',e=>{
    if(!dragging)return;
    yaw+=(e.clientX-lastX)*0.012;
    pitch+=(e.clientY-lastY)*0.009;
    pitch=Math.max(-1.25,Math.min(1.25,pitch));
    lastX=e.clientX;lastY=e.clientY;render();
  });
  canvas.addEventListener('pointerup',e=>{dragging=false;canvas.classList.remove('dragging');canvas.releasePointerCapture?.(e.pointerId);});
  canvas.addEventListener('pointercancel',()=>{dragging=false;canvas.classList.remove('dragging');});
  canvas.addEventListener('wheel',e=>{e.preventDefault();zoom*=e.deltaY<0?1.08:.92;zoom=Math.max(.55,Math.min(2.5,zoom));render();},{passive:false});
  host.querySelector('.pp-model-preview-reset')?.addEventListener('click',()=>{yaw=-0.62;pitch=0.58;zoom=1;render();});
  window.addEventListener('resize',resize,{passive:true});
  render();
}

function renderMesh(ctx,w,h,mesh,yaw,pitch,zoom){
  const pts=mesh.vertices;
  if(!pts?.length||!mesh.triangles?.length)return;
  const cy=Math.cos(yaw),sy=Math.sin(yaw),cx=Math.cos(pitch),sx=Math.sin(pitch);
  const transformed=new Array(pts.length);
  let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity,minZ=Infinity,maxZ=-Infinity;
  for(let i=0;i<pts.length;i++){
    const p=pts[i];
    const y1=p.y*cx-p.z*sx,z1=p.y*sx+p.z*cx;
    const x2=p.x*cy-z1*sy,z2=p.x*sy+z1*cy;
    transformed[i]={x:x2,y:y1,z:z2};
    minX=Math.min(minX,x2);maxX=Math.max(maxX,x2);minY=Math.min(minY,y1);maxY=Math.max(maxY,y1);minZ=Math.min(minZ,z2);maxZ=Math.max(maxZ,z2);
  }
  const span=Math.max(maxX-minX,maxY-minY,maxZ-minZ,1e-6);
  const scale=Math.min(w,h)*0.72/span*zoom;
  const ox=w/2,oy=h/2+(maxY+minY)*-0.06*scale;
  const triangles=[];
  for(const t of mesh.triangles){
    const a=transformed[t[0]],b=transformed[t[1]],c=transformed[t[2]];
    if(!a||!b||!c)continue;
    const abx=b.x-a.x,aby=b.y-a.y,abz=b.z-a.z,acx=c.x-a.x,acy=c.y-a.y,acz=c.z-a.z;
    const nx=aby*acz-abz*acy,ny=abz*acx-abx*acz,nz=abx*acy-aby*acx,len=Math.hypot(nx,ny,nz)||1;
    triangles.push({pts:[{x:ox+a.x*scale,y:oy-a.y*scale},{x:ox+b.x*scale,y:oy-b.y*scale},{x:ox+c.x*scale,y:oy-c.y*scale}],z:(a.z+b.z+c.z)/3,light:(ny/len*.35+nz/len*.8+.35)});
  }
  triangles.sort((a,b)=>a.z-b.z);
  const maxTriangles=90000,step=Math.max(1,Math.ceil(triangles.length/maxTriangles));
  for(let i=0;i<triangles.length;i+=step){
    const t=triangles[i],shade=Math.max(.12,Math.min(1,t.light));
    ctx.beginPath();ctx.moveTo(t.pts[0].x,t.pts[0].y);ctx.lineTo(t.pts[1].x,t.pts[1].y);ctx.lineTo(t.pts[2].x,t.pts[2].y);ctx.closePath();
    ctx.fillStyle='rgb('+Math.round(38+46*shade)+','+Math.round(128+84*shade)+','+Math.round(171+70*shade)+')';ctx.fill();
  }
  const baseY=oy+(maxY-minY)*scale*.42;
  ctx.beginPath();ctx.ellipse(ox,baseY,span*scale*.27,span*scale*.08,0,0,Math.PI*2);ctx.fillStyle='rgba(0,0,0,.25)';ctx.fill();
}

function renderGcode(ctx,w,h,paths){
  if(!paths?.length)return;
  let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
  for(const p of paths){minX=Math.min(minX,p.x1,p.x2);maxX=Math.max(maxX,p.x1,p.x2);minY=Math.min(minY,p.y1,p.y2);maxY=Math.max(maxY,p.y1,p.y2);}
  const span=Math.max(maxX-minX,maxY-minY,1e-6),scale=Math.min(w,h)*0.70/span,ox=w/2-(minX+maxX)/2*scale,oy=h/2+(minY+maxY)/2*scale;
  ctx.lineCap='round';
  const maxPaths=70000,step=Math.max(1,Math.ceil(paths.length/maxPaths));
  for(let i=0;i<paths.length;i+=step){
    const p=paths[i];
    ctx.beginPath();ctx.moveTo(ox+p.x1*scale,oy-p.y1*scale);ctx.lineTo(ox+p.x2*scale,oy-p.y2*scale);
    ctx.strokeStyle=p.extruding?'rgba(72,191,239,.72)':'rgba(125,151,162,.10)';
    ctx.lineWidth=p.extruding?Math.max(1,scale*.9):1;ctx.stroke();
  }
  const baseY=oy+(maxY-minY)*scale*.42;ctx.beginPath();ctx.ellipse(w/2,baseY,span*scale*.27,span*scale*.08,0,0,Math.PI*2);ctx.fillStyle='rgba(0,0,0,.24)';ctx.fill();
}

function parseObj(text){
  const vertices=[],triangles=[];
  for(const line of String(text||'').split(/\r?\n/)){
    const s=line.trim();if(!s||s[0]==='#')continue;
    const parts=s.split(/\s+/);
    if(parts[0]==='v'&&parts.length>=4){
      const x=Number(parts[1]),y=Number(parts[2]),z=Number(parts[3]);if([x,y,z].every(Number.isFinite))vertices.push({x,y,z});
    }else if(parts[0]==='f'&&parts.length>=4){
      const face=parts.slice(1).map(v=>parseInt(v.split('/')[0],10)).filter(Number.isFinite).map(v=>v<0?vertices.length+v:v-1);
      for(let i=1;i<face.length-1;i++)triangles.push([face[0],face[i],face[i+1]]);
    }
  }
  return {vertices,triangles};
}

function parseStl(buffer){
  const bytes=new Uint8Array(buffer),dv=new DataView(buffer);
  const binary=bytes.length>=84 && 84+dv.getUint32(80,true)*50===bytes.length;
  if(binary){
    const count=dv.getUint32(80,true),vertices=[],triangles=[],map=new Map(),key=(x,y,z)=>x.toFixed(5)+','+y.toFixed(5)+','+z.toFixed(5);
    const add=(x,y,z)=>{const k=key(x,y,z);if(map.has(k))return map.get(k);const i=vertices.length;vertices.push({x,y,z});map.set(k,i);return i;};
    let p=84;
    for(let i=0;i<count;i++){
      p+=12;const ids=[];
      for(let j=0;j<3;j++){const x=dv.getFloat32(p,true),y=dv.getFloat32(p+4,true),z=dv.getFloat32(p+8,true);ids.push(add(x,y,z));p+=12;}
      triangles.push(ids);p+=2;
    }
    return {vertices,triangles};
  }
  const vertices=[],triangles=[],current=[];
  for(const m of new TextDecoder().decode(bytes).matchAll(/\bvertex\s+([\-0-9.eE+]+)\s+([\-0-9.eE+]+)\s+([\-0-9.eE+]+)/g)){
    current.push({x:Number(m[1]),y:Number(m[2]),z:Number(m[3])});
    if(current.length===3){const base=vertices.length;vertices.push(...current);triangles.push([base,base+1,base+2]);current.length=0;}
  }
  return {vertices,triangles};
}

function parse3mfModel(xml){
  const doc=new DOMParser().parseFromString(xml,'application/xml');
  if(doc.querySelector('parsererror'))return null;
  const vertices=[],triangles=[];
  const objects=[...doc.getElementsByTagNameNS('*','object')];
  for(const object of objects){
    const mesh=[...object.getElementsByTagNameNS('*','mesh')][0];if(!mesh)continue;
    const vs=[...mesh.getElementsByTagNameNS('*','vertex')],ts=[...mesh.getElementsByTagNameNS('*','triangle')],base=vertices.length;
    vs.forEach(v=>{const x=Number(v.getAttribute('x')),y=Number(v.getAttribute('y')),z=Number(v.getAttribute('z'));if([x,y,z].every(Number.isFinite))vertices.push({x,y,z});});
    ts.forEach(t=>{const v1=Number(t.getAttribute('v1')),v2=Number(t.getAttribute('v2')),v3=Number(t.getAttribute('v3'));if([v1,v2,v3].every(Number.isFinite))triangles.push([base+v1,base+v2,base+v3]);});
  }
  return vertices.length&&triangles.length?{vertices,triangles}:null;
}

function parseGcodePaths(text){
  const paths=[];let x=0,y=0,z=0,absoluteXY=true,absoluteE=true,e=0,lastE=0;
  for(const raw of String(text||'').split(/\r?\n/)){
    if(paths.length>=120000)break;
    const line=raw.split(';')[0].trim();if(!line)continue;
    const cmd=(line.match(/^([GMT]\d+)/i)||[])[1]?.toUpperCase();
    if(cmd==='G90'){absoluteXY=true;continue}
    if(cmd==='G91'){absoluteXY=false;continue}
    if(cmd==='M82'){absoluteE=true;continue}
    if(cmd==='M83'){absoluteE=false;continue}
    if(cmd==='G92'){
      const mx=line.match(/X\s*([\-0-9.eE+]+)/i),my=line.match(/Y\s*([\-0-9.eE+]+)/i),mz=line.match(/Z\s*([\-0-9.eE+]+)/i),me=line.match(/E\s*([\-0-9.eE+]+)/i);
      if(mx)x=Number(mx[1]);if(my)y=Number(my[1]);if(mz)z=Number(mz[1]);if(me)e=Number(me[1]);continue;
    }
    if(!/^G0?1$/i.test(cmd||''))continue;
    const mx=line.match(/X\s*([\-0-9.eE+]+)/i),my=line.match(/Y\s*([\-0-9.eE+]+)/i),mz=line.match(/Z\s*([\-0-9.eE+]+)/i),me=line.match(/E\s*([\-0-9.eE+]+)/i);
    const nx=mx?(absoluteXY?Number(mx[1]):x+Number(mx[1])):x,ny=my?(absoluteXY?Number(my[1]):y+Number(my[1])):y,nz=mz?(absoluteXY?Number(mz[1]):z+Number(mz[1])):z;
    if(me){lastE=e;e=absoluteE?Number(me[1]):e+Number(me[1]);}
    const moved=Math.abs(nx-x)>1e-5||Math.abs(ny-y)>1e-5,extruding=me?(absoluteE?e>lastE+1e-6:e-lastE>1e-6):moved;
    if(moved)paths.push({x1:x,y1:y,x2:nx,y2:ny,z:nz,extruding});
    x=nx;y=ny;z=nz;
  }
  return paths;
}

async function readZip(file){
  const b=new Uint8Array(await file.arrayBuffer()),v=new DataView(b.buffer,b.byteOffset,b.byteLength),u16=p=>v.getUint16(p,true),u32=p=>v.getUint32(p,true);
  let eocd=-1;for(let p=b.length-22;p>=Math.max(0,b.length-65557);p--){if(u32(p)===0x06054b50){eocd=p;break;}}
  if(eocd<0)throw Error('Not a ZIP package');
  const count=u16(eocd+10),cdOff=u32(eocd+16),out=new Map();let p=cdOff;
  for(let i=0;i<count;i++){
    if(u32(p)!==0x02014b50)break;
    const method=u16(p+10),cs=u32(p+20),nl=u16(p+28),xl=u16(p+30),cl=u16(p+32),off=u32(p+42),name=new TextDecoder().decode(b.slice(p+46,p+46+nl));
    p+=46+nl+xl+cl;
    const lv=new DataView(b.buffer,b.byteOffset+off),lnl=lv.getUint16(26,true),lxl=lv.getUint16(28,true),start=off+30+lnl+lxl,raw=b.slice(start,start+cs);
    if(method===0)out.set(name,raw);
    else if(method===8&&typeof DecompressionStream==='function'){
      const ds=new DecompressionStream('deflate-raw'),ab=await new Response(new Blob([raw]).stream().pipeThrough(ds)).arrayBuffer();out.set(name,new Uint8Array(ab));
    }
  }
  return out;
}

function zipText(map,name){const b=map.get(name);return b?new TextDecoder().decode(b):'';}

function getThumbnailFromGcode(text){
  const source=String(text||'');
  const block=/^[\s;]*thumbnail(?:_[A-Za-z0-9-]+)?\s+begin[^\r\n]*\r?\n([\s\S]*?)^[\s;]*thumbnail(?:_[A-Za-z0-9-]+)?\s+end\b/im.exec(source);
  if(!block)return null;
  const lines=block[1].split(/\r?\n/).map(line=>line.replace(/^\s*;\s?/,'').trim()).filter(Boolean),b64=lines.join('').replace(/\s+/g,'');
  if(b64.length<40||!/^[A-Za-z0-9+/=]+$/.test(b64))return null;
  let mime='image/png';const head=block[0].slice(0,120).toLowerCase();
  if(head.includes('jpg')||head.includes('jpeg'))mime='image/jpeg';else if(head.includes('webp'))mime='image/webp';
  try{const bin=atob(b64),bytes=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);return new Blob([bytes],{type:mime});}catch{return null;}
}

function findZipThumbnail(map){
  const preferred=[...map.keys()].filter(k=>/thumbnail|preview/i.test(k)&&/\.(png|jpe?g|webp)$/i.test(k));
  preferred.sort((a,b)=>(/plate_?1/i.test(a)?-2:0)-(/plate_?1/i.test(b)?-2:0)||a.length-b.length);
  for(const name of preferred){
    const blob=new Blob([map.get(name)],{type:/\.jpe?g$/i.test(name)?'image/jpeg':/\.webp$/i.test(name)?'image/webp':'image/png'});
    if(blob.size>0)return blob;
  }
  return null;
}

async function processFile(file){
  const token=++activeToken,e=ext(file?.name);
  if(!file||!modelExts.has(e))return;
  setMessage('Preparing preview',file.name,'Loading');
  try{
    if(gcodeExts.has(e)){
      const text=await file.text();if(token!==activeToken)return;
      const thumb=getThumbnailFromGcode(text);
      if(thumb){setImage(thumb,'Slicer thumbnail',file.name);return;}
      const paths=parseGcodePaths(text);
      if(paths.length>10){setCanvasPreview('G-code',paths,file.name);return;}
      setMessage('No visual preview found','This G-code file does not contain an embedded thumbnail or enough toolpath data to render one.','G-code');
      return;
    }
    if(e==='3mf'){
      const map=await readZip(file);if(token!==activeToken)return;
      const thumb=findZipThumbnail(map);
      if(thumb){setImage(thumb,'Embedded 3MF preview',file.name);return;}
      const modelName=[...map.keys()].find(k=>/^(3dmodel\/)?[^/]+\.model$/i.test(k))||[...map.keys()].find(k=>/\.model$/i.test(k));
      const mesh=modelName?parse3mfModel(zipText(map,modelName)):null;
      if(mesh){setCanvasPreview('3MF mesh',mesh,file.name);return;}
      setMessage('3MF recognised','No embedded preview or renderable mesh was found in this project.','3MF');
      return;
    }
    if(e==='obj'){
      const mesh=parseObj(await file.text());if(token!==activeToken)return;
      if(mesh.vertices.length&&mesh.triangles.length){setCanvasPreview('OBJ mesh',mesh,file.name);return;}
    }else if(e==='stl'){
      const mesh=parseStl(await file.arrayBuffer());if(token!==activeToken)return;
      if(mesh.vertices.length&&mesh.triangles.length){setCanvasPreview('STL mesh',mesh,file.name);return;}
    }else{
      setMessage('Model file detected','A visual preview is not yet available for this model format. The calculator can still use the file for supported metadata workflows.',e.toUpperCase());
      return;
    }
    setMessage('Model file detected','The file was recognised, but its geometry could not be rendered in this browser.',e.toUpperCase());
  }catch(error){
    console.warn('PrintProfit model preview failed:',error);
    if(token===activeToken)setMessage('Preview unavailable','The file is still available to the calculator, but its visual preview could not be generated.','Fallback');
  }
}

function install(){
  const input=$('file');if(!input)return false;
  if(input.dataset.ppModelPreviewBound)return true;
  input.dataset.ppModelPreviewBound='1';
  ensureHost();
  input.addEventListener('change',()=>{
    const file=input.files?.[0];
    if(file)processFile(file);else setMessage('No model loaded','Upload a supported print file to preview it.','Waiting');
  },true);
  return true;
}

function boot(){
  addStyles();
  const start=Date.now(),timer=setInterval(()=>{if(install()||Date.now()-start>15000)clearInterval(timer);},50);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();