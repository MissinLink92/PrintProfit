/* PrintProfit: local slicer metadata and embedded previews. No uploaded bytes leave the browser.
 * Format references: Prusa libbgcode/doc/specifications.md, BambuStudio bbs_3mf.cpp,
 * 3MF Core Specification, and the QOI specification (phoboslab/qoi).
 */
(() => {
  'use strict';
  if (window.PrintProfitSlicerFile) return;
  const MiB = 1024 * 1024;
  const TEXT_LIMIT = 120 * MiB, META_LIMIT = 16 * MiB, IMAGE_LIMIT = 4 * MiB;
  const decoder = new TextDecoder();
  const crcTable=Uint32Array.from({length:256},(_,n)=>{for(let i=0;i<8;i++) n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
  function crc32(bytes){let n=0xffffffff;for(const b of bytes) n=crcTable[(n^b)&255]^(n>>>8);return (n^0xffffffff)>>>0;}
  const clean = v => String(v ?? '').trim();
  const present = v => v !== null && v !== undefined && clean(v) !== '';
  const numeric = v => {
    if (!present(v)) return null;
    const m = clean(v).match(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/);
    return m && Number.isFinite(Number(m[0])) ? Number(m[0]) : null;
  };
  const values = v => Array.isArray(v) ? v : clean(v).split(/[;,]/).map(clean);
  const numbers = v => values(v).map(numeric);
  const sum = v => {
    const ns = numbers(v);
    return ns.length && ns.every(n => n !== null && n >= 0) ? ns.reduce((a,b) => a+b,0) : null;
  };
  const key = v => clean(v).toLowerCase().replace(/^.*:/, '').replace(/\s+/g, '_');
  function duration(value) {
    const s = clean(value).toLowerCase();
    if (/^\d+(?:\.\d+)?$/.test(s)) return Number(s);
    if (/^\d+:\d{1,2}(?::\d{1,2}(?:\.\d+)?)?$/.test(s)) {
      const a = s.split(':').map(Number);
      return a.length === 3 ? a[0]*3600+a[1]*60+a[2] : a[0]*60+a[1];
    }
    let n=0, found=false;
    for (const [pattern,mult] of [[/(\d+(?:\.\d+)?)\s*(?:days?|d)\b/g,86400], [/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|h)\b/g,3600], [/(\d+(?:\.\d+)?)\s*(?:minutes?|mins?|m)\b/g,60], [/(\d+(?:\.\d+)?)\s*(?:seconds?|secs?|s)\b/g,1]]) {
      for (const m of s.matchAll(pattern)) { n += Number(m[1])*mult; found=true; }
    }
    return found ? n : null;
  }
  function ini(text, commentsOnly=false) {
    const out=Object.create(null);
    for (const line of text.split(/\r?\n/)) {
      if (commentsOnly && !/^\s*;/.test(line)) continue;
      const m=line.match(/^\s*;?\s*([^=:\r\n]{1,160})\s*[:=]\s*(.*?)\s*$/);
      if (m && Object.keys(out).length < 2500 && m[2].length <= 12000) out[key(m[1])]=m[2];
    }
    return out;
  }
  function flatten(obj,out=Object.create(null),prefix='',depth=0) {
    if (!obj || typeof obj !== 'object' || depth>5) return out;
    for (const [k,v] of Object.entries(obj)) {
      if (Object.keys(out).length>=2500) break;
      if (v && typeof v==='object' && !Array.isArray(v)) flatten(v,out,prefix+k+'.',depth+1);
      else if (!Array.isArray(v) || v.every(x=>typeof x!=='object')) {
        if (clean(v).length>12000) continue;
        out[key(prefix+k)]=v;
        // Direct names take precedence over nested aliases.
        if (!(key(k) in out)) out[key(k)]=v;
      }
    }
    return out;
  }
  const get = (cfg,...keys) => {
    for (const k of keys) if (present(cfg[key(k)])) return cfg[key(k)];
    return null;
  };
  const display = v => Array.isArray(v) ? v.filter(present).join(' / ') : clean(v);
  const units = (v,u) => present(v) ? values(v).map(x=>{
    const s=clean(x);if(s.includes(u)||s.includes('%')) return s;
    return (/^[+-]?[\d.]+$/.test(s)?String(Number(Number(s).toFixed(4))):s)+' '+u;
  }).join(' / ') : null;
  function bool(v) {
    if (!present(v)) return null;
    const s=clean(v).toLowerCase();
    return ['1','true','yes','enabled'].includes(s) ? 'Enabled' : ['0','false','no','disabled'].includes(s) ? 'Disabled' : display(v);
  }
  const definitions = [
    ['printer','Printer',['printer_model','printer_model_id','printer_settings_id','machine_name'],'Printer & profile'],
    ['technology','Print technology',['printer_technology','technology'],'Printer & profile'],
    ['title','Project title',['title'],'Project'],
    ['designer','Designer',['designer','author'],'Project'],
    ['description','Description',['description'],'Project'],
    ['license','Licence',['license','licence','copyright'],'Project'],
    ['profile','Print profile',['print_settings_id','process_settings_id','default_print_profile'],'Printer & profile'],
    ['filamentProfile','Material profile',['filament_settings_id','filament_preset_id'],'Material'],
    ['filament','Material type',['filament_type','material_type','resin_type'],'Material'],
    ['vendor','Material brand',['filament_vendor','material_vendor'],'Material'],
    ['colour','Material colour',['filament_colour','filament_color','material_colour','material_color'],'Material'],
    ['diameter','Filament diameter',['filament_diameter'],'Material','mm'],
    ['density','Material density',['filament_density','material_density'],'Material','g/cm³'],
    ['nozzle','Nozzle diameter',['nozzle_diameter','nozzle_diameters'],'Printer & profile','mm'],
    ['bed','Bed type',['curr_bed_type','bed_type'],'Printer & profile'],
    ['gcode','G-code flavour',['gcode_flavor','gcode_flavour'],'Printer & profile'],
    ['layer','Layer height',['layer_height'],'Layers & structure','mm'],
    ['firstLayer','First layer height',['initial_layer_print_height','first_layer_height'],'Layers & structure','mm'],
    ['layerCount','Layer count',['layer_count','total_layer_number','total_layers','layer_num'],'Layers & structure'],
    ['infill','Infill',['sparse_infill_density','fill_density','infill_density'],'Layers & structure','%'],
    ['infillPattern','Infill pattern',['sparse_infill_pattern','fill_pattern'],'Layers & structure'],
    ['walls','Wall loops',['wall_loops','perimeters','wall_line_count'],'Layers & structure'],
    ['topLayers','Top solid layers',['top_shell_layers','top_solid_layers','top_layers'],'Layers & structure'],
    ['bottomLayers','Bottom solid layers',['bottom_shell_layers','bottom_solid_layers','bottom_layers'],'Layers & structure'],
    ['supports','Supports',['enable_support','support_material','support_used'],'Supports & adhesion','bool'],
    ['supportType','Support type',['support_type','support_material_style'],'Supports & adhesion'],
    ['supportPattern','Support pattern',['support_base_pattern','support_material_pattern'],'Supports & adhesion'],
    ['supportThreshold','Support threshold',['support_threshold_angle','support_material_threshold'],'Supports & adhesion','°'],
    ['brim','Brim width',['brim_width'],'Supports & adhesion','mm'],
    ['brimType','Brim type',['brim_type'],'Supports & adhesion'],
    ['raft','Raft layers',['raft_layers'],'Supports & adhesion'],
    ['skirt','Skirt loops',['skirt_loops','skirts'],'Supports & adhesion'],
    ['nozzleTemperature','Nozzle temperature',['nozzle_temperature','temperature','material_print_temperature'],'Temperatures & cooling','°C'],
    ['firstNozzleTemperature','First layer nozzle',['nozzle_temperature_initial_layer','first_layer_temperature','material_print_temperature_layer_0'],'Temperatures & cooling','°C'],
    ['bedTemperature','Bed temperature',['bed_temperature'],'Temperatures & cooling','°C'],
    ['firstBedTemperature','First layer bed',['bed_temperature_initial_layer','first_layer_bed_temperature'],'Temperatures & cooling','°C'],
    ['chamberTemperature','Chamber temperature',['chamber_temperature'],'Temperatures & cooling','°C'],
    ['fanMin','Minimum fan',['fan_min_speed','min_fan_speed'],'Temperatures & cooling','%'],
    ['fanMax','Maximum fan',['fan_max_speed','max_fan_speed'],'Temperatures & cooling','%'],
    ['outerSpeed','Outer wall speed',['outer_wall_speed','external_perimeter_speed'],'Speeds & motion','mm/s'],
    ['innerSpeed','Inner wall speed',['inner_wall_speed','perimeter_speed'],'Speeds & motion','mm/s'],
    ['infillSpeed','Infill speed',['sparse_infill_speed','infill_speed'],'Speeds & motion','mm/s'],
    ['travelSpeed','Travel speed',['travel_speed'],'Speeds & motion','mm/s'],
    ['firstLayerSpeed','First layer speed',['initial_layer_speed','first_layer_speed'],'Speeds & motion','mm/s'],
    ['acceleration','Print acceleration',['default_acceleration','print_acceleration'],'Speeds & motion','mm/s²'],
    ['retraction','Retraction length',['retraction_length','retract_length'],'Speeds & motion','mm'],
    ['retractionSpeed','Retraction speed',['retraction_speed','retract_speed'],'Speeds & motion','mm/s'],
    ['zHop','Z hop',['z_hop','retract_lift'],'Speeds & motion','mm'],
    ['seam','Seam position',['seam_position'],'Layers & structure'],
    ['vase','Vase mode',['spiral_mode','spiral_vase'],'Layers & structure','bool'],
    ['filamentChanges','Filament changes',['total_filament_change','filament_changes'],'Material'],
    ['purgeVolume','Recorded purge volume',['total_flush_volume','flush_volume'],'Material','mm³'],
    ['pauseCount','Scheduled pauses',['pause_count'],'Printer & profile'],
    ['exposure','Resin exposure',['exposure_time','exposure_time_s'],'Resin','s'],
    ['bottomExposure','Bottom exposure',['bottom_exposure_time'],'Resin','s'],
    ['liftHeight','Lift height',['lift_height'],'Resin','mm']
  ];
  function fields(cfg) {
    const data={details:[],settings:[]};
    for (const [id,label,keys,group,unit] of definitions) {
      const raw=get(cfg,...keys); if (!present(raw)) continue;
      const v=unit==='bool'?bool(raw):unit?units(raw,unit):display(raw);
      data[id]=v; data.details.push({id,label,value:v,group});
    }
    for (const [k,v] of Object.entries(cfg)) {
      if (!present(v) || /(?:password|token|api_key|thumbnail|^time_elapsed$)/i.test(k)) continue;
      data.settings.push({key:k,value:display(v)});
    }
    return data;
  }
  function detectSlicer(text,cfg) {
    const m=text.match(/(?:generated\s+(?:by|with)|sliced\s+by)\s+([^\r\n;]+)/i);
    if(m) return clean(m[1]).slice(0,180);
    const cura=text.match(/;\s*GENERATOR\.NAME\s*[:=]\s*([^\r\n]+)/i);
    if(cura) return clean(cura[1])+(get(cfg,'generator.version')?' '+get(cfg,'generator.version'):'');
    return display(get(cfg,'slicer','slicer_version','producer','application')) || null;
  }
  function parseText(text,baseCfg={},physical={}) {
    const cfg={...baseCfg,...ini(text,true)},data=fields(cfg);
    data.slicer=detectSlicer(text,cfg);
    const times=[get(cfg,'estimated_printing_time_(normal_mode)','estimated_printing_time','total_estimated_printing_time','total_estimated_time_(s)','print_time','printing_time','time','print_time_seconds','estimated_print_time','printtimeseconds','printtime')];
    const tm=text.match(/(?:total\s+)?estimated\s+(?:printing\s+)?time(?:\s*\([^)]*\))?\s*[:=]\s*([^;\r\n]+)/i);
    if(tm) times.push(tm[1]);
    data.seconds=times.map(duration).find(n=>n!==null&&n>0) ?? null;
    const silent=get(cfg,'estimated_printing_time_(silent_mode)');
    if(present(silent)) data.details.push({id:'silentTime',label:'Silent mode time',value:display(silent),group:'Print estimates'});
    let gramsValue=get(cfg,'total_filament_used_[g]','total_filament_weight_[g]','filament_used_[g]','filament_used_g','filament_used_grams','filament_weight_g','filament_weight','filamentUsedG','total_weight_g','total_filament_used_g','used_filament_g');
    if(gramsValue===null) { const m=text.match(/filament\s+(?:weight|used)\s*[:=]\s*([\d.,; ]+)\s*g\b/i); if(m) gramsValue=m[1]; }
    const masses=gramsValue===null?[]:numbers(gramsValue);
    data.grams=gramsValue===null?null:sum(gramsValue);
    data.massSource=data.grams===null?null:'Recorded by slicer';
    let mmValue=get(cfg,'total_filament_length_[mm]','filament_used_[mm]','filament_used_mm','filament_length');
    const cm3Value=get(cfg,'total_filament_volume_[cm^3]','total_filament_volume_[cm3]','filament_used_[cm3]','filament_used_[cm³]','filament_used_cm3');
    if(mmValue===null) {
      const v=get(cfg,'filament_used_[m]','filament_used_m');
      if(present(v)) mmValue=numbers(v).every(n=>n!==null)?numbers(v).map(n=>n*1000):null;
      else { const m=text.match(/filament\s+used\s*[:=]\s*([\d.,; ]+)\s*m\b/i); if(m) mmValue=numbers(m[1]).map(n=>n===null?null:n*1000); }
    }
    data.filamentLength=mmValue===null?null:sum(mmValue);
    data.filamentVolume=cm3Value===null?null:sum(cm3Value);
    const densities=numbers(get(cfg,'filament_density','material_density'));
    const diameters=numbers(get(cfg,'filament_diameter'));
    const rawUsage=cm3Value??mmValue,usage=rawUsage===null?[]:numbers(rawUsage);
    if(data.grams===null && usage.length && usage.every(n=>n!==null&&n>=0)) {
      let assumptions=false;
      const converted=usage.map((n,i)=>{
        const candidateRho=densities[i]??(densities.length===1?densities[0]:null)??numeric(physical.density),candidateD=diameters[i]??(diameters.length===1?diameters[0]:null)??numeric(physical.diameter);
        const rho=candidateRho>0?candidateRho:1.24,d=candidateD>0?candidateD:1.75;
        if(!(densities[i]||(densities.length===1&&densities[0])) || (cm3Value===null&&!(diameters[i]||(diameters.length===1&&diameters[0])))) assumptions=true;
        return cm3Value!==null?n*rho:n*Math.PI*(d/2)**2*rho/1000;
      });
      data.grams=converted.reduce((a,b)=>a+b,0);
      data.massSource='Estimated from '+(cm3Value!==null?'volume and density':'length, diameter and density')+(assumptions?' (uses selected or default material values)':'');
      masses.push(...converted);
    }
    const types=values(get(cfg,'filament_type','material_type')),vendors=values(get(cfg,'filament_vendor')),colours=values(get(cfg,'filament_colour','filament_color'));
    const materialCount=Math.max(types.filter(present).length,colours.filter(present).length,masses.length,usage.length);
    data.materials=Array.from({length:materialCount},(_,i)=>({label:'Material '+(i+1),type:types[i]||null,vendor:vendors[i]||null,colour:colours[i]||null,grams:masses[i]??null,lengthMm:mmValue===null?null:numbers(mmValue)[i]??null}));
    // Cura and Simplify3D expose some data in comments with different names.
    if(!data.layerCount) { const m=text.match(/;\s*(?:LAYER_COUNT\s*[:=]|total layer number\s*[:=])\s*(\d+)/i); if(m) data.layerCount=m[1]; }
    if(!data.layerCount) {
      const changes=[...text.matchAll(/^;\s*LAYER_CHANGE\s*$/gm)];
      if(changes.length) {data.layerCount=String(changes.length);data.details.push({id:'layerCountMarkers',label:'Layers (from saved markers)',value:data.layerCount,group:'Layers & structure'});}
    }
    // Bed presets can contain temperatures for several build surfaces. Use the selected surface only.
    const bedType=display(get(cfg,'curr_bed_type')).toLowerCase();
    const bedKey=bedType.includes('textured')?'textured_plate_temp':bedType.includes('cool')?'cool_plate_temp':bedType.includes('engineering')?'eng_plate_temp':bedType.includes('smooth')||bedType.includes('hot')||bedType.includes('high temp')?'hot_plate_temp':null;
    if(bedKey) for(const [id,k,label] of [['bedTemperature',bedKey,'Bed temperature'],['firstBedTemperature',bedKey+'_initial_layer','First layer bed']]) {
      const val=get(cfg,k);if(!present(val)) continue;data[id]=units(val,'°C');const detail=data.details.find(d=>d.id===id);if(detail) detail.value=data[id];else data.details.push({id,label,value:data[id],group:'Temperatures & cooling'});
    }
    for(const axis of ['X','Y','Z']) {
      const min=numeric(get(cfg,'MIN'+axis)),max=numeric(get(cfg,'MAX'+axis));
      if(min!==null&&max!==null&&max>=min) data.details.push({id:'extent'+axis,label:'Recorded '+axis+' extent',value:(max-min).toFixed(2)+' mm',group:'Print extents'});
    }
    // Preserve only explicit resin volume metadata; do not equate solid mesh volume with consumed resin.
    const resinMl=get(cfg,'used_material_ml','resin_volume_ml','resin_used_ml','material_used_ml');
    if(present(resinMl)) data.resinVolume=sum(resinMl);
    // Do not infer material cost or real power consumption from motion commands.
    return data;
  }
  function imageKind(bytes) {
    if(bytes.length>=24 && bytes[0]===137 && decoder.decode(bytes.subarray(1,4))==='PNG') {
      const v=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength),w=v.getUint32(16),h=v.getUint32(20);
      return w&&h&&w<=4096&&h<=4096&&w*h<=8*1024*1024?'image/png':null;
    }
    if(bytes[0]===255 && bytes[1]===216 && bytes[2]===255) return 'image/jpeg';
    if(decoder.decode(bytes.subarray(0,4))==='qoif') return 'image/qoi';
    return null;
  }
  function qoiToPng(b) {
    if(b.length<22 || decoder.decode(b.subarray(0,4))!=='qoif') throw Error('Invalid QOI preview');
    const v=new DataView(b.buffer,b.byteOffset,b.byteLength),w=v.getUint32(4),h=v.getUint32(8);
    if(!w||!h||w>2048||h>2048||w*h>4*1024*1024) throw Error('Preview dimensions are too large');
    const pixels=new Uint8ClampedArray(w*h*4),cache=new Uint8Array(64*4);
    let r=0,g=0,bl=0,a=255,p=14,run=0;
    const read=()=>{if(p>=b.length-8) throw Error('Truncated QOI preview');return b[p++];};
    for(let i=0;i<w*h;i++) {
      if(run) run--;
      else {
        const c=read();
        if(c===254) {r=read();g=read();bl=read();}
        else if(c===255) {r=read();g=read();bl=read();a=read();}
        else if((c&192)===0) {const k=(c&63)*4;r=cache[k];g=cache[k+1];bl=cache[k+2];a=cache[k+3];}
        else if((c&192)===64) {r=(r+((c>>4)&3)-2)&255;g=(g+((c>>2)&3)-2)&255;bl=(bl+(c&3)-2)&255;}
        else if((c&192)===128) {const d=read(),dg=(c&63)-32;r=(r+dg+(d>>4)-8)&255;g=(g+dg)&255;bl=(bl+dg+(d&15)-8)&255;}
        else run=c&63;
      }
      const k=((r*3+g*5+bl*7+a*11)%64)*4;
      cache.set([r,g,bl,a],k);pixels.set([r,g,bl,a],i*4);
    }
    const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
    canvas.getContext('2d').putImageData(new ImageData(pixels,w,h),0,0);
    return canvas.toDataURL('image/png');
  }
  function preview(bytes,label,plate=null,width=null,height=null) {
    if(bytes.length>IMAGE_LIMIT) return null;
    const type=imageKind(bytes); if(!type) return null;
    if(type==='image/qoi') {
      try{return {url:qoiToPng(bytes),label,plate,width,height};}catch{return null;}
    }
    return {url:URL.createObjectURL(new Blob([bytes],{type})),label,plate,width,height,extension:type==='image/jpeg'?'jpg':'png'};
  }
  function textPreviews(text,plate=null) {
    const images=[];
    const re=/;\s*thumbnail(?:_(?:PNG|JPG|JPEG|QOI))?\s+begin\s+(\d+)x(\d+)\s+\d+\s*\r?\n([\s\S]*?);\s*thumbnail(?:_(?:PNG|JPG|JPEG|QOI))?\s+end/gi;
    for(const m of text.matchAll(re)) {
      if(images.length>=8) break;
      const encoded=m[3].replace(/^[ \t]*;[ \t]?/gm,'').replace(/\s/g,'');
      if(encoded.length>IMAGE_LIMIT*1.4 || !/^[A-Za-z0-9+/]*={0,2}$/.test(encoded)) continue;
      try {
        const bytes=Uint8Array.from(atob(encoded),c=>c.charCodeAt(0));
        const image=preview(bytes,'Slicer preview '+m[1]+' × '+m[2],plate,Number(m[1]),Number(m[2]));
        if(image) images.push(image);
      }catch{ /* Unsupported or incomplete thumbnails must not prevent metadata import. */ }
    }
    return images.sort((a,b)=>(b.width*b.height)-(a.width*a.height));
  }
  async function inflate(bytes,format,limit,expected=null) {
    const reader=new Blob([bytes]).stream().pipeThrough(new DecompressionStream(format)).getReader();
    const chunks=[];let size=0;
    try {
      while(true) {const {done,value}=await reader.read();if(done) break;size+=value.length;if(size>limit) throw Error('Expanded file exceeds the reader limit');chunks.push(value);}
    }catch(error){await reader.cancel().catch(()=>{});throw error;}
    if(expected!==null&&size!==expected) throw Error('Truncated compressed data');
    const result=new Uint8Array(size);let p=0;for(const c of chunks){result.set(c,p);p+=c.length;}return result;
  }
  async function zip(file) {
    const tail=new Uint8Array(await file.slice(Math.max(0,file.size-65557)).arrayBuffer());
    const view=new DataView(tail.buffer);let eocd=-1;
    for(let p=tail.length-22;p>=0;p--) if(view.getUint32(p,true)===0x06054b50 && p+22+view.getUint16(p+20,true)===tail.length){eocd=p;break;}
    if(eocd<0) throw Error('This file is not a readable ZIP/3MF package');
    if(view.getUint16(eocd+4,true)||view.getUint16(eocd+6,true)) throw Error('Split ZIP packages are not supported');
    const count=view.getUint16(eocd+10,true),size=view.getUint32(eocd+12,true),offset=view.getUint32(eocd+16,true);
    if(count===65535 || size>8*MiB || offset+size>file.size) throw Error('ZIP64 or unusually large archive indexes are not supported');
    const directory=new Uint8Array(await file.slice(offset,offset+size).arrayBuffer()),dv=new DataView(directory.buffer),entries=new Map();let p=0;
    for(let i=0;i<count;i++) {
      if(p+46>directory.length || dv.getUint32(p,true)!==0x02014b50) throw Error('Invalid archive index');
      const nl=dv.getUint16(p+28,true),xl=dv.getUint16(p+30,true),cl=dv.getUint16(p+32,true);
      if(p+46+nl+xl+cl>directory.length) throw Error('Truncated archive index');
      const name=decoder.decode(directory.subarray(p+46,p+46+nl)).replace(/^\/+/, '');
      entries.set(name.toLowerCase(),{name,flags:dv.getUint16(p+8,true),method:dv.getUint16(p+10,true),crc:dv.getUint32(p+16,true),compressed:dv.getUint32(p+20,true),expanded:dv.getUint32(p+24,true),offset:dv.getUint32(p+42,true)});
      p+=46+nl+xl+cl;
    }
    let expandedTotal=0;
    async function read(name,limit=META_LIMIT) {
      const entry=entries.get(name.toLowerCase());if(!entry) return null;
      if(entry.flags&1) throw Error('Encrypted archive entries cannot be read');
      if(entry.expanded>limit||entry.compressed>TEXT_LIMIT||expandedTotal+entry.expanded>200*MiB) throw Error('Archive entry exceeds the reader limit');
      const header=new Uint8Array(await file.slice(entry.offset,entry.offset+30).arrayBuffer());
      if(header.length!==30) throw Error('Missing archive entry');
      const hv=new DataView(header.buffer);if(hv.getUint32(0,true)!==0x04034b50) throw Error('Invalid archive entry');
      const start=entry.offset+30+hv.getUint16(26,true)+hv.getUint16(28,true);
      if(start+entry.compressed>file.size) throw Error('Truncated archive entry');
      const raw=new Uint8Array(await file.slice(start,start+entry.compressed).arrayBuffer());
      const result=entry.method===0?raw:entry.method===8?await inflate(raw,'deflate-raw',limit,entry.expanded):null;
      if(!result) throw Error('Unsupported archive compression');
      if(result.length!==entry.expanded) throw Error('Truncated archive data');
      if(crc32(result)!==entry.crc) throw Error('Archive data checksum does not match');
      expandedTotal+=result.length;return result;
    }
    return {entries,read};
  }
  function xml(text) {
    if(/<!DOCTYPE|<!ENTITY/i.test(text)) throw Error('Unsupported XML document declarations');
    const doc=new DOMParser().parseFromString(text,'application/xml');
    if(doc.querySelector('parsererror')) throw Error('Invalid project XML');
    return doc;
  }
  function xmlSettings(text) {
    const out=Object.create(null),doc=xml(text);
    for(const el of doc.querySelectorAll('metadata')) {
      const k=el.getAttribute('key')||el.getAttribute('name'),v=el.getAttribute('value')??el.textContent;
      if(k&&present(v)&&!el.closest('plate,object,volume')) out[key(k)]=v;
    }
    return out;
  }
  function plateMetadata(text) {
    const doc=xml(text),plates=[];
    for(const el of doc.querySelectorAll('plate')) {
      const cfg=Object.create(null);
      for(const meta of [...el.children].filter(n=>n.localName==='metadata')) cfg[key(meta.getAttribute('key'))]=meta.getAttribute('value')??meta.textContent;
      const id=numeric(get(cfg,'index','plater_id'))??plates.length+1;
      const materials=[...el.querySelectorAll('filament')].map((f,i)=>({label:'Material '+(f.getAttribute('id')||i+1),type:f.getAttribute('type'),colour:f.getAttribute('color'),grams:numeric(f.getAttribute('used_g')),lengthMm:numeric(f.getAttribute('used_m'))===null?null:numeric(f.getAttribute('used_m'))*1000}));
      const names=[...el.querySelectorAll('object')].filter(o=>o.getAttribute('skipped')!=='true').map(o=>o.getAttribute('name')).filter(Boolean);
      plates.push({id,cfg,materials,names,objectCount:names.length||null});
    }
    return plates;
  }
  async function parsePackage(file,physical,isResin=false) {
    const archive=await zip(file),warnings=[],images=[],plateMaps=new Map();let cfg=Object.create(null);
    const readText=async(name,limit)=>{const b=await archive.read(name,limit);return b?decoder.decode(b):'';};
    const safe=async(fn,label)=>{try{return await fn();}catch{warnings.push(label+' could not be read.');return null;}};
    const configFiles=[...archive.entries.keys()].filter(n=>/\/(?:project_settings\.(?:config|json)|(?:prusa|slic3r).*\.config|print(?:_settings)?\.ini|config\.ini)$/.test(n)||/^(?:config|prusaslicer)\.ini$/.test(n));
    for(const name of configFiles) {
      const text=await safe(()=>readText(name),'Some slicer settings');if(!text) continue;
      try{Object.assign(cfg,flatten(JSON.parse(text)));}catch{Object.assign(cfg,text.trim().startsWith('<')?xmlSettings(text):ini(text));}
    }
    for(const name of [...archive.entries.keys()].filter(n=>/(?:model_settings|slice_info)\.config$/.test(n))) {
      const text=await safe(()=>readText(name),'Plate information');if(!text) continue;
      const parsed=await safe(()=>Promise.resolve(plateMetadata(text)),'Plate information');
      for(const p of parsed||[]) {
        const existing=plateMaps.get(p.id)||{id:p.id,cfg:{},materials:[],names:[]};
        existing.cfg={...existing.cfg,...p.cfg};if(p.materials.length) existing.materials=p.materials;if(p.names.length) {existing.names=p.names;existing.objectCount=p.objectCount;}plateMaps.set(p.id,existing);
      }
    }
    for(const name of archive.entries.keys()) {
      const match=name.match(/(?:^|\/)plate_(\d+)\.(json|gcode|gco|bgcode|png|jpe?g)$/i);
      if(match) {
        const id=Number(match[1]),p=plateMaps.get(id)||{id,cfg:{},materials:[],names:[]};plateMaps.set(id,p);
        if(match[2]==='json') {
          const s=await safe(()=>readText(name),'Plate settings');try {if(s) Object.assign(p.cfg,flatten(JSON.parse(s)));}catch{warnings.push('Some plate settings could not be read.');}
        }else if(/gcode|gco|bgcode/.test(match[2])) p.gcodePath=name;
        else if(!/_top|pick|no_light/.test(name)) p.imagePath=name;
      }
    }
    if(!plateMaps.size) plateMaps.set(1,{id:1,cfg:{},materials:[],names:[]});
    // Package object names/count do not claim per-plate counts unless plate metadata provides them.
    let packageNames=[],packageObjectCount=null;
    const modelConfig=[...archive.entries.keys()].find(n=>/model_settings\.config$/.test(n));
    if(modelConfig) {
      const text=await safe(()=>readText(modelConfig),'Object names');
      if(text) await safe(async()=>{const doc=xml(text);packageNames=[...doc.querySelectorAll('object')].flatMap(o=>[...o.children].filter(c=>c.localName==='metadata'&&c.getAttribute('key')==='name').map(c=>c.getAttribute('value'))).filter(Boolean);},'Object names');
    }
    const modelPath=[...archive.entries.keys()].find(n=>/^3d\/3dmodel\.model$/.test(n));
    if(modelPath && archive.entries.get(modelPath).expanded<=META_LIMIT) {
      await safe(async()=>{const doc=xml(await readText(modelPath));const build=[...doc.getElementsByTagNameNS('*','build')][0];if(build) packageObjectCount=[...build.children].filter(c=>c.localName==='item'&&c.getAttribute('printable')!=='0').length;for(const el of doc.getElementsByTagNameNS('*','metadata')) {const n=el.getAttribute('name');if(/application|title|description|designer|copyright|license/i.test(n||'')) cfg[key(n)]=el.textContent;}},'Model information');
    }
    const allGcodes=[...archive.entries.keys()].filter(n=>/\.(?:gcode|gco|nc|ngc|bgcode)$/.test(n));
    if(plateMaps.size===1 && ![...plateMaps.values()][0].gcodePath && allGcodes.length===1) [...plateMaps.values()][0].gcodePath=allGcodes[0];
    const plates=[];
    for(const p of [...plateMaps.values()].sort((a,b)=>a.id-b.id)) {
      let data=parseText('',{...cfg,...p.cfg},physical);
      if(p.gcodePath) {
        const b=await safe(()=>archive.read(p.gcodePath,TEXT_LIMIT),'Plate '+p.id+' print data');
        if(b) {
          if(/\.bgcode$/.test(p.gcodePath)) {
            const binary=await safe(()=>parseBinary(new Blob([b]),physical),'Binary print metadata');if(binary) {data={...data,...binary.plates[0]};images.push(...binary.images.map(x=>({...x,plate:p.id})));}
          }else {const s=decoder.decode(b);data=parseText(s,{...cfg,...p.cfg},physical);images.push(...textPreviews(s,p.id));}
        }
      }
      const sec=duration(get(p.cfg,'prediction','print_time','printing_time','estimated_print_time','estimated_printing_time','total_print_time','total_printing_time'));
      const mass=sum(get(p.cfg,'weight','filament_used_g','total_weight_g'));
      if(sec!==null&&sec>0) data.seconds=sec;
      if(mass!==null) {data.grams=mass;data.massSource='Recorded by slicer';}
      if(p.materials.length) {
        data.materials=p.materials;
        if(data.grams===null&&p.materials.every(m=>m.grams!==null)) {data.grams=p.materials.reduce((a,m)=>a+m.grams,0);data.massSource='Sum of recorded material weights';}
      }
      data.slicer=data.slicer||display(get(cfg,'application'))||null;
      if(isResin) data.technology='SLA';
      data.id=p.id;data.name=display(get(p.cfg,'plater_name','plate_name'))||'Plate '+p.id;
      data.objectNames=p.names.length?p.names:(plateMaps.size===1?packageNames:[]);
      data.objectCount=p.objectCount??(plateMaps.size===1?packageObjectCount:null);
      const dimensions=get(p.cfg,'bbox_all');
      if(!p.names.length) {
        const jsonPath=[...archive.entries.keys()].find(n=>n.endsWith('plate_'+p.id+'.json'));
        if(jsonPath) await safe(async()=>{const objects=JSON.parse(await readText(jsonPath)).bbox_objects;if(Array.isArray(objects)){data.objectNames=objects.map(o=>o.name).filter(Boolean);data.objectCount=objects.length;}},'Object names');
      }
      if(Array.isArray(dimensions)&&dimensions.length===4&&dimensions.every(n=>numeric(n)!==null)) data.details.push({id:'plateExtent',label:'Recorded plate footprint',value:(dimensions[2]-dimensions[0]).toFixed(2)+' × '+(dimensions[3]-dimensions[1]).toFixed(2)+' mm',group:'Print extents'});
      plates.push(data);
    }
    const relationshipImages=[];
    if(archive.entries.has('_rels/.rels')) await safe(async()=>{
      const doc=xml(await readText('_rels/.rels'));
      for(const rel of doc.getElementsByTagNameNS('*','Relationship')) {
        if(rel.getAttribute('TargetMode')==='External'||!String(rel.getAttribute('Type')).endsWith('/thumbnail')) continue;
        const target=String(rel.getAttribute('Target')||'').replace(/^\//,'').toLowerCase();
        if(archive.entries.has(target)) relationshipImages.push(target);
      }
    },'Project thumbnail');
    const imageNames=[...new Set([...relationshipImages,...[...archive.entries.keys()].filter(n=>/\.(png|jpe?g|qoi)$/.test(n)&&/(?:thumbnail|plate_\d+\.(?:png|jpe?g)$|preview)/.test(n)&&!/(?:top|pick|no_light|layer)/.test(n))])];
    for(const name of imageNames.slice(0,24)) {
      const b=await safe(()=>archive.read(name,IMAGE_LIMIT),'A preview image');if(!b) continue;
      const m=name.match(/plate_(\d+)/),plate=m?Number(m[1]):null,image=preview(b,m?'Plate '+m[1]+' preview':'Project preview',plate);
      if(image) images.push(image);
    }
    return {format:isResin?'Resin package':'3MF project',plates,images,warnings,packageObjectCount};
  }
  function heatshrink(bytes,size,windowBits) {
    const out=new Uint8Array(size);let bit=0,p=0;
    const read=n=>{if(bit+n>bytes.length*8) throw Error('Truncated binary metadata');let v=0;while(n--) {v=(v<<1)|((bytes[bit>>3]>>(7-(bit&7)))&1);bit++;}return v;};
    while(p<size) {
      if(read(1)) out[p++]=read(8);
      else {const distance=read(windowBits)+1,length=read(4)+1;if(p+length>size) throw Error('Invalid binary metadata length');for(let i=0;i<length;i++) {out[p]=p>=distance?out[p-distance]:0;p++;}}
    }
    return out;
  }
  async function parseBinary(file,physical) {
    const bytes=new Uint8Array(await file.arrayBuffer()),v=new DataView(bytes.buffer),cfg=Object.create(null),images=[],warnings=[];
    if(bytes.length<10||decoder.decode(bytes.subarray(0,4))!=='GCDE'||v.getUint32(4,true)!==1) throw Error('Unsupported binary G-code version');
    const checksum=v.getUint16(8,true);if(checksum>1) throw Error('Unsupported binary checksum format');
    let p=10,blocks=0;
    while(p<bytes.length) {
      if(p+8>bytes.length||++blocks>100000) throw Error('Invalid binary block');
      const type=v.getUint16(p,true),compression=v.getUint16(p+2,true),size=v.getUint32(p+4,true),head=compression?12:8;
      if(p+head>bytes.length) throw Error('Truncated binary block');
      const stored=compression?v.getUint32(p+8,true):size,params=type===5?6:2,start=p+head+params,end=start+stored;
      if(type>5||end+(checksum?4:0)>bytes.length) throw Error('Invalid binary block length');
      if(type!==1) {
        if(checksum && crc32(bytes.subarray(p,end))!==v.getUint32(end,true)) {warnings.push('A damaged metadata block was skipped.');p=end+4;continue;}
        if(size>META_LIMIT) {warnings.push('An unusually large metadata block was skipped.');}
        else {
          let b=bytes.subarray(start,end);
          if(compression===1) b=await inflate(b,'deflate',META_LIMIT,size);
          else if(compression===2||compression===3) b=heatshrink(b,size,compression===2?11:12);
          else if(compression!==0) throw Error('Unsupported metadata compression');
          if(type===5) {const w=v.getUint16(p+head+2,true),h=v.getUint16(p+head+4,true),image=preview(b,'Slicer preview '+w+' × '+h,null,w,h);if(image) images.push(image);}
          else if(v.getUint16(p+head,true)===0) Object.assign(cfg,ini(decoder.decode(b)));
        }
      }
      // Toolpath blocks may use MeatPack. Metadata/thumbnails are separate and readable without executing them.
      p=end+(checksum?4:0);
    }
    const data=parseText('',cfg,physical);data.id=1;data.name='Print';
    return {format:'Binary G-code',plates:[data],images:images.sort((a,b)=>b.width*b.height-a.width*a.height),warnings};
  }
  async function parse(file,physical={}) {
    if(file.size>400*MiB) throw Error('Please use a sliced file smaller than 400 MB');
    const extension=(file.name.toLowerCase().match(/\.([a-z0-9]+)$/)||[])[1]||'';
    let result;
    if(extension==='3mf') result=await parsePackage(file,physical);
    else if(extension==='stl') result=await window.PrintProfitStl.parse(file);
    else if(extension==='bgcode') result=await parseBinary(file,physical);
    else if(['sl1','sl1s'].includes(extension)) result=await parsePackage(file,physical,true);
    else if(['gcode','gco','nc','ngc','gc','g'].includes(extension)) {
      if(file.size>TEXT_LIMIT) throw Error('Please use a G-code file smaller than 120 MB');
      const text=await file.text(),data=parseText(text,{},physical);data.id=1;data.name='Print';
      result={format:'G-code',plates:[data],images:textPreviews(text),warnings:[]};
    }else {
      result={format:extension.toUpperCase()||'Unknown file',plates:[{id:1,name:'File',details:[],settings:[],materials:[]}],images:[],warnings:['This file format is recognised but its print metadata is not decoded. Export a sliced 3MF or standard G-code for more detail.']};
    }
    result.fileName=file.name;result.fileSize=file.size;
    return result;
  }
  window.PrintProfitSlicerFile={parse,definitions,duration};
})();
