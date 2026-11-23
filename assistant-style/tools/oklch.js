/* oklch.js : hex <-> OKLCH, gamut clamp, WCAG contrast. Used to audit the old palette and build the new one. */
const toLin=c=>{c/=255;return c<=0.04045?c/12.92:Math.pow((c+0.055)/1.055,2.4)};
const toGam=c=>{c=c<=0.0031308?12.92*c:1.055*Math.pow(c,1/2.4)-0.055;return Math.round(Math.max(0,Math.min(1,c))*255)};
function hexToOklch(hex){ const n=parseInt(hex.slice(1),16); const r=toLin(n>>16&255),g=toLin(n>>8&255),b=toLin(n&255);
  const l=Math.cbrt(0.4122214708*r+0.5363325363*g+0.0514459929*b), m=Math.cbrt(0.2119034982*r+0.6806995451*g+0.1073969566*b), s=Math.cbrt(0.0883024619*r+0.2817188376*g+0.6299787005*b);
  const L=0.2104542553*l+0.7936177850*m-0.0040720468*s, A=1.9779984951*l-2.4285922050*m+0.4505937099*s, B=0.0259040371*l+0.7827717662*m-0.8086757660*s;
  let h=Math.atan2(B,A)*180/Math.PI; if(h<0) h+=360; return {L, C:Math.hypot(A,B), h} }
function oklchToRgbLin(L,C,h){ const a=C*Math.cos(h*Math.PI/180), b=C*Math.sin(h*Math.PI/180);
  const l=Math.pow(L+0.3963377774*a+0.2158037573*b,3), m=Math.pow(L-0.1055613458*a-0.0638541728*b,3), s=Math.pow(L-0.0894841775*a-1.2914855480*b,3);
  return [4.0767416621*l-3.3077115913*m+0.2309699292*s, -1.2684380046*l+2.6097574011*m-0.3413193965*s, -0.0041960863*l-0.7034186147*m+1.7076147010*s] }
function oklchToHex(L,C,h){ let lo=0, hi=C, rgb=oklchToRgbLin(L,C,h); const inG=v=>v.every(x=>x>=-0.0001&&x<=1.0001);
  if(!inG(rgb)){ for(let i=0;i<24;i++){ const mid=(lo+hi)/2; if(inG(oklchToRgbLin(L,mid,h))) lo=mid; else hi=mid } rgb=oklchToRgbLin(L,lo,h) }
  return '#'+rgb.map(toGam).map(v=>v.toString(16).padStart(2,'0')).join('').toUpperCase() }
function lum(hex){ const n=parseInt(hex.slice(1),16); const f=c=>toLin(c); return 0.2126*f(n>>16&255)+0.7152*f(n>>8&255)+0.0722*f(n&255) }
function contrast(a,b){ const x=lum(a),y=lum(b); return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05) }
module.exports={hexToOklch,oklchToHex,contrast};
if(require.main===module){
  const old={ground:'#F4F3F0',ink:'#1C1A17',blue:'#3144B7','blue-2':'#9EAAFC','blue-bg':'#EEF0FE',violet:'#2B1F77',green:'#2F7A3E','green-tile':'#9FD1AE',amber:'#A2701A','amber-bg':'#FBF1DC',orange:'#FE6200'};
  console.log('OLD PALETTE (OKLCH: L lightness 0-1, C chroma, h hue°)');
  for(const k in old){ const o=hexToOklch(old[k]); console.log(k.padEnd(11),old[k],'L '+o.L.toFixed(2),'C '+o.C.toFixed(3),'h '+Math.round(o.h)+'°','· on white '+contrast(old[k],'#FFFFFF').toFixed(2)) }
}
