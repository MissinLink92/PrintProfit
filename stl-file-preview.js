/* STL geometry inspection and local model preview; STL files do not contain slicer estimates. */
(() => {
  'use strict';
  async function parse(file) {
    if(file.size>120*1024*1024) throw Error('Please use an STL file smaller than 120 MB');
    const bytes=new Uint8Array(await file.arrayBuffer()),view=new DataView(bytes.buffer);
    const binaryCount=bytes.length>=84?view.getUint32(80,true):0;
    const binary=bytes.length>=84&&84+binaryCount*50===bytes.length;
    let vertices,count;
    if(binary) {
      count=binaryCount;vertices=new Float32Array(count*9);
      for(let i=0;i<count;i++) for(let j=0;j<9;j++) vertices[i*9+j]=view.getFloat32(84+i*50+12+j*4,true);
    }else {
      const text=new TextDecoder().decode(bytes),coords=[];
      if(!/^\s*solid\b/i.test(text)) throw Error('The STL geometry could not be recognised');
      for(const match of text.matchAll(/\bvertex\s+([+-]?[\d.eE]+)\s+([+-]?[\d.eE]+)\s+([+-]?[\d.eE]+)/g)) coords.push(Number(match[1]),Number(match[2]),Number(match[3]));
      if(!coords.length||coords.length%9) throw Error('The STL triangle data is incomplete');
      vertices=new Float32Array(coords);count=coords.length/9;
    }
    if(!count||count>2500000) throw Error('The STL is empty or too complex for this preview');
    const min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
    for(let i=0;i<vertices.length;i++) {const n=vertices[i];if(!Number.isFinite(n)) throw Error('The STL contains invalid coordinates');const axis=i%3;min[axis]=Math.min(min[axis],n);max[axis]=Math.max(max[axis],n);}
    const sizes=max.map((n,i)=>n-min[i]),centre=max.map((n,i)=>(n+min[i])/2),scale=Math.max(...sizes);
    const details=sizes.map((n,i)=>({id:'dimension'+i,label:['Width (X)','Depth (Y)','Height (Z)'][i],value:n.toFixed(2)+' mm (assumed)',group:'Model geometry'}));
    details.push({id:'triangles',label:'Mesh triangles',value:count.toLocaleString('en-GB'),group:'Model geometry'});
    const images=[],warnings=['STL stores geometry, not print settings, print time or material usage. Its unitless coordinates are shown assuming millimetres. Slice the model and export G-code or a sliced 3MF for print estimates.'];
    const canvas=document.createElement('canvas');canvas.width=512;canvas.height=512;
    const gl=canvas.getContext('webgl',{alpha:true,antialias:true,preserveDrawingBuffer:true});
    if(gl&&scale>0) {
      let buffer,program;
      try {
        const mesh=new Float32Array(count*18);
        for(let i=0;i<count;i++) {
          const v=i*9,ax=vertices[v+3]-vertices[v],ay=vertices[v+4]-vertices[v+1],az=vertices[v+5]-vertices[v+2],bx=vertices[v+6]-vertices[v],by=vertices[v+7]-vertices[v+1],bz=vertices[v+8]-vertices[v+2];
          const normal=[ay*bz-az*by,az*bx-ax*bz,ax*by-ay*bx],length=Math.hypot(...normal)||1;
          for(let j=0;j<3;j++) for(let k=0;k<3;k++) {mesh[i*18+j*6+k]=(vertices[v+j*3+k]-centre[k])/scale;mesh[i*18+j*6+3+k]=normal[k]/length;}
        }
        function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){gl.deleteShader(s);throw Error('Preview shader unavailable');}return s;}
        const vs=shader(gl.VERTEX_SHADER,'attribute vec3 p; attribute vec3 n; varying vec3 normal; void main(){float x=.70710678*(p.x-p.y);float y=.70710678*(p.x+p.y);gl_Position=vec4(1.25*x,1.25*(.766044*p.z-.642788*y),.6*(.766044*y+.642788*p.z),1.);normal=n;}');
        const fs=shader(gl.FRAGMENT_SHADER,'precision mediump float;varying vec3 normal;void main(){float light=.32+.68*abs(dot(normalize(normal),normalize(vec3(-.4,-.6,.8))));gl_FragColor=vec4(vec3(.07,.75,.85)*light,1.);}');
        program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);
        if(!gl.getProgramParameter(program,gl.LINK_STATUS)) throw Error('Preview shader unavailable');
        gl.useProgram(program);buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,mesh,gl.STATIC_DRAW);
        for(const [name,offset] of [['p',0],['n',12]]) {const location=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,3,gl.FLOAT,false,24,offset);}
        gl.viewport(0,0,512,512);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);gl.drawArrays(gl.TRIANGLES,0,count*3);
        const url=canvas.toDataURL('image/png');images.push({url,label:'Preview generated from STL geometry',plate:null,width:512,height:512,generated:true});
      }catch{warnings.push('A model preview could not be generated on this device.');}
      finally{if(buffer) gl.deleteBuffer(buffer);if(program) gl.deleteProgram(program);gl.getExtension('WEBGL_lose_context')?.loseContext();}
    }else warnings.push('A model preview could not be generated on this device.');
    return {format:'STL model',plates:[{id:1,name:'Model',grams:null,seconds:null,details,settings:[],materials:[]}],images,warnings};
  }
  window.PrintProfitStl={parse};
})();
