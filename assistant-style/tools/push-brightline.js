/* push-brightline.js "commit message" [--create]
   Mirrors the Brightline assistant prototypes to github.com/richhemsley3/brightline-assistant-prototypes (main) through
   the GitHub API, without local git (local git can fail on an unaccepted Xcode licence). Needs `gh` signed in.
   The repo is a mirror of these local folders:
     brightline-onboarding/  ← ~/Desktop/Claude/brightline-onboarding
     brightline-assist/      ← ~/Desktop/Claude/brightline-assist
     assistant-style/        ← ~/Desktop/Claude/assistant-style (except repo-root/)
     /                       ← ~/Desktop/Claude/assistant-style/repo-root (index.html, README.md, .gitignore)
   Files removed locally are removed from the repo. Never uploaded: font files (Proxima Nova is licensed), check-tool output. */
const {execFileSync}=require("child_process"), fs=require("fs"), path=require("path"), os=require("os");
const REPO="richhemsley3/brightline-assistant-prototypes", R="repos/"+REPO, C=path.join(os.homedir(),"Desktop/Claude");
const MAP=[["brightline-onboarding",path.join(C,"brightline-onboarding")],["brightline-assist",path.join(C,"brightline-assist")],["assistant-style",path.join(C,"assistant-style")],["",path.join(C,"assistant-style/repo-root")]];
const SKIP=[/(^|\/)fonts\//,/\.(otf|ttf|woff2?)$/i,/(^|\/)\.DS_Store$/,/(^|\/)cdp-profile-/,/assistant-style\/tools\/shots\//,/assistant-style\/tools\/[^/]*-results\.json$/,/\.log$/,/^assistant-style\/repo-root\//,/(^|\/)node_modules\//,/(^|\/)\.git\//];
const msg=process.argv[2]; if(!msg){ console.error("usage: node push-brightline.js \"commit message\" [--create]"); process.exit(1) }
const gh=(args,input)=>execFileSync("gh",args,{input,encoding:"utf8",maxBuffer:1<<28}).trim();
function walk(dir,prefix,out){ for(const n of fs.readdirSync(dir)){ const p=path.join(dir,n), rel=prefix?prefix+"/"+n:n; if(SKIP.some(r=>r.test(rel))) continue; const st=fs.statSync(p); if(st.isDirectory()) walk(p,rel,out); else out.push([rel,p]) } return out }
const files=[]; for(const [pre,dir] of MAP) walk(dir,pre,files);
if(process.argv.includes("--create")){ try{ gh(["repo","view",REPO]) }catch(e){ gh(["repo","create",REPO,"--public","--add-readme","--description","Brightline Onboarding and Brightline Assist: concept prototypes of an AI assistant in a card network's portals, with the shared style and handoff docs"]) } }
const head=gh(["api",R+"/git/ref/heads/main","--jq",".object.sha"]);
const tree=files.map(([rel,p],i)=>{ const sha=gh(["api",R+"/git/blobs","--input","-","--jq",".sha"],JSON.stringify({content:fs.readFileSync(p).toString("base64"),encoding:"base64"})); if((i+1)%20===0) console.log("  "+(i+1)+" of "+files.length+" uploaded"); return {path:rel,mode:"100644",type:"blob",sha} });
const nt=gh(["api",R+"/git/trees","--input","-","--jq",".sha"],JSON.stringify({tree}));
const nc=gh(["api",R+"/git/commits","--input","-","--jq",".sha"],JSON.stringify({message:msg+"\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",tree:nt,parents:[head]}));
console.log("commit "+gh(["api","-X","PATCH",R+"/git/refs/heads/main","-f","sha="+nc,"--jq",".object.sha"]).slice(0,7)+" · "+files.length+" files");
console.log("Pages: https://richhemsley3.github.io/brightline-assistant-prototypes/");
