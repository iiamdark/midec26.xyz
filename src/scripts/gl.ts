// A reflective torus knot, built directly with WebGL. No external 3D runtime.
type Vec3 = [number, number, number];
const vertex = `
attribute vec3 aPosition;
attribute vec3 aNormal;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uTime;
uniform float uScroll;
varying vec3 vNormal;
varying vec3 vPosition;
mat3 rotateY(float a) { float c=cos(a),s=sin(a); return mat3(c,0.,s,0.,1.,0.,-s,0.,c); }
mat3 rotateX(float a) { float c=cos(a),s=sin(a); return mat3(1.,0.,0.,0.,c,-s,0.,s,c); }
void main() {
  mat3 rot = rotateY(uTime*.12 + uPointer.x*.22 + uScroll*1.5) * rotateX(.45 + uPointer.y*.18 + uScroll*.65);
  vec3 p = rot * aPosition;
  p.y += sin(uTime*.6)*.055;
  vPosition = p;
  vNormal = rot * aNormal;
  float depth = 4.5 - p.z;
  vec2 projected = p.xy * 3.2 / depth;
  projected.x /= uResolution.x/uResolution.y;
  gl_Position = vec4(projected, -p.z*.05, 1.);
}`;
const fragment = `
precision mediump float;
varying vec3 vNormal;
varying vec3 vPosition;
vec3 environment(vec3 r) {
  float band = pow(abs(sin(r.y*3.8 + r.x*1.4)), 14.);
  float studio = smoothstep(.15,.52,r.y)*.75;
  float strip = pow(max(0.,1.-abs(r.x*.7+r.z*.65)),28.);
  vec3 col=vec3(.055,.065,.07) + vec3(.65,.68,.65)*studio + vec3(.95,.98,.9)*band*.85;
  col += vec3(.82,.94,.18) * pow(max(0.,-r.x*.8+r.y*.2+r.z*.3),8.) * .75;
  return col + strip*vec3(.9,.92,.84);
}
void main() {
  vec3 n=normalize(vNormal), eye=normalize(vec3(0.,0.,4.5)-vPosition);
  vec3 r=reflect(-eye,n);
  float fresnel=pow(1.-max(0.,dot(n,eye)),3.);
  vec3 col=environment(r);
  col *= .6 + .4*max(0.,dot(n,normalize(vec3(-1.,2.,3.))));
  col += fresnel*vec3(.48,.55,.32);
  col=pow(col,vec3(.88));
  gl_FragColor=vec4(col,1.);
}`;

const norm=(v:Vec3):Vec3=>{ const l=Math.hypot(...v)||1;return v.map(x=>x/l) as Vec3; };
const sub=(a:Vec3,b:Vec3):Vec3=>a.map((x,i)=>x-b[i]) as Vec3;
const cross=(a:Vec3,b:Vec3):Vec3=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const center=(t:number):Vec3=>[(2+Math.cos(3*t))*Math.cos(2*t)*.43,(2+Math.cos(3*t))*Math.sin(2*t)*.43,Math.sin(3*t)*.43];
function knot() {
  const positions:number[]=[], normals:number[]=[];
  const point=(i:number,j:number)=>{
    const t=i/180*Math.PI*2, a=j/20*Math.PI*2, p=center(t);
    const tangent=norm(sub(center(t+.001),center(t-.001)));
    const side=norm(cross(tangent,Math.abs(tangent[2])>.95?[0,1,0]:[0,0,1]));
    const up=cross(side,tangent);
    const n=side.map((v,k)=>v*Math.cos(a)+up[k]*Math.sin(a)) as Vec3;
    return {p:p.map((v,k)=>v+n[k]*.245) as Vec3,n};
  };
  for(let i=0;i<180;i++) for(let j=0;j<20;j++) {
    const a=point(i,j),b=point(i+1,j),c=point(i+1,j+1),d=point(i,j+1);
    for(const v of [a,b,c,a,c,d]) {positions.push(...v.p);normals.push(...v.n);}
  }
  return {positions:new Float32Array(positions),normals:new Float32Array(normals)};
}

export function sculpture(canvas:HTMLCanvasElement,reduced:boolean) {
  const noop=()=>{};
  let gl:WebGLRenderingContext|null;
  try { gl=canvas.getContext('webgl',{alpha:true,antialias:true,powerPreference:'low-power'}); } catch { return noop; }
  if(!gl) return noop;
  const shaders:WebGLShader[]=[],buffers:WebGLBuffer[]=[];
  const compile=(kind:number,source:string)=>{
    const s=gl!.createShader(kind);
    if(!s) return null;
    shaders.push(s); gl!.shaderSource(s,source);gl!.compileShader(s);
    return gl!.getShaderParameter(s,gl!.COMPILE_STATUS)?s:null;
  };
  const vs=compile(gl.VERTEX_SHADER,vertex),fs=compile(gl.FRAGMENT_SHADER,fragment),prog=gl.createProgram();
  const release=()=>{buffers.forEach(b=>gl!.deleteBuffer(b));shaders.forEach(s=>gl!.deleteShader(s));if(prog)gl!.deleteProgram(prog);};
  if(!vs||!fs||!prog){release();return noop;}
  gl.attachShader(prog,vs);gl.attachShader(prog,fs);gl.linkProgram(prog);
  if(!gl.getProgramParameter(prog,gl.LINK_STATUS)){release();return noop;}
  gl.useProgram(prog);
  const mesh=knot();
  for(const [name,data] of [['aPosition',mesh.positions],['aNormal',mesh.normals]] as const) {
    const buffer=gl.createBuffer();if(!buffer){release();return noop;}buffers.push(buffer);
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
    const loc=gl.getAttribLocation(prog,name);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,3,gl.FLOAT,false,0,0);
  }
  gl.enable(gl.DEPTH_TEST);gl.clearColor(0,0,0,0);
  const res=gl.getUniformLocation(prog,'uResolution'),time=gl.getUniformLocation(prog,'uTime'),pointer=gl.getUniformLocation(prog,'uPointer'),scroll=gl.getUniformLocation(prog,'uScroll');
  let raf=0,visible=false,disposed=false,last=0,lost=false;
  const target={x:0,y:0},current={x:0,y:0};
  const compact=matchMedia('(max-width: 700px)').matches;
  const render=(now:number)=>{
    raf=0;if(disposed||lost||!visible||document.hidden)return;
    if(!reduced && now-last<(compact?33:16)){raf=requestAnimationFrame(render);return;}last=now;
    const dpr=Math.min(devicePixelRatio,compact?1.25:1.6);
    const w=Math.max(1,Math.round(canvas.clientWidth*dpr)),h=Math.max(1,Math.round(canvas.clientHeight*dpr));
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl!.viewport(0,0,w,h);}
    current.x+=(target.x-current.x)*.045;current.y+=(target.y-current.y)*.045;
    gl!.uniform2f(res,w,h);gl!.uniform1f(time,reduced?4:now/1000);
    gl!.uniform2f(pointer,current.x,current.y);gl!.uniform1f(scroll,reduced?0:Math.min(1,Math.max(0,-canvas.getBoundingClientRect().top/innerHeight)));
    gl!.clear(gl!.COLOR_BUFFER_BIT|gl!.DEPTH_BUFFER_BIT);gl!.drawArrays(gl!.TRIANGLES,0,mesh.positions.length/3);
    canvas.parentElement?.classList.add('gl-ready');
    if(!reduced)raf=requestAnimationFrame(render);
  };
  const schedule=()=>{if(!raf&&!disposed&&visible&&!document.hidden&&!lost)raf=requestAnimationFrame(render);};
  const observer=new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(visible)schedule();else{cancelAnimationFrame(raf);raf=0;}});
  observer.observe(canvas);
  const resize=new ResizeObserver(schedule);resize.observe(canvas);
  const move=(e:PointerEvent)=>{if(reduced)return;target.x=(e.clientX/innerWidth-.5)*2;target.y=(e.clientY/innerHeight-.5)*2;};
  const visibility=()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else schedule();};
  const contextLost=(e:Event)=>{e.preventDefault();lost=true;cancelAnimationFrame(raf);raf=0;canvas.parentElement?.classList.remove('gl-ready');};
  window.addEventListener('pointermove',move,{passive:true});document.addEventListener('visibilitychange',visibility);canvas.addEventListener('webglcontextlost',contextLost);
  return ()=>{disposed=true;cancelAnimationFrame(raf);observer.disconnect();resize.disconnect();window.removeEventListener('pointermove',move);document.removeEventListener('visibilitychange',visibility);canvas.removeEventListener('webglcontextlost',contextLost);release();};
}
