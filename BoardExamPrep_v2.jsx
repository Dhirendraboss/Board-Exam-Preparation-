import { useState, useEffect, useRef } from "react";

// ── CONSTANTS ──────────────────────────────────────────────────────────────
const ADMIN_EMAIL = "dk2649367@gmail.com";
const ADMIN_PASS  = "Dhirendra245789101112A";

const INIT_USERS = [
  { id:"admin1", name:"Dhirendra (Admin)", email:ADMIN_EMAIL, password:ADMIN_PASS, role:"admin",    stream:"PCM",     cls:"12", points:9999, avatar:"DK", color:"#F97316", streak:30, badges:["👑","🏆","🔥"] },
  { id:"u1",     name:"Priya Sharma",      email:"priya@gmail.com",   password:"priya123",  role:"student", stream:"PCM",     cls:"12", points:1240, avatar:"PS", color:"#8B5CF6", streak:7,  badges:["🔥","💯"] },
  { id:"u2",     name:"Rahul Verma",       email:"rahul@gmail.com",   password:"rahul123",  role:"student", stream:"PCB",     cls:"11", points:980,  avatar:"RV", color:"#10B981", streak:4,  badges:["📚"] },
  { id:"u3",     name:"Ananya Singh",      email:"ananya@gmail.com",  password:"ananya123", role:"student", stream:"Commerce",cls:"12", points:860,  avatar:"AS", color:"#F59E0B", streak:12, badges:["🔥","⚡"] },
  { id:"u4",     name:"Karan Mehta",       email:"karan@gmail.com",   password:"karan123",  role:"student", stream:"PCM",     cls:"11", points:750,  avatar:"KM", color:"#EF4444", streak:3,  badges:["💡"] },
  { id:"u5",     name:"Sneha Patel",       email:"sneha@gmail.com",   password:"sneha123",  role:"student", stream:"Arts",    cls:"12", points:630,  avatar:"SP", color:"#06B6D4", streak:5,  badges:["📚","💬"] },
];

const INIT_NOTICES = [
  { id:"n1", title:"📢 Class 12 Board Exam Schedule Released!", body:"CBSE has released the official datesheet for Class 12 Board Exams 2026. Exams will begin from February 15, 2026.", priority:"urgent",    date:"2026-03-10" },
  { id:"n2", title:"🆕 New JEE Mock Test Series Added",          body:"A brand new 16-paper JEE Mock Test Series has been added. Covers full JEE Main syllabus. Certificates on 80%+ score!", priority:"important", date:"2026-03-08" },
  { id:"n3", title:"📚 Project 45 — 45-Day Revision Plan",       body:"Join our intensive 45-day board exam preparation plan. Daily tasks, notes, and quizzes included.",                   priority:"normal",    date:"2026-03-05" },
];

const INIT_POSTS = [
  { id:"p1", userId:"u1", content:"Just solved the integration chapter completely! Newton-Leibniz theorem is finally clear 🎉 Anyone need help?", likes:["u2","u4"], tags:["#Maths","#Integration"], time:"2h ago", replies:[
    { id:"r1", userId:"u2", content:"That's amazing! Can you explain the substitution method?", likes:[], time:"1h ago" },
    { id:"r2", userId:"u4", content:"Yes please help! I'm stuck on trigonometric substitution 😅", likes:["u1"], time:"45m ago" },
  ]},
  { id:"p2", userId:"u2", content:"Biology students — the Human Reproduction chapter is really important for NEET. I've compiled notes. Drop a 🙋 if you want them!", likes:["u1","u3","u5"], tags:["#Biology","#NEET"], time:"5h ago", replies:[
    { id:"r3", userId:"u5", content:"🙋 Please share! I need them badly!", likes:["u2"], time:"4h ago" },
  ]},
  { id:"p3", userId:"u4", content:"Question ❓: What is the most important chapter in Physics for JEE Main? I'm running out of time.", likes:["u1","u2"], tags:["#Physics","#JEE","#Doubt"], time:"1d ago", replies:[
    { id:"r4", userId:"u1", content:"Mechanics + Electrostatics are highest weightage. Focus on those first!", likes:["u4","u2"], time:"23h ago" },
  ]},
];

const INIT_QUESTIONS = [
  { id:"q1", subject:"Physics",      chapter:"Laws of Motion",   cls:"11", difficulty:"Medium", marks:1, question:"A block of mass 5 kg is on a frictionless surface. Force of 20 N applied. Acceleration?", options:["2 m/s²","4 m/s²","5 m/s²","10 m/s²"], correct:1, explanation:"F=ma → a=20/5=4 m/s²" },
  { id:"q2", subject:"Chemistry",    chapter:"Atomic Structure",  cls:"11", difficulty:"Easy",   marks:1, question:"Number of electrons in outermost shell of Chlorine (Z=17)?", options:["5","6","7","8"], correct:2, explanation:"Config of Cl: 2,8,7 — outermost has 7." },
  { id:"q3", subject:"Mathematics",  chapter:"Limits",            cls:"11", difficulty:"Hard",   marks:1, question:"lim(x→0) [sin(x)/x] equals:", options:["0","∞","1","undefined"], correct:2, explanation:"Standard limit: lim(x→0) sin(x)/x = 1." },
  { id:"q4", subject:"Physics",      chapter:"Electrostatics",    cls:"12", difficulty:"Medium", marks:1, question:"Two charges +q and -q separated by d. Electric potential at midpoint?", options:["kq/d","Zero","2kq/d","-kq/d"], correct:1, explanation:"V = k(+q)/(d/2) + k(-q)/(d/2) = 0" },
  { id:"q5", subject:"Chemistry",    chapter:"Electrochemistry",  cls:"12", difficulty:"Medium", marks:1, question:"During electrolysis, oxidation occurs at:", options:["Cathode","Anode","Both","Neither"], correct:1, explanation:"Oxidation (loss of e⁻) occurs at anode." },
  { id:"q6", subject:"Mathematics",  chapter:"Integrals",         cls:"12", difficulty:"Hard",   marks:1, question:"∫(1/x)dx equals:", options:["x²/2+C","ln|x|+C","1/x²+C","-1/x+C"], correct:1, explanation:"∫(1/x)dx = ln|x|+C" },
  { id:"q7", subject:"Biology",      chapter:"Cell Division",     cls:"11", difficulty:"Easy",   marks:1, question:"DNA replication occurs in which phase?", options:["G1","S phase","G2","M phase"], correct:1, explanation:"S (Synthesis) phase — DNA replication happens here." },
  { id:"q8", subject:"Accountancy",  chapter:"Financial Statements",cls:"12",difficulty:"Medium",marks:1, question:"Goodwill is classified as:", options:["Current Asset","Fixed Asset","Intangible Asset","Fictitious Asset"], correct:2, explanation:"Goodwill is an intangible asset." },
  { id:"q9", subject:"Physics",      chapter:"Optics",            cls:"12", difficulty:"Medium", marks:1, question:"Which phenomenon explains the blue colour of sky?", options:["Reflection","Scattering","Refraction","Diffraction"], correct:1, explanation:"Rayleigh scattering — shorter wavelengths (blue) scatter more." },
  { id:"q10",subject:"Chemistry",    chapter:"Thermodynamics",    cls:"11", difficulty:"Hard",   marks:1, question:"For a spontaneous process at constant T and P, Gibbs energy change (ΔG) is:", options:["ΔG > 0","ΔG = 0","ΔG < 0","ΔG = ∞"], correct:2, explanation:"ΔG < 0 for spontaneous processes at constant T and P." },
];

const INIT_PDFS = [
  { id:"pdf1", title:"Physics Class 11 — Complete Notes",        subject:"Physics",     cls:"11", chapter:"All Chapters",        size:"4.2 MB", downloads:234, date:"2026-03-01" },
  { id:"pdf2", title:"Chemistry Organic — Reaction Mechanisms",  subject:"Chemistry",   cls:"12", chapter:"Organic Chemistry",   size:"3.8 MB", downloads:189, date:"2026-03-05" },
  { id:"pdf3", title:"Mathematics — Integration Formulas Sheet", subject:"Mathematics", cls:"12", chapter:"Integrals",           size:"1.2 MB", downloads:312, date:"2026-03-08" },
  { id:"pdf4", title:"Biology — Human Physiology Complete",      subject:"Biology",     cls:"12", chapter:"Human Physiology",    size:"5.1 MB", downloads:156, date:"2026-02-28" },
  { id:"pdf5", title:"JEE Maths — PYQ 2015-2025",               subject:"Mathematics", cls:"JEE",chapter:"Previous Year Qs",   size:"7.3 MB", downloads:445, date:"2026-03-10" },
  { id:"pdf6", title:"Accountancy — Final Accounts Notes",       subject:"Accountancy", cls:"12", chapter:"Financial Statements",size:"2.9 MB", downloads:98,  date:"2026-03-03" },
];

const INIT_LINKS = [
  { id:"l1", title:"Doubt Discussion",     desc:"Study doubts only",        url:"https://chat.whatsapp.com/KJqJwzLDanR6j70enyaKCt", type:"whatsapp" },
  { id:"l2", title:"Official Community",   desc:"Official discussion space", url:"https://chat.whatsapp.com/D7Hgc3sSj8663X34MZRP2l", type:"whatsapp" },
  { id:"l3", title:"Project 45 — Plan",    desc:"45-day revision challenge", url:"https://chat.whatsapp.com/IweVtAExMNL0nwetN3PJUJ", type:"whatsapp" },
  { id:"l4", title:"Notes Archive",        desc:"All study materials",       url:"https://chat.whatsapp.com/I7M4ST9zGPkKE5hqLRC0y7", type:"whatsapp" },
  { id:"l5", title:"PYQ & Practice",       desc:"Previous year questions",   url:"https://chat.whatsapp.com/BeNHv56uxcc6DpLNSTcFJd", type:"whatsapp" },
  { id:"l6", title:"16-Day Challenge",     desc:"Intensive exam prep",       url:"https://chat.whatsapp.com/JPbqE9cgfWS2s77eBK1y0z", type:"whatsapp" },
  { id:"l7", title:"Telegram Channel",     desc:"Official announcements",    url:"https://t.me/+C0UKYQKjgFc3MGE1",                  type:"telegram" },
  { id:"l8", title:"Google Classroom",     desc:"Official assignments",      url:"https://classroom.google.com/c/Nzg5NjA0NjYwOTU1", type:"google"   },
  { id:"l9", title:"Free Drive Notes",     desc:"PDF notes repository",      url:"https://drive.google.com/drive/folders/1oYl3rzIDFGKcDal0bD_q6I4AiLBQBsQl", type:"drive" },
];

const DAILY_TASKS = {
  PCM:     ["Solve 10 numericals — Electrostatics (Physics)","Read Organic Chemistry Reaction Mechanisms","Practice 5 definite integrals (Maths)","Revise Newton's Laws — write key formulas","Attempt 1 full mock test section"],
  PCB:     ["Revise Human Reproduction chapter (Biology)","Solve 10 Chemistry MCQs from Equilibrium","Study Genetics — Mendelian Laws","Short notes on Photosynthesis process","Attempt 20 Biology MCQs from last year"],
  PCMB:   ["Physics: 5 numericals from Optics","Chemistry: p-Block elements reading","Maths: Derivatives practice sheet","Biology: Revise Biotechnology chapter","Attempt subject-wise mock (1 section each)"],
  Commerce:["Complete Journal Entries worksheet","Read Ch.7 Business Studies","Revise Demand & Supply curves (Economics)","Solve 10 Accountancy past MCQs","Prepare 5-mark answer: Sources of Finance"],
  Arts:    ["Read Chapter on Mughal Empire (History)","Revise Fundamental Rights (Political Sc.)","Draw India's Physical Map (Geography)","Write answer: Functions of Pressure Groups","Revise Economic Development key terms"],
};

const FORMULAS = {
  Physics: [
    { name:"Newton's 2nd Law", formula:"F = ma", desc:"Force equals mass times acceleration" },
    { name:"Kinetic Energy",   formula:"KE = ½mv²", desc:"Energy of motion" },
    { name:"Potential Energy", formula:"PE = mgh", desc:"Gravitational potential energy" },
    { name:"Ohm's Law",        formula:"V = IR", desc:"Voltage = Current × Resistance" },
    { name:"Coulomb's Law",    formula:"F = kq₁q₂/r²", desc:"Electrostatic force between charges" },
    { name:"Wave Speed",       formula:"v = fλ", desc:"Speed = Frequency × Wavelength" },
    { name:"Work Done",        formula:"W = Fs·cosθ", desc:"Work = Force × displacement × cosθ" },
    { name:"Power",            formula:"P = W/t = VI", desc:"Power = Work/Time" },
  ],
  Chemistry: [
    { name:"Ideal Gas Law",    formula:"PV = nRT", desc:"P=pressure, V=volume, n=moles, R=gas const, T=temp" },
    { name:"Molarity",         formula:"M = n/V(L)", desc:"Moles of solute per litre of solution" },
    { name:"pH Formula",       formula:"pH = -log[H⁺]", desc:"Acidity measure from hydrogen ion concentration" },
    { name:"Gibbs Energy",     formula:"ΔG = ΔH - TΔS", desc:"Spontaneity condition: ΔG < 0" },
    { name:"Rate Law",         formula:"r = k[A]ᵐ[B]ⁿ", desc:"Rate depends on concentration and rate constant" },
    { name:"Faraday's 1st",    formula:"m = ZIt", desc:"Mass deposited in electrolysis" },
    { name:"Boyle's Law",      formula:"P₁V₁ = P₂V₂", desc:"Pressure-volume relation at constant T" },
    { name:"Nernst Equation",  formula:"E = E° - (RT/nF)lnQ", desc:"Cell potential under non-standard conditions" },
  ],
  Mathematics: [
    { name:"Quadratic Formula",formula:"x = (-b ± √(b²-4ac)) / 2a", desc:"Roots of ax²+bx+c=0" },
    { name:"Distance Formula", formula:"d = √((x₂-x₁)²+(y₂-y₁)²)", desc:"Distance between two points" },
    { name:"Chain Rule",       formula:"d/dx[f(g(x))] = f'(g(x))·g'(x)", desc:"Derivative of composite functions" },
    { name:"Integration by Parts",formula:"∫u dv = uv - ∫v du", desc:"Integration technique for products" },
    { name:"Binomial Theorem", formula:"(a+b)ⁿ = Σ C(n,r)·aⁿ⁻ʳ·bʳ", desc:"Expansion of binomial powers" },
    { name:"Sine Rule",        formula:"a/sinA = b/sinB = c/sinC", desc:"Relates sides and angles of triangle" },
    { name:"Area of Circle",   formula:"A = πr²", desc:"Area enclosed by circle of radius r" },
    { name:"Limit Definition", formula:"f'(x) = lim(h→0) [f(x+h)-f(x)]/h", desc:"Derivative from first principles" },
  ],
  Biology: [
    { name:"Photosynthesis",   formula:"6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂", desc:"Plants convert light to glucose" },
    { name:"Respiration",      formula:"C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP", desc:"Energy release from glucose" },
    { name:"Hardy-Weinberg",   formula:"p² + 2pq + q² = 1", desc:"Allele frequency in population genetics" },
    { name:"ATP Production",   formula:"Glycolysis: 2 ATP, Krebs: 2 ATP, ETC: 32 ATP", desc:"Total: 36-38 ATP per glucose" },
    { name:"Transpiration",    formula:"SPAC: Soil→Plant→Atm→Continuum", desc:"Water movement in plants" },
    { name:"Mendel's 1st Law", formula:"3:1 ratio in F2 generation", desc:"Law of Segregation" },
  ],
};

const FLASHCARDS = [
  { subject:"Physics",    front:"What is Newton's First Law?",                          back:"An object at rest stays at rest, an object in motion stays in motion — unless acted upon by an external net force. (Law of Inertia)" },
  { subject:"Chemistry",  front:"What is the difference between Ionic and Covalent bonds?", back:"Ionic: electron transfer between metals & non-metals (NaCl). Covalent: electron sharing between non-metals (H₂O). Ionic bonds are stronger in crystal lattice." },
  { subject:"Mathematics",front:"What is the derivative of sin(x)?",                    back:"d/dx[sin(x)] = cos(x). Derivative of cos(x) = -sin(x). Derivative of tan(x) = sec²(x)." },
  { subject:"Physics",    front:"Define Electric Field. What is its SI unit?",           back:"Electric Field E = F/q (force per unit positive charge). SI unit: N/C or V/m. Direction: away from +ve charge, towards -ve charge." },
  { subject:"Biology",    front:"What happens in the S phase of cell cycle?",            back:"S phase (Synthesis phase) — DNA replication occurs. Each chromosome duplicates to form sister chromatids. DNA content doubles (2N → 4N)." },
  { subject:"Chemistry",  front:"What is Le Chatelier's Principle?",                    back:"If a system in equilibrium is disturbed, it shifts to counteract the disturbance and reach a new equilibrium. Used to predict effects of T, P, concentration changes." },
  { subject:"Mathematics",front:"State the Fundamental Theorem of Calculus",             back:"Part 1: If F(x) = ∫ₐˣ f(t)dt, then F'(x) = f(x). Part 2: ∫ₐᵇ f(x)dx = F(b) - F(a), where F is any antiderivative of f." },
  { subject:"Biology",    front:"Difference between Mitosis and Meiosis?",               back:"Mitosis: 1 division, 2 daughter cells, same chromosome number (2N), for growth/repair. Meiosis: 2 divisions, 4 daughter cells, half chromosomes (N), for gametes." },
  { subject:"Physics",    front:"What is Snell's Law of Refraction?",                   back:"n₁ sin θ₁ = n₂ sin θ₂. Light bends when entering a different medium. n = refractive index = c/v = speed of light in vacuum / speed in medium." },
  { subject:"Chemistry",  front:"What is Hess's Law?",                                   back:"The total enthalpy change of a reaction is the same regardless of the route taken. ΔH(overall) = ΔH₁ + ΔH₂ + ΔH₃..." },
];

const BADGES_DEF = [
  { id:"streak7",   icon:"🔥", name:"7-Day Streak",   desc:"Study 7 days in a row",        cond:(u,stats)=> u.streak >= 7   },
  { id:"streak30",  icon:"🌟", name:"30-Day Streak",  desc:"Study 30 days in a row",       cond:(u,stats)=> u.streak >= 30  },
  { id:"perfect",   icon:"💯", name:"Perfect Score",  desc:"Score 100% in a mock test",    cond:(u,stats)=> stats.perfect   },
  { id:"quizmaster",icon:"🏆", name:"Quiz Master",    desc:"Complete 10 mock tests",        cond:(u,stats)=> stats.tests>=10 },
  { id:"curious",   icon:"💡", name:"Curious Mind",   desc:"Ask 5 AI questions",           cond:(u,stats)=> stats.aiqs>=5   },
  { id:"bookworm",  icon:"📚", name:"Bookworm",       desc:"Download 5 PDFs",              cond:(u,stats)=> stats.pdls>=5   },
  { id:"helpful",   icon:"💬", name:"Helpful Peer",   desc:"Get 10 likes on community",    cond:(u,stats)=> stats.likes>=10 },
  { id:"topfive",   icon:"⚡", name:"Top 5",          desc:"Reach top 5 on leaderboard",   cond:(u,stats)=> stats.rank<=5   },
];

// ── HELPERS ────────────────────────────────────────────────────────────────────
const G = `@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');*{font-family:'Plus Jakarta Sans',sans-serif;}.pp{font-family:'Poppins',sans-serif;}`;

function Av({ user, size=36 }) {
  if (!user) return null;
  return <div style={{width:size,height:size,borderRadius:"50%",background:user.color||"#F97316",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:"#fff",fontSize:size*0.36,flexShrink:0}}>{user.avatar||user.name?.slice(0,2).toUpperCase()}</div>;
}

function Pill({ text, color="orange" }) {
  const cls = { orange:"bg-orange-50 text-orange-700 border-orange-200", blue:"bg-blue-50 text-blue-700 border-blue-200", green:"bg-green-50 text-green-700 border-green-200", purple:"bg-purple-50 text-purple-700 border-purple-200", red:"bg-red-50 text-red-700 border-red-200", gray:"bg-gray-100 text-gray-600 border-gray-200" };
  return <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${cls[color]||cls.orange}`}>{text}</span>;
}

function Card({ children, className="" }) {
  return <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${className}`}>{children}</div>;
}

function SectionHead({ title, sub, action, onAction }) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div><h2 className="pp font-black text-stone-800 text-xl">{title}</h2>{sub && <p className="text-gray-500 text-sm mt-0.5">{sub}</p>}</div>
      {action && <button onClick={onAction} className="text-xs text-orange-500 font-bold hover:underline">{action}</button>}
    </div>
  );
}

function Timer({ title, target, color }) {
  const [t, setT] = useState({ d:0, h:0, m:0, s:0 });
  useEffect(() => {
    const tick = () => { const diff = new Date(target)-new Date(); if(diff<=0)return; setT({ d:Math.floor(diff/86400000), h:Math.floor((diff%86400000)/3600000), m:Math.floor((diff%3600000)/60000), s:Math.floor((diff%60000)/1000) }); };
    tick(); const id = setInterval(tick,1000); return ()=>clearInterval(id);
  },[target]);
  const palettes = { orange:{bg:"from-orange-500 to-amber-400",ring:"ring-orange-200",text:"text-orange-700",light:"bg-orange-50"}, blue:{bg:"from-blue-500 to-sky-400",ring:"ring-blue-200",text:"text-blue-700",light:"bg-blue-50"}, purple:{bg:"from-violet-500 to-purple-400",ring:"ring-purple-200",text:"text-purple-700",light:"bg-purple-50"} };
  const p = palettes[color]||palettes.orange;
  return (
    <div className={`${p.light} rounded-2xl p-4 ring-1 ${p.ring}`}>
      <p className={`text-xs font-black uppercase tracking-widest ${p.text} mb-3`}>{title}</p>
      <div className="flex gap-2">
        {[["d","Days"],["h","Hrs"],["m","Min"],["s","Sec"]].map(([k,l])=>(
          <div key={k} className="flex-1 text-center">
            <div className={`bg-gradient-to-b ${p.bg} text-white rounded-xl py-2 font-black text-xl leading-none mb-1`}>{String(t[k]).padStart(2,"0")}</div>
            <p className="text-xs text-gray-500 font-semibold">{l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── AUTH ───────────────────────────────────────────────────────────────────────
function Auth({ users, setUsers, onLogin }) {
  const [tab, setTab] = useState("in");
  const [f, setF] = useState({ name:"", email:"", pass:"", confirm:"", stream:"PCM", cls:"12" });
  const [err, setErr] = useState(""); const [show, setShow] = useState(false);
  const COLORS=["#8B5CF6","#10B981","#F59E0B","#EF4444","#06B6D4","#EC4899"];

  const signIn=()=>{ setErr(""); const u=users.find(x=>x.email.toLowerCase()===f.email.toLowerCase()&&x.password===f.pass); if(!u) return setErr("Invalid email or password."); onLogin(u); };
  const signUp=()=>{ setErr(""); if(!f.name.trim()) return setErr("Enter your full name."); if(!f.email.includes("@")) return setErr("Enter a valid email."); if(f.pass.length<6) return setErr("Password must be at least 6 characters."); if(f.pass!==f.confirm) return setErr("Passwords do not match."); if(users.find(x=>x.email.toLowerCase()===f.email.toLowerCase())) return setErr("Email already registered."); const nu={id:"u"+Date.now(),name:f.name,email:f.email,password:f.pass,role:"student",stream:f.stream,cls:f.cls,points:0,avatar:f.name.slice(0,2).toUpperCase(),color:COLORS[Math.floor(Math.random()*COLORS.length)],streak:0,badges:[]}; setUsers(p=>[...p,nu]); onLogin(nu); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <style>{G}</style>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-400 to-amber-500 shadow-2xl shadow-orange-200 mb-4 text-4xl">📚</div>
          <h1 className="pp text-2xl font-black text-stone-800">Board Exam Preparation</h1>
          <p className="text-stone-500 text-sm mt-1">Stay disciplined. Stay focused. Stay consistent.</p>
        </div>
        <div className="bg-white rounded-3xl shadow-2xl shadow-orange-100 overflow-hidden border border-orange-100">
          <div className="flex border-b border-gray-100">
            {[["in","Sign In"],["up","Sign Up"]].map(([id,l])=>(
              <button key={id} onClick={()=>{setTab(id);setErr("");}} className={`flex-1 py-4 text-sm font-bold transition-all ${tab===id?"text-orange-600 border-b-2 border-orange-500 bg-orange-50":"text-gray-400 hover:text-gray-600"}`}>{l}</button>
            ))}
          </div>
          <div className="p-6 space-y-4">
            {tab==="up"&&<div><label className="text-xs font-black text-gray-500 uppercase tracking-wider">Full Name</label><input value={f.name} onChange={e=>setF(p=>({...p,name:e.target.value}))} placeholder="Your full name" className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm bg-gray-50"/></div>}
            <div><label className="text-xs font-black text-gray-500 uppercase tracking-wider">Email</label><input value={f.email} onChange={e=>setF(p=>({...p,email:e.target.value}))} type="email" placeholder="your@email.com" className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm bg-gray-50"/></div>
            <div><label className="text-xs font-black text-gray-500 uppercase tracking-wider">Password</label>
              <div className="relative mt-1"><input value={f.pass} onChange={e=>setF(p=>({...p,pass:e.target.value}))} type={show?"text":"password"} placeholder={tab==="up"?"Create password (min 6)":"Your password"} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 outline-none text-sm bg-gray-50 pr-12"/>
                <button onClick={()=>setShow(p=>!p)} className="absolute right-3 top-3 text-gray-400 text-lg">{show?"🙈":"👁"}</button></div></div>
            {tab==="up"&&<>
              <div><label className="text-xs font-black text-gray-500 uppercase tracking-wider">Confirm Password</label><input value={f.confirm} onChange={e=>setF(p=>({...p,confirm:e.target.value}))} type="password" placeholder="Re-enter password" className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 outline-none text-sm bg-gray-50"/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-black text-gray-500 uppercase tracking-wider">Stream</label>
                  <select value={f.stream} onChange={e=>setF(p=>({...p,stream:e.target.value}))} className="w-full mt-1 px-3 py-3 rounded-xl border border-gray-200 focus:border-orange-400 outline-none text-sm bg-gray-50">
                    <option value="PCM">🔬 PCM (JEE)</option><option value="PCB">🧬 PCB (NEET)</option><option value="PCMB">⚗️ PCMB</option><option value="Commerce">💼 Commerce</option><option value="Arts">🎨 Arts</option>
                  </select></div>
                <div><label className="text-xs font-black text-gray-500 uppercase tracking-wider">Class</label>
                  <select value={f.cls} onChange={e=>setF(p=>({...p,cls:e.target.value}))} className="w-full mt-1 px-3 py-3 rounded-xl border border-gray-200 focus:border-orange-400 outline-none text-sm bg-gray-50">
                    <option value="11">Class 11</option><option value="12">Class 12</option>
                  </select></div>
              </div>
            </>}
            {err&&<div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2"><span>⚠️</span>{err}</div>}
            <button onClick={tab==="in"?signIn:signUp} className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black rounded-xl shadow-lg shadow-orange-200 hover:shadow-xl transition-all text-sm">{tab==="in"?"Sign In →":"Create Account →"}</button>
            {tab==="in"&&<div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700 space-y-1"><p className="font-black">Demo Accounts:</p><p>👩 priya@gmail.com / priya123 (Student)</p><p>👑 dk2649367@gmail.com / Dhirendra245789101112A (Admin)</p></div>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SIDEBAR ────────────────────────────────────────────────────────────────────
function Sidebar({ page, setPage, user, onLogout }) {
  const isAdmin = user?.role==="admin";
  const nav = [
    {id:"dashboard",  icon:"🏠", label:"Dashboard"},
    {id:"study",      icon:"📄", label:"Study Material"},
    {id:"questions",  icon:"📝", label:"Board Questions"},
    {id:"mocktest",   icon:"📊", label:"Mock Tests"},
    {id:"flashcards", icon:"🃏", label:"Flashcards"},
    {id:"formulas",   icon:"📐", label:"Formula Sheet"},
    {id:"notes",      icon:"📔", label:"My Notes"},
    {id:"planner",    icon:"📅", label:"Study Planner"},
    {id:"ai",         icon:"🤖", label:"AI Assistant"},
    {id:"community",  icon:"💬", label:"Community"},
    {id:"leaderboard",icon:"🏆", label:"Leaderboard"},
    {id:"profile",    icon:"👤", label:"My Profile"},
    {id:"links",      icon:"📌", label:"Official Links"},
    ...(isAdmin?[{id:"admin",icon:"⚙️",label:"Admin Panel"}]:[]),
  ];
  return (
    <div className="w-60 bg-white h-screen flex flex-col border-r border-gray-100 shadow-lg flex-shrink-0">
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-xl shadow">📚</div>
          <div><p className="pp font-black text-stone-800 text-sm leading-tight">Board Exam</p><p className="pp font-black text-orange-500 text-sm leading-tight">Preparation</p></div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {nav.map(item=>(
          <button key={item.id} onClick={()=>setPage(item.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${page===item.id?"bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-200":"text-gray-500 hover:bg-orange-50 hover:text-orange-600"}`}>
            <span className="text-base w-5 text-center">{item.icon}</span><span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <Av user={user} size={36}/><div className="flex-1 min-w-0"><p className="font-bold text-stone-800 text-sm truncate">{user?.name}</p><p className="text-xs text-gray-400">{user?.stream}·{user?.cls}</p></div>
        </div>
        <button onClick={onLogout} className="w-full py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-all">Sign Out</button>
      </div>
    </div>
  );
}

function TopBar({ title, user, notices, setPage }) {
  const [search, setSearch] = useState(""); const [open, setOpen] = useState(false);
  const urgentCount = notices.filter(n=>n.priority==="urgent").length;
  return (
    <div className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0 gap-4">
      <h2 className="pp font-black text-stone-800 text-lg flex-shrink-0">{title}</h2>
      <div className="flex-1 max-w-xs relative">
        <input value={search} onChange={e=>{setSearch(e.target.value);setOpen(!!e.target.value);}} onBlur={()=>setTimeout(()=>setOpen(false),200)} placeholder="🔍 Search anything..." className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none"/>
        {open&&search&&(
          <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
            {[{label:"📝 Board Questions",page:"questions"},{label:"📄 Study Material",page:"study"},{label:"🃏 Flashcards",page:"flashcards"},{label:"📐 Formula Sheet",page:"formulas"},{label:"💬 Community",page:"community"}].map(r=>(
              <button key={r.page} onMouseDown={()=>setPage(r.page)} className="w-full text-left px-4 py-2.5 text-sm hover:bg-orange-50 hover:text-orange-600 font-medium transition-all">{r.label}</button>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <button className="w-9 h-9 rounded-xl bg-orange-50 hover:bg-orange-100 flex items-center justify-center text-lg transition-all">🔔</button>
          {urgentCount>0&&<span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{urgentCount}</span>}
        </div>
        <button onClick={()=>setPage("profile")} className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded-xl transition-all">
          <Av user={user} size={34}/><div className="hidden md:block text-left"><p className="text-sm font-bold text-stone-800 leading-tight">{user?.name?.split(" ")[0]}</p><p className="text-xs text-gray-400">{user?.role==="admin"?"👑 Admin":`${user?.stream}`}</p></div>
        </button>
      </div>
    </div>
  );
}

// ── DASHBOARD ──────────────────────────────────────────────────────────────────
function Dashboard({ user, notices, posts, pdfs, users, questions, setPage }) {
  const tasks = DAILY_TASKS[user.stream]||DAILY_TASKS.PCM;
  const [done, setDone] = useState([]);
  const urgent = notices.find(n=>n.priority==="urgent");
  const lb = [...users].filter(u=>u.role==="student").sort((a,b)=>b.points-a.points).slice(0,5);
  const todayQ = questions[new Date().getDate() % questions.length];

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Hero */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-6 text-white relative overflow-hidden">
        <div className="absolute right-4 top-0 opacity-10 text-[120px] leading-none">📚</div>
        <p className="text-orange-100 text-sm font-semibold">Welcome back,</p>
        <h2 className="pp text-2xl font-black mt-0.5">{user.name}! 👋</h2>
        <p className="text-orange-100 text-sm mt-1">{user.stream} · Class {user.cls} · {user.points} pts · 🔥 {user.streak}-day streak</p>
        <div className="flex gap-2 mt-4">
          {["Take Mock Test→|mocktest","Ask AI 🤖|ai","Flashcards 🃏|flashcards","Formulas 📐|formulas"].map(x=>{const[l,p]=x.split("|");return<button key={p} onClick={()=>setPage(p)} className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3 py-2 rounded-xl backdrop-blur transition-all">{l}</button>;})}
        </div>
      </div>

      {/* Urgent Notice */}
      {urgent&&<div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">📢</span>
        <div className="flex-1"><p className="font-black text-red-700 text-sm">{urgent.title}</p><p className="text-red-600 text-xs mt-1 line-clamp-2">{urgent.body}</p></div>
        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg flex-shrink-0">URGENT</span>
      </div>}

      {/* Timers */}
      <div>
        <h3 className="pp font-black text-stone-800 mb-3">⏰ Exam Countdowns</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Timer title="Class 11 Boards" target="2026-03-20" color="blue"/>
          <Timer title="Class 12 Boards" target="2026-02-15" color="orange"/>
          <Timer title="JEE 2028" target="2028-04-10" color="purple"/>
        </div>
      </div>

      {/* Question of Day */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-5 text-white">
        <p className="text-indigo-200 text-xs font-black uppercase tracking-widest mb-2">💡 Question of the Day</p>
        <p className="font-bold text-sm mb-1">{todayQ?.subject} — {todayQ?.chapter}</p>
        <p className="text-white/90 text-sm leading-relaxed">{todayQ?.question}</p>
        <button onClick={()=>setPage("questions")} className="mt-3 bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all backdrop-blur">Practice Similar Questions →</button>
      </div>

      {/* 3-col grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Daily Tasks */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="pp font-black text-stone-800 text-sm">📅 Today's Tasks</p>
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">{done.length}/{tasks.length}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4"><div className="bg-gradient-to-r from-orange-400 to-amber-400 h-1.5 rounded-full transition-all" style={{width:`${(done.length/tasks.length)*100}%`}}/></div>
          <div className="space-y-2">
            {tasks.map((t,i)=>(
              <label key={i} className="flex items-start gap-2.5 cursor-pointer group">
                <input type="checkbox" checked={done.includes(i)} onChange={()=>setDone(p=>p.includes(i)?p.filter(x=>x!==i):[...p,i])} className="mt-0.5 accent-orange-500 w-4 h-4 flex-shrink-0"/>
                <span className={`text-xs leading-relaxed transition-all ${done.includes(i)?"line-through text-gray-400":"text-gray-700 group-hover:text-orange-600"}`}>{t}</span>
              </label>
            ))}
          </div>
          {done.length===tasks.length&&<div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-2 text-center text-green-700 text-xs font-bold">🏆 Daily Goal Achieved! +50 pts</div>}
        </Card>

        {/* Latest PDFs */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3"><p className="pp font-black text-stone-800 text-sm">📄 Latest PDFs</p><button onClick={()=>setPage("study")} className="text-xs text-orange-500 font-bold hover:underline">View All</button></div>
          <div className="space-y-2.5">
            {pdfs.slice(0,5).map(p=>(
              <div key={p.id} className="flex items-center gap-3 hover:bg-orange-50 p-1.5 -mx-1.5 rounded-xl transition-all cursor-pointer group">
                <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">📕</div>
                <div className="flex-1 min-w-0"><p className="text-xs font-bold text-stone-800 truncate">{p.title}</p><p className="text-xs text-gray-400">{p.subject} · {p.size}</p></div>
                <span className="text-orange-400 group-hover:translate-x-1 transition-transform">›</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Leaderboard */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3"><p className="pp font-black text-stone-800 text-sm">🏆 Leaderboard</p><button onClick={()=>setPage("leaderboard")} className="text-xs text-orange-500 font-bold hover:underline">Full Board</button></div>
          <div className="space-y-3">
            {lb.map((u,i)=>(
              <div key={u.id} className="flex items-center gap-2.5">
                <span className={`text-sm w-6 text-center font-black ${i===0?"text-yellow-500":i===1?"text-gray-400":i===2?"text-amber-600":"text-gray-400"}`}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":`#${i+1}`}</span>
                <Av user={u} size={28}/>
                <div className="flex-1 min-w-0"><p className="text-xs font-bold text-stone-800 truncate">{u.name}</p><p className="text-xs text-gray-400">{u.stream}</p></div>
                <span className="text-xs font-black text-orange-600">{u.points.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Latest Posts */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4"><p className="pp font-black text-stone-800">💬 Latest Community Posts</p><button onClick={()=>setPage("community")} className="text-xs text-orange-500 font-bold hover:underline">View All</button></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {posts.slice(0,3).map(post=>{
            const au=users.find(u=>u.id===post.userId);
            return <div key={post.id} onClick={()=>setPage("community")} className="border border-gray-100 rounded-xl p-4 hover:border-orange-200 cursor-pointer transition-all">
              <div className="flex items-center gap-2 mb-2"><Av user={au} size={26}/><div><p className="text-xs font-bold">{au?.name}</p><p className="text-xs text-gray-400">{post.time}</p></div></div>
              <p className="text-xs text-gray-600 line-clamp-2">{post.content}</p>
              <div className="flex gap-3 mt-2"><span className="text-xs text-gray-400">❤️ {post.likes.length}</span><span className="text-xs text-gray-400">💬 {post.replies.length}</span></div>
            </div>;
          })}
        </div>
      </Card>

      {/* Quick feature cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[{icon:"🃏",title:"Flashcards",sub:"Quick revision cards",p:"flashcards",bg:"from-purple-500 to-indigo-500"},
          {icon:"📐",title:"Formula Sheet",sub:"All key formulas",p:"formulas",bg:"from-teal-500 to-cyan-500"},
          {icon:"📔",title:"My Notes",sub:"Personal study notes",p:"notes",bg:"from-pink-500 to-rose-500"},
          {icon:"📅",title:"Study Planner",sub:"Plan your week",p:"planner",bg:"from-emerald-500 to-green-500"},
        ].map(item=>(
          <button key={item.p} onClick={()=>setPage(item.p)} className={`bg-gradient-to-br ${item.bg} rounded-2xl p-4 text-white text-left hover:shadow-lg transition-all hover:scale-105`}>
            <span className="text-3xl block mb-2">{item.icon}</span>
            <p className="font-black text-sm">{item.title}</p>
            <p className="text-white/70 text-xs mt-0.5">{item.sub}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── FLASHCARDS ─────────────────────────────────────────────────────────────────
function Flashcards() {
  const subjects = ["All",...new Set(FLASHCARDS.map(c=>c.subject))];
  const [filter, setFilter] = useState("All");
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState([]);
  const [review, setReview] = useState([]);

  const cards = FLASHCARDS.filter(c=>filter==="All"||c.subject===filter);
  const card = cards[idx%cards.length];
  const pct = cards.length>0?Math.round((known.filter(i=>cards.findIndex(c=>c.front===FLASHCARDS[i]?.front)>=0).length/cards.length)*100):0;

  const next=(mark)=>{
    if(mark==="know") setKnown(p=>[...new Set([...p,FLASHCARDS.indexOf(card)])]);
    else setReview(p=>[...new Set([...p,FLASHCARDS.indexOf(card)])]);
    setFlipped(false); setTimeout(()=>setIdx(p=>(p+1)%cards.length),120);
  };
  const reset=()=>{ setKnown([]); setReview([]); setIdx(0); setFlipped(false); };

  const subjectColors={Physics:"from-blue-500 to-sky-400",Chemistry:"from-green-500 to-emerald-400",Mathematics:"from-purple-500 to-violet-400",Biology:"from-teal-500 to-cyan-400",default:"from-orange-500 to-amber-400"};
  const gc=subjectColors[card?.subject]||subjectColors.default;

  return (
    <div className="p-6 h-full overflow-y-auto">
      <SectionHead title="🃏 Flashcards" sub="Flip to reveal answers — test your memory!" />
      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {subjects.map(s=><button key={s} onClick={()=>{setFilter(s);setIdx(0);setFlipped(false);}} className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${filter===s?"bg-orange-500 text-white":"bg-white border border-gray-200 text-gray-600 hover:border-orange-300"}`}>{s}</button>)}
      </div>

      {/* Stats bar */}
      <div className="flex gap-4 mb-6">
        {[["📚 Total",cards.length,"stone-800"],["✅ Know",known.length,"green-600"],["🔁 Review",review.length,"orange-600"],["📈 Progress",pct+"%","purple-600"]].map(([l,v,c])=>(
          <Card key={l} className="flex-1 p-3 text-center"><p className={`text-xl font-black text-${c}`}>{v}</p><p className="text-xs text-gray-500 mt-0.5">{l}</p></Card>
        ))}
        <button onClick={reset} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold rounded-xl transition-all">Reset</button>
      </div>

      {/* Card */}
      <div className="max-w-lg mx-auto">
        <div className="relative h-64 cursor-pointer" onClick={()=>setFlipped(p=>!p)} style={{perspective:"1000px"}}>
          <div style={{transition:"transform 0.5s",transformStyle:"preserve-3d",transform:flipped?"rotateY(180deg)":"rotateY(0deg)",height:"100%",position:"relative"}}>
            {/* Front */}
            <div style={{backfaceVisibility:"hidden",position:"absolute",inset:0}} className={`bg-gradient-to-br ${gc} rounded-3xl p-8 flex flex-col items-center justify-center text-white shadow-2xl`}>
              <Pill text={card?.subject} color="orange"/>
              <p className="text-center font-black text-lg mt-4 leading-snug">{card?.front}</p>
              <p className="text-white/60 text-xs mt-6">Click to flip 👆</p>
            </div>
            {/* Back */}
            <div style={{backfaceVisibility:"hidden",transform:"rotateY(180deg)",position:"absolute",inset:0}} className="bg-white rounded-3xl p-8 flex flex-col items-center justify-center border-2 border-orange-200 shadow-2xl">
              <p className="text-orange-500 font-black text-xs uppercase tracking-widest mb-3">Answer</p>
              <p className="text-center text-stone-800 text-sm leading-relaxed font-semibold">{card?.back}</p>
            </div>
          </div>
        </div>
        {/* Actions */}
        {flipped&&(
          <div className="flex gap-3 mt-4">
            <button onClick={()=>next("review")} className="flex-1 py-3 bg-red-100 hover:bg-red-200 text-red-700 font-black rounded-2xl transition-all text-sm">🔁 Need Review</button>
            <button onClick={()=>next("know")} className="flex-1 py-3 bg-green-100 hover:bg-green-200 text-green-700 font-black rounded-2xl transition-all text-sm">✅ I Know This</button>
          </div>
        )}
        {!flipped&&(
          <div className="flex gap-3 mt-4">
            <button onClick={()=>{setFlipped(false);setIdx(p=>p===0?cards.length-1:p-1);}} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-2xl text-sm">‹ Previous</button>
            <span className="flex-1 flex items-center justify-center text-sm font-bold text-gray-500">{(idx%cards.length)+1} / {cards.length}</span>
            <button onClick={()=>{setFlipped(false);setIdx(p=>(p+1)%cards.length);}} className="flex-1 py-3 bg-orange-100 hover:bg-orange-200 text-orange-600 font-bold rounded-2xl text-sm">Next ›</button>
          </div>
        )}
      </div>

      {/* All cards list */}
      <div className="mt-8">
        <h3 className="pp font-black text-stone-800 mb-4">All Cards ({cards.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {cards.map((c,i)=>{
            const gi=FLASHCARDS.indexOf(c);
            return <div key={i} className={`border rounded-xl p-4 cursor-pointer transition-all ${known.includes(gi)?"border-green-300 bg-green-50":review.includes(gi)?"border-orange-300 bg-orange-50":"border-gray-100 bg-white hover:border-orange-200"}`} onClick={()=>{setIdx(i);setFlipped(false);window.scrollTo(0,0);}}>
              <div className="flex items-center gap-2 mb-1"><Pill text={c.subject} color="blue"/>{known.includes(gi)&&<span className="text-xs text-green-600 font-bold">✅ Known</span>}{review.includes(gi)&&<span className="text-xs text-orange-600 font-bold">🔁 Review</span>}</div>
              <p className="text-sm font-bold text-stone-800">{c.front}</p>
            </div>;
          })}
        </div>
      </div>
    </div>
  );
}

// ── FORMULA SHEET ──────────────────────────────────────────────────────────────
function FormulaSheet() {
  const [sub, setSub] = useState("Physics");
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState("");
  const subjects = Object.keys(FORMULAS);
  const formulas = FORMULAS[sub]?.filter(f=>!search||f.name.toLowerCase().includes(search.toLowerCase())||f.formula.toLowerCase().includes(search.toLowerCase())) || [];
  const copy=(text)=>{ navigator.clipboard?.writeText(text).catch(()=>{}); setCopied(text); setTimeout(()=>setCopied(""),2000); };
  const subColors={Physics:"bg-blue-500",Chemistry:"bg-green-500",Mathematics:"bg-purple-500",Biology:"bg-teal-500"};

  return (
    <div className="p-6 h-full overflow-y-auto">
      <SectionHead title="📐 Formula Sheet" sub="All important formulas at a glance" />
      <div className="flex flex-wrap gap-3 mb-5 items-center">
        <div className="flex gap-2">{subjects.map(s=><button key={s} onClick={()=>setSub(s)} className={`text-xs px-3 py-2 rounded-xl font-bold transition-all ${sub===s?"text-white "+subColors[s]:"bg-white border border-gray-200 text-gray-600 hover:border-orange-300"}`}>{s}</button>)}</div>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search formulas..." className="flex-1 min-w-[180px] px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-400 outline-none"/>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {formulas.map((f,i)=>(
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-orange-200 transition-all group">
            <div className="flex items-start justify-between mb-2">
              <p className="font-black text-stone-800 text-sm">{f.name}</p>
              <button onClick={()=>copy(f.formula)} className="text-xs text-gray-400 hover:text-orange-500 transition-all opacity-0 group-hover:opacity-100 font-semibold">
                {copied===f.formula?"✅ Copied":"📋 Copy"}
              </button>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-xl p-3 mb-2">
              <p className="text-orange-700 font-black text-base text-center tracking-wide">{f.formula}</p>
            </div>
            <p className="text-xs text-gray-500">{f.desc}</p>
          </div>
        ))}
      </div>
      {formulas.length===0&&<div className="text-center py-16 text-gray-400"><div className="text-5xl mb-3">🔍</div><p className="font-semibold">No formulas found</p></div>}
    </div>
  );
}

// ── MY NOTES ──────────────────────────────────────────────────────────────────
function MyNotes({ user }) {
  const key = `notes_${user.id}`;
  const [notes, setNotes] = useState(()=>{ try{ return JSON.parse(localStorage.getItem(key)||"[]"); }catch{return [];} });
  const [active, setActive] = useState(null);
  const [form, setForm] = useState({ title:"", subject:"Physics", content:"" });
  const [editing, setEditing] = useState(false);
  const save=(n)=>{ const updated=editing?notes.map(x=>x.id===n.id?n:x):[...notes,n]; setNotes(updated); try{localStorage.setItem(key,JSON.stringify(updated));}catch{} };
  const del=(id)=>{ const updated=notes.filter(x=>x.id!==id); setNotes(updated); try{localStorage.setItem(key,JSON.stringify(updated));}catch{}; if(active?.id===id)setActive(null); };
  const subjectColors={Physics:"bg-blue-100 text-blue-700",Chemistry:"bg-green-100 text-green-700",Mathematics:"bg-purple-100 text-purple-700",Biology:"bg-teal-100 text-teal-700",default:"bg-gray-100 text-gray-600"};
  const subjects=["Physics","Chemistry","Mathematics","Biology","Accountancy","History","Economics","General"];

  return (
    <div className="p-6 h-full overflow-y-auto">
      <SectionHead title="📔 My Notes" sub="Write and save your personal study notes"/>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Sidebar list */}
        <div className="space-y-3">
          <button onClick={()=>{setForm({title:"",subject:"Physics",content:""});setEditing(false);setActive("new");}} className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl text-sm transition-all">✏️ New Note</button>
          {notes.length===0&&<div className="text-center py-8 text-gray-400"><p className="text-4xl mb-2">📝</p><p className="text-sm font-semibold">No notes yet</p><p className="text-xs mt-1">Create your first note!</p></div>}
          {notes.map(n=>(
            <div key={n.id} onClick={()=>{setActive(n);setForm(n);setEditing(true);}} className={`cursor-pointer rounded-xl p-4 border-2 transition-all ${active?.id===n.id?"border-orange-400 bg-orange-50":"border-gray-100 bg-white hover:border-orange-200"}`}>
              <div className="flex items-start justify-between mb-1">
                <p className="font-black text-stone-800 text-sm leading-snug flex-1 pr-2">{n.title||"Untitled"}</p>
                <button onClick={e=>{e.stopPropagation();del(n.id);}} className="text-red-400 hover:text-red-600 text-xs">🗑</button>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${subjectColors[n.subject]||subjectColors.default}`}>{n.subject}</span>
              <p className="text-xs text-gray-500 mt-2 line-clamp-2">{n.content||"Empty note..."}</p>
              <p className="text-xs text-gray-400 mt-1">{n.date}</p>
            </div>
          ))}
        </div>
        {/* Editor */}
        <div className="lg:col-span-2">
          {active?(
            <Card className="p-5 h-full flex flex-col min-h-[500px]">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="Note title..." className="px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 outline-none text-sm font-bold bg-gray-50"/>
                <select value={form.subject} onChange={e=>setForm(p=>({...p,subject:e.target.value}))} className="px-3 py-3 rounded-xl border border-gray-200 focus:border-orange-400 outline-none text-sm bg-gray-50">
                  {subjects.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <textarea value={form.content} onChange={e=>setForm(p=>({...p,content:e.target.value}))} placeholder="Start writing your notes here...&#10;&#10;Tip: Use this space to write formulas, important points, chapter summaries, or your own explanations." rows={16} className="flex-1 p-4 rounded-xl border border-gray-200 focus:border-orange-400 outline-none text-sm resize-none bg-gray-50 leading-relaxed"/>
              <div className="flex gap-3 mt-4">
                <button onClick={()=>setActive(null)} className="px-4 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all">Cancel</button>
                <button onClick={()=>{const n={...form,id:editing?form.id:"n"+Date.now(),date:new Date().toLocaleDateString("en-IN")};save(n);setActive(n);}} className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl text-sm transition-all">💾 Save Note</button>
              </div>
            </Card>
          ):(
            <div className="flex items-center justify-center h-full min-h-[400px] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <div className="text-center text-gray-400">
                <p className="text-6xl mb-3">📔</p>
                <p className="font-black text-stone-600 text-lg">Your Notes</p>
                <p className="text-sm mt-1">Select a note or create a new one</p>
                <button onClick={()=>{setForm({title:"",subject:"Physics",content:""});setEditing(false);setActive("new");}} className="mt-4 px-5 py-2.5 bg-orange-500 text-white font-bold rounded-xl text-sm hover:bg-orange-600 transition-all">✏️ New Note</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── STUDY PLANNER ─────────────────────────────────────────────────────────────
function StudyPlanner({ user }) {
  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const slots = ["6:00 AM","7:00 AM","8:00 AM","9:00 AM","10:00 AM","11:00 AM","12:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM","7:00 PM","8:00 PM","9:00 PM","10:00 PM"];
  const subjectsForStream = { PCM:["Physics","Chemistry","Mathematics","English"], PCB:["Physics","Chemistry","Biology","English"], PCMB:["Physics","Chemistry","Mathematics","Biology"], Commerce:["Accountancy","Business Studies","Economics","English"], Arts:["History","Political Science","Geography","English"] };
  const mySubjects = subjectsForStream[user.stream]||["Physics","Chemistry","Mathematics"];
  const subColors = ["bg-blue-200 text-blue-800","bg-green-200 text-green-800","bg-purple-200 text-purple-800","bg-orange-200 text-orange-800","bg-pink-200 text-pink-800","bg-teal-200 text-teal-800"];
  const subColorMap = Object.fromEntries(mySubjects.map((s,i)=>[s,subColors[i%subColors.length]]));

  const [plan, setPlan] = useState(()=>{
    const p={};
    days.forEach(d=>{ p[d]={}; slots.forEach(s=>{ p[d][s]=""; }); });
    p["Monday"]["7:00 AM"]="Physics"; p["Monday"]["9:00 AM"]="Chemistry"; p["Monday"]["7:00 PM"]="Mathematics";
    p["Tuesday"]["8:00 AM"]="Mathematics"; p["Tuesday"]["4:00 PM"]="Physics"; p["Tuesday"]["8:00 PM"]="Chemistry";
    p["Wednesday"]["7:00 AM"]="Chemistry"; p["Wednesday"]["9:00 AM"]="Mathematics"; p["Wednesday"]["7:00 PM"]="Physics";
    p["Thursday"]["8:00 AM"]="Physics"; p["Thursday"]["4:00 PM"]="Chemistry"; p["Thursday"]["8:00 PM"]="Mathematics";
    p["Friday"]["7:00 AM"]="Mathematics"; p["Friday"]["9:00 AM"]="Physics"; p["Friday"]["7:00 PM"]="Chemistry";
    p["Saturday"]["8:00 AM"]="Revision"; p["Saturday"]["10:00 AM"]="Mock Test"; p["Saturday"]["3:00 PM"]="Revision";
    return p;
  });
  const [selected, setSelected] = useState({ day:"Monday", slot:"", sub:"" });
  const [showModal, setShowModal] = useState(false);

  const totalSlots = Object.values(plan).reduce((a,d)=>a+Object.values(d).filter(v=>v).length,0);
  const subjectHours = mySubjects.reduce((acc,s)=>{ acc[s]=Object.values(plan).reduce((a,d)=>a+Object.values(d).filter(v=>v===s).length,0); return acc; },{});

  return (
    <div className="p-6 h-full overflow-y-auto">
      <SectionHead title="📅 Study Planner" sub="Plan your weekly study schedule"/>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 text-center"><p className="text-2xl font-black text-orange-600">{totalSlots}</p><p className="text-xs text-gray-500 mt-1">Planned Sessions</p></Card>
        {mySubjects.slice(0,3).map(s=><Card key={s} className="p-4 text-center"><p className="text-2xl font-black text-stone-800">{subjectHours[s]||0}</p><p className="text-xs text-gray-500 mt-1">{s} hrs</p></Card>)}
      </div>
      {/* Subject legend */}
      <div className="flex flex-wrap gap-2 mb-4">
        {mySubjects.map(s=><span key={s} className={`text-xs font-bold px-3 py-1 rounded-full ${subColorMap[s]}`}>{s}</span>)}
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-200 text-gray-700">Revision / Mock</span>
        <button onClick={()=>setPlan(p=>{const n={...p};days.forEach(d=>{slots.forEach(s=>{n[d]={...n[d],[s]:""};});});return n;})} className="text-xs font-bold px-3 py-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-all">Clear All</button>
      </div>
      {/* Grid */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[700px]">
          <thead>
            <tr><th className="p-2 text-xs font-black text-gray-500 w-20 text-left">Time</th>
              {days.map(d=><th key={d} className="p-2 text-xs font-black text-gray-500 text-center">{d.slice(0,3)}</th>)}
            </tr>
          </thead>
          <tbody>
            {slots.map(slot=>(
              <tr key={slot} className="border-t border-gray-50">
                <td className="p-1.5 text-xs text-gray-400 font-semibold">{slot}</td>
                {days.map(day=>{
                  const val=plan[day]?.[slot]||"";
                  return <td key={day} className="p-1">
                    <button onClick={()=>{setSelected({day,slot,sub:val});setShowModal(true);}} className={`w-full h-8 rounded-lg text-xs font-bold transition-all hover:opacity-80 ${val?(subColorMap[val]||"bg-gray-200 text-gray-700"):"bg-gray-50 hover:bg-orange-50 border border-dashed border-gray-200 hover:border-orange-300 text-gray-300 hover:text-orange-400"}`}>
                      {val||"+"}
                    </button>
                  </td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal */}
      {showModal&&(
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="pp font-black text-stone-800 mb-1">{selected.day} — {selected.slot}</h3>
            <p className="text-xs text-gray-500 mb-4">Select a subject for this slot</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[...mySubjects,"Revision","Mock Test","Break",""].map(s=>(
                <button key={s||"clear"} onClick={()=>{setPlan(p=>({...p,[selected.day]:{...p[selected.day],[selected.slot]:s}}));setShowModal(false);}} className={`py-2.5 rounded-xl text-xs font-bold transition-all ${s?(subColorMap[s]||"bg-gray-100 text-gray-700 hover:bg-gray-200"):"bg-red-50 text-red-600 hover:bg-red-100"}`}>{s||"❌ Clear Slot"}</button>
              ))}
            </div>
            <button onClick={()=>setShowModal(false)} className="w-full py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-xl transition-all font-semibold">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── PROFILE PAGE ──────────────────────────────────────────────────────────────
function Profile({ user, users, setUsers }) {
  const ranked = [...users].filter(u=>u.role==="student").sort((a,b)=>b.points-a.points);
  const rank = ranked.findIndex(u=>u.id===user.id)+1;
  const allBadges = BADGES_DEF;
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const stats = { perfect:false, tests:2, aiqs:3, pdls:2, likes:user.points>1000?12:3, rank };
  const earned = allBadges.filter(b=>b.cond(user,stats));

  const saveName=()=>{ setUsers(p=>p.map(u=>u.id===user.id?{...u,name}:u)); setEditing(false); };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <SectionHead title="👤 My Profile"/>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — profile card */}
        <div className="space-y-4">
          <Card className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div style={{width:80,height:80,borderRadius:"50%",background:user.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,fontWeight:800,color:"#fff",boxShadow:"0 8px 24px rgba(0,0,0,0.15)"}}>{user.avatar}</div>
            </div>
            {editing?(
              <div className="space-y-2">
                <input value={name} onChange={e=>setName(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm text-center font-bold outline-none focus:border-orange-400"/>
                <div className="flex gap-2"><button onClick={()=>setEditing(false)} className="flex-1 py-1.5 text-xs font-bold text-gray-500 border border-gray-200 rounded-lg">Cancel</button><button onClick={saveName} className="flex-1 py-1.5 text-xs font-bold text-white bg-orange-500 rounded-lg hover:bg-orange-600">Save</button></div>
              </div>
            ):(
              <div>
                <h3 className="pp font-black text-stone-800 text-xl">{user.name}</h3>
                <button onClick={()=>setEditing(true)} className="text-xs text-orange-500 hover:underline font-semibold mt-1">Edit name ✏️</button>
              </div>
            )}
            <p className="text-gray-500 text-sm mt-2">{user.email}</p>
            <div className="flex justify-center gap-2 mt-3 flex-wrap">
              <Pill text={user.stream} color="orange"/><Pill text={`Class ${user.cls}`} color="blue"/>
              {user.role==="admin"&&<Pill text="👑 Admin" color="purple"/>}
            </div>
          </Card>

          {/* Stats */}
          <Card className="p-5">
            <p className="pp font-black text-stone-800 mb-4">📊 My Stats</p>
            {[["🏆 Rank",`#${rank} of ${ranked.length}`],["⭐ Points",user.points.toLocaleString()],["🔥 Streak",`${user.streak} days`],["📝 Stream",user.stream],["🎓 Class",`Class ${user.cls}`]].map(([l,v])=>(
              <div key={l} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-600">{l}</span>
                <span className="text-sm font-black text-stone-800">{v}</span>
              </div>
            ))}
          </Card>
        </div>

        {/* Right */}
        <div className="lg:col-span-2 space-y-5">
          {/* Badges */}
          <Card className="p-5">
            <p className="pp font-black text-stone-800 mb-4">🏅 Badges & Achievements</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {allBadges.map(b=>{
                const has=earned.find(e=>e.id===b.id);
                return <div key={b.id} className={`rounded-xl p-3 text-center border-2 transition-all ${has?"border-orange-300 bg-orange-50":"border-gray-100 opacity-50 grayscale"}`}>
                  <div className="text-3xl mb-1">{b.icon}</div>
                  <p className="text-xs font-black text-stone-800">{b.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{b.desc}</p>
                  {has&&<span className="text-xs text-green-600 font-bold mt-1 block">✅ Earned</span>}
                </div>;
              })}
            </div>
          </Card>

          {/* Progress by subject */}
          <Card className="p-5">
            <p className="pp font-black text-stone-800 mb-4">📈 Subject Progress</p>
            {[["Physics",72],["Chemistry",58],["Mathematics",85],["Biology",45],["English",90]].map(([s,pct])=>(
              <div key={s} className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold text-stone-700">{s}</span>
                  <span className="text-sm font-black text-orange-600">{pct}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full transition-all ${pct>=80?"bg-green-500":pct>=60?"bg-orange-500":"bg-red-400"}`} style={{width:`${pct}%`}}/>
                </div>
              </div>
            ))}
          </Card>

          {/* Weak areas */}
          <Card className="p-5">
            <p className="pp font-black text-stone-800 mb-1">🎯 Weak Areas to Improve</p>
            <p className="text-xs text-gray-500 mb-4">Based on your quiz and practice performance</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[["Biology","Animal Kingdom",42],["Chemistry","Thermodynamics",48],["Physics","Optics",55],["Mathematics","3D Geometry",50]].map(([sub,ch,pct])=>(
                <div key={ch} className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-xl flex-shrink-0">⚠️</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-stone-800">{sub} — {ch}</p>
                    <div className="w-full bg-red-200 rounded-full h-1.5 mt-1.5"><div className="bg-red-500 h-1.5 rounded-full" style={{width:`${pct}%`}}/></div>
                    <p className="text-xs text-red-600 font-semibold mt-0.5">{pct}% accuracy</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── STUDY MATERIAL ─────────────────────────────────────────────────────────────
function StudyMaterial({ pdfs }) {
  const [sub, setSub] = useState("All"); const [cls, setCls] = useState("All");
  const subjects=["All",...new Set(pdfs.map(p=>p.subject))];
  const filtered=pdfs.filter(p=>(sub==="All"||p.subject===sub)&&(cls==="All"||p.cls===cls));
  const colors={Physics:"bg-blue-100 text-blue-700",Chemistry:"bg-green-100 text-green-700",Mathematics:"bg-purple-100 text-purple-700",Biology:"bg-teal-100 text-teal-700",default:"bg-gray-100 text-gray-600"};
  return (
    <div className="p-6 h-full overflow-y-auto">
      <SectionHead title="📄 Study Material" sub="Download notes, formulas, and PYQs"/>
      <div className="flex flex-wrap gap-2 mb-5 bg-white p-3 rounded-2xl border border-gray-100">
        <div className="flex gap-2 flex-wrap">{subjects.map(s=><button key={s} onClick={()=>setSub(s)} className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${sub===s?"bg-orange-500 text-white":"bg-gray-100 text-gray-600 hover:bg-orange-50"}`}>{s}</button>)}</div>
        <div className="flex gap-2 ml-auto">{["All","11","12","JEE"].map(c=><button key={c} onClick={()=>setCls(c)} className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${cls===c?"bg-blue-500 text-white":"bg-gray-100 text-gray-600 hover:bg-blue-50"}`}>{c}</button>)}</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p=>(
          <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:border-orange-200 transition-all group">
            <div className="flex items-start justify-between mb-3"><div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-2xl">📕</div><span className={`text-xs font-bold px-2 py-1 rounded-lg ${colors[p.subject]||colors.default}`}>{p.subject}</span></div>
            <h4 className="font-black text-stone-800 text-sm mb-1 leading-snug">{p.title}</h4>
            <p className="text-xs text-gray-400 mb-3">{p.chapter} · Class {p.cls} · {p.size}</p>
            <div className="flex items-center justify-between"><span className="text-xs text-gray-400">⬇️ {p.downloads}</span><button className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm">Download PDF</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── BOARD QUESTIONS ────────────────────────────────────────────────────────────
function BoardQuestions({ questions }) {
  const [f, setF] = useState({ sub:"All", cls:"All", diff:"All" });
  const [sel, setSel] = useState({}); const [rev, setRev] = useState({});
  const [bm, setBm] = useState([]);
  const subjects=["All",...new Set(questions.map(q=>q.subject))];
  const filtered=questions.filter(q=>(f.sub==="All"||q.subject===f.sub)&&(f.cls==="All"||q.cls===f.cls)&&(f.diff==="All"||q.difficulty===f.diff));
  return (
    <div className="p-6 h-full overflow-y-auto">
      <SectionHead title="📝 Board Questions" sub="Practice CBSE board exam questions"/>
      <div className="bg-white rounded-2xl border border-gray-100 p-3 mb-5 flex flex-wrap gap-2">
        <div className="flex gap-1.5 flex-wrap">{subjects.map(s=><button key={s} onClick={()=>setF(p=>({...p,sub:s}))} className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${f.sub===s?"bg-orange-500 text-white":"bg-gray-100 text-gray-600 hover:bg-orange-50"}`}>{s}</button>)}</div>
        <div className="flex gap-1.5 ml-auto flex-wrap">
          {["All","11","12"].map(c=><button key={c} onClick={()=>setF(p=>({...p,cls:c}))} className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${f.cls===c?"bg-blue-500 text-white":"bg-gray-100 hover:bg-blue-50 text-gray-600"}`}>Class {c}</button>)}
          {["All","Easy","Medium","Hard"].map(d=><button key={d} onClick={()=>setF(p=>({...p,diff:d}))} className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${f.diff===d?"bg-purple-500 text-white":"bg-gray-100 hover:bg-purple-50 text-gray-600"}`}>{d}</button>)}
        </div>
      </div>
      {bm.length>0&&<div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-xs text-amber-700 font-semibold">🔖 {bm.length} bookmarked question{bm.length>1?"s":""}</div>}
      <div className="space-y-4">
        {filtered.map((q,qi)=>(
          <div key={q.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex gap-2 flex-wrap"><Pill text={q.subject} color="orange"/><Pill text={q.chapter} color="blue"/><Pill text={`Cl.${q.cls}`} color="green"/><span className={`text-xs px-2 py-0.5 rounded-full font-bold ${q.difficulty==="Easy"?"bg-green-100 text-green-700":q.difficulty==="Medium"?"bg-yellow-100 text-yellow-700":"bg-red-100 text-red-700"}`}>{q.difficulty}</span></div>
              <button onClick={()=>setBm(p=>p.includes(q.id)?p.filter(x=>x!==q.id):[...p,q.id])} className={`text-lg ml-2 transition-all ${bm.includes(q.id)?"text-orange-500":"text-gray-300 hover:text-orange-400"}`}>🔖</button>
            </div>
            <p className="font-bold text-stone-800 text-sm mb-4 leading-relaxed">Q{qi+1}. {q.question}</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {q.options.map((opt,oi)=>{const isSel=sel[q.id]===oi;const isRev=rev[q.id];const isCorr=oi===q.correct;let cls="bg-gray-50 border border-gray-200 text-gray-700 hover:bg-orange-50 hover:border-orange-200";if(isRev){if(isCorr)cls="bg-green-50 border-2 border-green-500 text-green-700";else if(isSel)cls="bg-red-50 border-2 border-red-400 text-red-700";}else if(isSel)cls="bg-orange-50 border-2 border-orange-500 text-orange-700";return<button key={oi} disabled={!!isRev} onClick={()=>setSel(p=>({...p,[q.id]:oi}))} className={`text-xs p-3 rounded-xl font-semibold text-left transition-all ${cls}`}><span className="font-black mr-1">{String.fromCharCode(65+oi)}.</span>{opt}{isRev&&isCorr&&" ✅"}{isRev&&isSel&&!isCorr&&" ❌"}</button>;})}
            </div>
            {!rev[q.id]&&<button onClick={()=>setRev(p=>({...p,[q.id]:true}))} className="bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-orange-600 transition-all">Show Answer</button>}
            {rev[q.id]&&<div className="bg-green-50 border border-green-200 rounded-xl p-3"><p className="text-xs font-bold text-green-700">✅ Explanation:</p><p className="text-xs text-green-600 mt-1">{q.explanation}</p></div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── COMMUNITY ─────────────────────────────────────────────────────────────────
function Community({ posts, setPosts, users, me }) {
  const [text, setText] = useState(""); const [rText, setRText] = useState({}); const [open, setOpen] = useState({});
  const post=()=>{ if(!text.trim()) return; setPosts(p=>[{id:"p"+Date.now(),userId:me.id,content:text,likes:[],tags:[],time:"just now",replies:[]}, ...p]); setText(""); };
  const like=(pid)=>setPosts(prev=>prev.map(p=>p.id===pid?{...p,likes:p.likes.includes(me.id)?p.likes.filter(x=>x!==me.id):[...p.likes,me.id]}:p));
  const reply=(pid)=>{ const t=rText[pid]?.trim(); if(!t) return; setPosts(prev=>prev.map(p=>p.id===pid?{...p,replies:[...p.replies,{id:"r"+Date.now(),userId:me.id,content:t,likes:[],time:"just now"}]}:p)); setRText(p=>({...p,[pid]:""})); };
  return (
    <div className="p-6 h-full overflow-y-auto">
      <SectionHead title="💬 Community" sub="Ask doubts, share notes, motivate peers"/>
      <Card className="p-5 mb-5">
        <div className="flex items-start gap-3"><Av user={me} size={40}/>
          <div className="flex-1">
            <textarea value={text} onChange={e=>setText(e.target.value)} placeholder={`Share something, ${me.name.split(" ")[0]}...`} rows={3} className="w-full p-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm resize-none bg-gray-50"/>
            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-2">{["#Doubt","#Notes","#Tips","#Motivation"].map(tag=><button key={tag} onClick={()=>setText(p=>p+" "+tag)} className="text-xs text-orange-500 bg-orange-50 hover:bg-orange-100 px-2 py-1 rounded-lg font-semibold transition-all">{tag}</button>)}</div>
              <button onClick={post} disabled={!text.trim()} className="bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white text-sm font-bold px-5 py-2 rounded-xl transition-all">Post</button>
            </div>
          </div>
        </div>
      </Card>
      <div className="space-y-4">
        {posts.map(p=>{
          const au=users.find(u=>u.id===p.userId); const liked=p.likes.includes(me.id);
          return <Card key={p.id} className="p-5">
            <div className="flex items-start gap-3"><Av user={au} size={42}/>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap"><span className="font-black text-stone-800 text-sm">{au?.name}</span>{au?.role==="admin"&&<span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">👑 Admin</span>}<Pill text={au?.stream||""} color="gray"/><span className="text-xs text-gray-400">{p.time}</span></div>
                <p className="text-gray-700 text-sm mt-2 leading-relaxed">{p.content}</p>
                <div className="flex gap-1 mt-1 flex-wrap">{p.tags.map(t=><span key={t} className="text-xs text-orange-500 font-semibold">{t}</span>)}</div>
                <div className="flex items-center gap-4 mt-3">
                  <button onClick={()=>like(p.id)} className={`flex items-center gap-1.5 text-xs font-bold transition-all ${liked?"text-red-500":"text-gray-400 hover:text-red-400"}`}>{liked?"❤️":"🤍"} {p.likes.length}</button>
                  <button onClick={()=>setOpen(x=>({...x,[p.id]:!x[p.id]}))} className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-orange-500 transition-all">💬 {p.replies.length} {open[p.id]?"▲":"▼"}</button>
                </div>
                {open[p.id]&&<div className="mt-4 pl-4 border-l-2 border-orange-100 space-y-3">
                  {p.replies.map(r=>{ const ra=users.find(u=>u.id===r.userId); return <div key={r.id} className="flex items-start gap-2"><Av user={ra} size={28}/><div className="flex-1 bg-gray-50 rounded-xl p-3"><div className="flex items-center gap-2"><span className="text-xs font-black">{ra?.name}</span><span className="text-xs text-gray-400">{r.time}</span></div><p className="text-xs text-gray-700 mt-1">{r.content}</p></div></div>; })}
                  <div className="flex items-center gap-2 pt-1"><Av user={me} size={28}/><input value={rText[p.id]||""} onChange={e=>setRText(x=>({...x,[p.id]:e.target.value}))} placeholder="Write a reply..." className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-xl focus:border-orange-400 outline-none" onKeyDown={e=>e.key==="Enter"&&reply(p.id)}/><button onClick={()=>reply(p.id)} className="bg-orange-500 text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-orange-600 transition-all">Send</button></div>
                </div>}
              </div>
            </div>
          </Card>;
        })}
      </div>
    </div>
  );
}

// ── LEADERBOARD ────────────────────────────────────────────────────────────────
function Leaderboard({ users, me }) {
  const ranked=[...users].filter(u=>u.role==="student").sort((a,b)=>b.points-a.points);
  const myRank=ranked.findIndex(u=>u.id===me.id)+1;
  return (
    <div className="p-6 h-full overflow-y-auto">
      <SectionHead title="🏆 Leaderboard" sub="Top students ranked by performance points"/>
      {me.role!=="admin"&&<div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-5 text-white mb-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-black">#{myRank}</div>
        <div><p className="text-orange-100 text-xs">Your Current Rank</p><p className="pp font-black text-xl">{me.name}</p><p className="text-orange-100 text-sm">{me.points.toLocaleString()} pts · 🔥 {me.streak}-day streak</p></div>
      </div>}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {ranked.slice(0,3).map((u,i)=>(
          <Card key={u.id} className={`p-4 text-center border-2 ${i===0?"border-yellow-400 shadow-yellow-100 shadow-lg":i===1?"border-gray-300":"border-amber-400"}`}>
            <div className="text-3xl mb-2">{["🥇","🥈","🥉"][i]}</div>
            <div className="flex justify-center mb-2"><Av user={u} size={44}/></div>
            <p className="font-black text-xs">{u.name.split(" ")[0]}</p>
            <p className="text-gray-400 text-xs">{u.stream}</p>
            <p className={`font-black text-sm mt-1 ${i===0?"text-yellow-500":i===1?"text-gray-500":"text-amber-600"}`}>{u.points.toLocaleString()}</p>
            <div className="flex justify-center gap-1 mt-1">{u.badges?.slice(0,3).map((b,bi)=><span key={bi} className="text-sm">{b}</span>)}</div>
          </Card>
        ))}
      </div>
      <Card className="overflow-hidden">
        <div className="grid grid-cols-12 px-5 py-3 bg-gray-50 border-b border-gray-100">
          {["#","Student","Stream","Pts","Streak","Badges"].map(h=><span key={h} className="col-span-2 text-xs font-black text-gray-500">{h}</span>)}
        </div>
        {ranked.map((u,i)=>(
          <div key={u.id} className={`grid grid-cols-12 px-5 py-4 border-b border-gray-50 hover:bg-orange-50 transition-all items-center ${u.id===me.id?"bg-orange-50 border-l-4 border-l-orange-500":""}`}>
            <span className={`col-span-2 font-black text-sm ${i<3?"text-yellow-500":"text-gray-400"}`}>{i<3?["🥇","🥈","🥉"][i]:`#${i+1}`}</span>
            <div className="col-span-2 flex items-center gap-2"><Av user={u} size={28}/><span className="text-xs font-bold text-stone-800 truncate">{u.name.split(" ")[0]}{u.id===me.id&&<span className="text-orange-400"> (You)</span>}</span></div>
            <span className="col-span-2 text-xs text-gray-500">{u.stream}</span>
            <span className="col-span-2 text-sm font-black text-orange-600">{u.points.toLocaleString()}</span>
            <span className="col-span-2 text-xs text-gray-600">🔥 {u.streak}d</span>
            <div className="col-span-2 flex gap-0.5">{u.badges?.slice(0,3).map((b,bi)=><span key={bi} className="text-base">{b}</span>)}</div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ── MOCK TEST ──────────────────────────────────────────────────────────────────
function MockTest({ questions, me }) {
  const [phase, setPhase] = useState("list");
  const [answers, setAnswers] = useState({});
  const [cur, setCur] = useState(0);
  const [time, setTime] = useState(30*60);
  const [marked, setMarked] = useState([]);
  const testQ = questions.slice(0,8);

  useEffect(()=>{ if(phase!=="exam") return; const t=setInterval(()=>setTime(p=>{ if(p<=1){setPhase("result");return 0;} return p-1; }),1000); return()=>clearInterval(t); },[phase]);

  const mins=Math.floor(time/60), secs=time%60;
  const score=testQ.filter(q=>answers[q.id]===q.correct).length;
  const pct=Math.round((score/testQ.length)*100);

  if(phase==="list") return (
    <div className="p-6 h-full overflow-y-auto">
      <SectionHead title="📊 Mock Tests" sub="Practice with timed exam simulation"/>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[{t:"Physics Chapter Test",s:"Electrostatics + Current Electricity",q:8,tm:30,d:"Medium",c:"12"},
          {t:"Chemistry Full Syllabus",s:"Class 12 All Chapters",q:30,tm:60,d:"Hard",c:"12"},
          {t:"JEE Mini Mock — PCM",s:"JEE Main Pattern",q:20,tm:40,d:"Hard",c:"JEE"},
          {t:"Class 11 Maths Test",s:"Limits, Derivatives & Trig",q:15,tm:35,d:"Medium",c:"11"},
        ].map((x,i)=>(
          <Card key={i} className="p-5 hover:shadow-lg hover:border-orange-200 border border-gray-100 transition-all">
            <div className="flex items-start justify-between mb-3"><div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-2xl">📝</div><span className={`text-xs font-bold px-2 py-1 rounded-lg ${x.d==="Hard"?"bg-red-100 text-red-700":"bg-yellow-100 text-yellow-700"}`}>{x.d}</span></div>
            <h4 className="font-black text-stone-800 mb-1">{x.t}</h4>
            <p className="text-xs text-gray-500 mb-3">{x.s}</p>
            <div className="flex gap-3 text-xs text-gray-500 mb-4"><span>📋 {x.q} Qs</span><span>⏱ {x.tm}m</span><span>🎓 Class {x.c}</span></div>
            <button onClick={()=>{setAnswers({});setCur(0);setTime(30*60);setMarked([]);setPhase("exam");}} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl transition-all text-sm">Start Test →</button>
          </Card>
        ))}
      </div>
    </div>
  );

  if(phase==="exam"){
    const q=testQ[cur];
    return (
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 p-4 mb-4">
          <div><p className="text-xs text-gray-500 font-semibold">Q {cur+1}/{testQ.length}</p><div className="w-40 bg-gray-100 rounded-full h-1.5 mt-1"><div className="bg-orange-500 h-1.5 rounded-full" style={{width:`${((cur+1)/testQ.length)*100}%`}}/></div></div>
          <div className={`text-2xl font-black pp ${time<300?"text-red-500":"text-orange-500"}`}>⏱ {String(mins).padStart(2,"0")}:{String(secs).padStart(2,"0")}</div>
          <button onClick={()=>setPhase("result")} className="text-xs bg-red-100 text-red-600 font-bold px-4 py-2 rounded-xl hover:bg-red-200 transition-all">Submit</button>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {testQ.map((_,i)=><button key={i} onClick={()=>setCur(i)} className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${i===cur?"bg-orange-500 text-white":answers[testQ[i].id]!==undefined?"bg-green-500 text-white":marked.includes(i)?"bg-yellow-400 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{i+1}</button>)}
        </div>
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 p-6 overflow-y-auto">
          <div className="flex gap-2 mb-4 flex-wrap"><Pill text={q.subject} color="orange"/><Pill text={q.chapter} color="blue"/><Pill text={q.difficulty} color="purple"/></div>
          <p className="font-bold text-stone-800 text-base mb-6 leading-relaxed">{q.question}</p>
          <div className="grid grid-cols-2 gap-3">
            {q.options.map((opt,oi)=>(
              <button key={oi} onClick={()=>setAnswers(p=>({...p,[q.id]:oi}))} className={`p-4 rounded-xl text-sm font-semibold text-left transition-all border-2 ${answers[q.id]===oi?"border-orange-500 bg-orange-50 text-orange-700":"border-gray-200 bg-gray-50 hover:border-orange-300 text-gray-700"}`}>
                <span className="font-black mr-2">{String.fromCharCode(65+oi)}.</span>{opt}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between mt-6">
            <button onClick={()=>setMarked(p=>p.includes(cur)?p.filter(x=>x!==cur):[...p,cur])} className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${marked.includes(cur)?"bg-yellow-100 text-yellow-700":"bg-gray-100 text-gray-600 hover:bg-yellow-50"}`}>🔖 Mark for Review</button>
            <div className="flex gap-2">
              {cur>0&&<button onClick={()=>setCur(p=>p-1)} className="text-xs font-bold px-4 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all">‹ Prev</button>}
              {cur<testQ.length-1?<button onClick={()=>setCur(p=>p+1)} className="text-xs font-bold px-4 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition-all">Next ›</button>
                :<button onClick={()=>setPhase("result")} className="text-xs font-bold px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-all">Submit ✓</button>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <div className={`rounded-3xl p-8 text-center text-white mb-6 ${pct>=70?"bg-gradient-to-br from-green-500 to-emerald-600":"bg-gradient-to-br from-orange-500 to-red-500"}`}>
          <div className="text-6xl mb-3">{pct>=90?"🏆":pct>=70?"✅":"📚"}</div>
          <h2 className="pp text-3xl font-black">{score}/{testQ.length}</h2>
          <p className="text-white/80 text-xl font-bold">{pct}% Score</p>
          {pct>=70&&<div className="mt-4 bg-white/20 rounded-2xl p-3 inline-block"><p className="text-sm font-bold">🏅 Certificate Earned! Saved to your profile.</p></div>}
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[["✅ Correct",score,"text-green-600"],["❌ Wrong",testQ.filter(q=>answers[q.id]!==undefined&&answers[q.id]!==q.correct).length,"text-red-600"],["⬛ Skipped",testQ.filter(q=>answers[q.id]===undefined).length,"text-gray-500"]].map(([l,v,c])=>(
            <Card key={l} className="p-4 text-center"><p className={`text-2xl font-black ${c}`}>{v}</p><p className="text-xs text-gray-500 mt-1">{l}</p></Card>
          ))}
        </div>
        <div className="space-y-3 mb-6">
          {testQ.map((q,i)=>{ const ua=answers[q.id]; const corr=ua===q.correct; const skip=ua===undefined; return (
            <div key={q.id} className={`bg-white rounded-xl border-2 p-4 ${corr?"border-green-200":skip?"border-gray-200":"border-red-200"}`}>
              <p className="text-xs font-bold text-gray-600 mb-1">Q{i+1}. {q.subject}</p>
              <p className="text-sm font-semibold text-stone-800 mb-2">{q.question}</p>
              {!skip&&<p className={`text-xs font-bold ${corr?"text-green-600":"text-red-600"}`}>Your answer: {q.options[ua]} {corr?"✅":"❌"}</p>}
              {!corr&&<p className="text-xs font-bold text-green-600">Correct: {q.options[q.correct]} ✅</p>}
              <p className="text-xs text-gray-500 mt-1 italic">{q.explanation}</p>
            </div>
          ); })}
        </div>
        <button onClick={()=>setPhase("list")} className="w-full bg-orange-500 text-white font-black py-3 rounded-2xl hover:bg-orange-600 transition-all">← Back to Tests</button>
      </div>
    </div>
  );
}

// ── AI ASSISTANT ──────────────────────────────────────────────────────────────
function AIAssistant({ me }) {
  const [sessions, setSessions] = useState([{id:"s1",title:"New Chat",messages:[]}]);
  const [active, setActive] = useState("s1");
  const [input, setInput] = useState(""); const [loading, setLoading] = useState(false);
  const bottom = useRef(null);
  const sess = sessions.find(s=>s.id===active);
  useEffect(()=>{ bottom.current?.scrollIntoView({behavior:"smooth"}); },[sessions,loading]);

  const send=async()=>{ const text=input.trim(); if(!text||loading) return; setInput(""); const userMsg={role:"user",content:text}; setSessions(prev=>prev.map(s=>s.id===active?{...s,messages:[...s.messages,userMsg],title:s.messages.length===0?text.slice(0,40):s.title}:s)); setLoading(true);
    try {
      const history=[...sess.messages,userMsg];
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:`You are an expert AI tutor for Indian students. Student: ${me.name}, Class ${me.cls}, Stream ${me.stream}. Specialized in CBSE board exams and JEE 2028. Give clear, step-by-step answers. Be encouraging. Format nicely with structure.`,messages:history.map(m=>({role:m.role,content:m.content}))})});
      const data=await res.json(); const aiText=data.content?.[0]?.text||"Sorry, try again.";
      setSessions(prev=>prev.map(s=>s.id===active?{...s,messages:[...s.messages,{role:"assistant",content:aiText}]}:s));
    } catch { setSessions(prev=>prev.map(s=>s.id===active?{...s,messages:[...s.messages,{role:"assistant",content:"⚠️ Connection error. Please try again."}]}:s)); }
    setLoading(false);
  };

  const prompts=["Explain Newton's Laws with examples","What is JEE 2028 Maths syllabus?","Create a 7-day study plan for Chemistry","Solve integration by substitution","Important topics for Class 12 Physics board","Explain photosynthesis step by step"];

  return (
    <div className="flex h-full overflow-hidden">
      <div className="w-52 bg-white border-r border-gray-100 flex flex-col flex-shrink-0">
        <div className="p-3"><button onClick={()=>{const id="s"+Date.now();setSessions(p=>[...p,{id,title:"New Chat",messages:[]}]);setActive(id);}} className="w-full py-2.5 bg-orange-500 text-white text-xs font-black rounded-xl hover:bg-orange-600 transition-all">✏️ New Chat</button></div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sessions.map(s=><button key={s.id} onClick={()=>setActive(s.id)} className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-all truncate ${s.id===active?"bg-orange-100 text-orange-700":"text-gray-600 hover:bg-gray-100"}`}>💬 {s.title}</button>)}
        </div>
        <div className="p-3 border-t border-gray-100"><div className="bg-orange-50 rounded-xl p-3"><p className="text-xs font-black text-orange-700">🤖 AI Tutor</p><p className="text-xs text-orange-600 mt-1">Specialized for JEE & CBSE</p></div></div>
      </div>
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {sess?.messages.length===0&&(
            <div className="text-center pt-6">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-4xl mx-auto mb-4 shadow-xl">🤖</div>
              <h3 className="pp font-black text-stone-800 text-xl">AI Study Assistant</h3>
              <p className="text-gray-500 text-sm mt-2">Ask anything about Class {me.cls} ({me.stream}) or JEE</p>
              <div className="grid grid-cols-2 gap-2 mt-5 max-w-md mx-auto">
                {prompts.map(p=><button key={p} onClick={()=>setInput(p)} className="text-left bg-white border border-gray-200 hover:border-orange-300 hover:bg-orange-50 p-3 rounded-xl text-xs text-gray-700 font-medium transition-all">{p}</button>)}
              </div>
            </div>
          )}
          {sess?.messages.map((msg,i)=>(
            <div key={i} className={`flex ${msg.role==="user"?"justify-end":"justify-start"} items-start gap-3`}>
              {msg.role==="assistant"&&<div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">🤖</div>}
              <div className={`max-w-xl px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role==="user"?"bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-tr-sm":"bg-white text-stone-800 shadow-sm border border-gray-100 rounded-tl-sm"}`} style={{whiteSpace:"pre-wrap"}}>{msg.content}</div>
              {msg.role==="user"&&<Av user={me} size={32}/>}
            </div>
          ))}
          {loading&&<div className="flex items-start gap-3"><div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">🤖</div><div className="bg-white px-4 py-3 rounded-2xl border border-gray-100 shadow-sm"><div className="flex gap-1.5 items-center">{[0,1,2].map(i=><span key={i} style={{animationDelay:`${i*0.15}s`}} className="w-2 h-2 bg-orange-400 rounded-full animate-bounce inline-block"/>)}<span className="text-xs text-gray-400 ml-2">Thinking...</span></div></div></div>}
          <div ref={bottom}/>
        </div>
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="flex items-end gap-3 bg-gray-50 rounded-2xl border border-gray-200 p-3 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
            <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} placeholder="Ask about Physics, Chemistry, Maths, Biology, or JEE..." rows={2} className="flex-1 bg-transparent outline-none text-sm text-stone-800 placeholder-gray-400 resize-none"/>
            <button onClick={send} disabled={!input.trim()||loading} className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-40 text-lg flex-shrink-0">{loading?"⏳":"➤"}</button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">Enter to send · Shift+Enter for new line</p>
        </div>
      </div>
    </div>
  );
}

// ── OFFICIAL LINKS ─────────────────────────────────────────────────────────────
function OfficialLinks({ links }) {
  const icons={whatsapp:{e:"💬",bg:"bg-green-500",l:"WhatsApp"},telegram:{e:"✈️",bg:"bg-blue-500",l:"Telegram"},google:{e:"🎓",bg:"bg-red-500",l:"Google"},drive:{e:"📁",bg:"bg-yellow-500",l:"Drive"}};
  return (
    <div className="p-6 h-full overflow-y-auto">
      <SectionHead title="📌 Official Links" sub="Join our study groups and access resources"/>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map(link=>{ const ico=icons[link.type]||{e:"🔗",bg:"bg-gray-500",l:"Link"}; return (
          <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:border-orange-200 transition-all group flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl ${ico.bg} flex items-center justify-center text-2xl flex-shrink-0 shadow`}>{ico.e}</div>
            <div className="flex-1 min-w-0"><p className="font-black text-stone-800 text-sm group-hover:text-orange-600 transition-colors">{link.title}</p><p className="text-xs text-gray-500 mt-1 mb-3">{link.desc}</p><span className={`text-xs font-bold px-3 py-1 rounded-lg text-white ${ico.bg}`}>{ico.l} →</span></div>
          </a>
        ); })}
      </div>
    </div>
  );
}

// ── ADMIN PANEL ────────────────────────────────────────────────────────────────
function AdminPanel({ users, posts, pdfs, notices, setNotices, questions, setQuestions, links, setLinks, setUsers }) {
  const [sec, setSec] = useState("overview");
  const [nn, setNn] = useState({title:"",body:"",priority:"normal"});
  const [nq, setNq] = useState({subject:"Physics",chapter:"",cls:"12",question:"",options:["","","",""],correct:0,explanation:"",difficulty:"Medium",marks:1});
  const [nl, setNl] = useState({title:"",url:"",desc:"",type:"whatsapp"});
  const students=users.filter(u=>u.role==="student");

  const sideItems=[{id:"overview",icon:"📊",label:"Overview"},{id:"users",icon:"👥",label:"Users"},{id:"notices",icon:"🔔",label:"Notices"},{id:"questions",icon:"📝",label:"Questions"},{id:"links",icon:"📌",label:"Links"}];

  return (
    <div className="flex h-full overflow-hidden">
      <div className="w-44 bg-stone-900 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-stone-800"><p className="text-stone-400 text-xs font-black uppercase tracking-widest">Admin Panel</p></div>
        <nav className="flex-1 p-2 space-y-1">
          {sideItems.map(item=><button key={item.id} onClick={()=>setSec(item.id)} className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${sec===item.id?"bg-orange-500 text-white":"text-stone-400 hover:bg-stone-800 hover:text-white"}`}><span>{item.icon}</span><span>{item.label}</span></button>)}
        </nav>
      </div>
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {sec==="overview"&&(
          <div><h2 className="pp font-black text-stone-800 text-xl mb-6">📊 Platform Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[{l:"Users",v:students.length,i:"👥",c:"bg-orange-500"},{l:"Questions",v:questions.length,i:"📝",c:"bg-blue-500"},{l:"Posts",v:posts.length,i:"💬",c:"bg-green-500"},{l:"PDFs",v:pdfs.length,i:"📄",c:"bg-purple-500"}].map(s=>(
                <Card key={s.l} className="p-5"><div className="flex items-center justify-between mb-3"><span className="text-2xl">{s.i}</span><div className={`w-8 h-8 rounded-lg ${s.c} flex items-center justify-center text-white text-xs font-black`}>↑</div></div><p className="pp text-3xl font-black text-stone-800">{s.v}</p><p className="text-xs text-gray-500 font-semibold mt-1">{s.l}</p></Card>
              ))}
            </div>
            <Card className="p-5"><p className="pp font-black text-stone-800 mb-4">Recent Posts</p><div className="space-y-3">{posts.slice(0,5).map(p=>{ const au=users.find(u=>u.id===p.userId); return <div key={p.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"><Av user={au} size={28}/><p className="text-sm text-gray-700 flex-1"><span className="font-bold">{au?.name}</span>: "{p.content.slice(0,50)}..."</p><span className="text-xs text-gray-400">{p.time}</span></div>; })}</div></Card>
          </div>
        )}
        {sec==="users"&&(
          <div><h2 className="pp font-black text-stone-800 text-xl mb-6">👥 Users ({students.length})</h2>
            <Card className="overflow-hidden"><table className="w-full"><thead className="bg-gray-50 border-b border-gray-100"><tr>{["Name","Email","Stream","Class","Points","Streak"].map(h=><th key={h} className="text-left px-4 py-3 text-xs font-black text-gray-500">{h}</th>)}</tr></thead>
              <tbody>{students.map(u=><tr key={u.id} className="border-b border-gray-50 hover:bg-orange-50 transition-all"><td className="px-4 py-3"><div className="flex items-center gap-2"><Av user={u} size={30}/><span className="text-sm font-bold text-stone-800">{u.name}</span></div></td><td className="px-4 py-3 text-sm text-gray-500">{u.email}</td><td className="px-4 py-3"><Pill text={u.stream} color="orange"/></td><td className="px-4 py-3 text-sm text-gray-600">Class {u.cls}</td><td className="px-4 py-3 text-sm font-black text-orange-600">{u.points.toLocaleString()}</td><td className="px-4 py-3 text-sm text-gray-600">🔥 {u.streak}d</td></tr>)}</tbody>
            </table></Card>
          </div>
        )}
        {sec==="notices"&&(
          <div><h2 className="pp font-black text-stone-800 text-xl mb-6">🔔 Notices</h2>
            <Card className="p-5 mb-5"><h3 className="font-black text-stone-800 mb-4">Post New Notice</h3>
              <div className="space-y-3">
                <input value={nn.title} onChange={e=>setNn(p=>({...p,title:e.target.value}))} placeholder="Notice title..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 outline-none text-sm bg-gray-50"/>
                <textarea value={nn.body} onChange={e=>setNn(p=>({...p,body:e.target.value}))} placeholder="Notice content..." rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 outline-none text-sm bg-gray-50 resize-none"/>
                <div className="flex gap-3">
                  <select value={nn.priority} onChange={e=>setNn(p=>({...p,priority:e.target.value}))} className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 outline-none">{["normal","important","urgent"].map(x=><option key={x}>{x}</option>)}</select>
                  <button onClick={()=>{if(!nn.title||!nn.body) return; setNotices(p=>[{id:"n"+Date.now(),...nn,date:new Date().toLocaleDateString("en-IN")},...p]); setNn({title:"",body:"",priority:"normal"});}} className="bg-orange-500 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-orange-600 transition-all text-sm">Post Notice</button>
                </div>
              </div>
            </Card>
            <div className="space-y-3">{notices.map(n=><div key={n.id} className={`bg-white rounded-2xl border-l-4 p-5 ${n.priority==="urgent"?"border-red-500":n.priority==="important"?"border-orange-400":"border-blue-400"}`}><div className="flex items-start justify-between"><div><span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase ${n.priority==="urgent"?"bg-red-100 text-red-700":n.priority==="important"?"bg-orange-100 text-orange-700":"bg-blue-100 text-blue-700"}`}>{n.priority}</span><h4 className="font-black text-stone-800 mt-2">{n.title}</h4><p className="text-sm text-gray-600 mt-1">{n.body}</p><p className="text-xs text-gray-400 mt-2">{n.date}</p></div><button onClick={()=>setNotices(p=>p.filter(x=>x.id!==n.id))} className="text-red-400 hover:text-red-600 text-lg ml-4">🗑</button></div></div>)}</div>
          </div>
        )}
        {sec==="questions"&&(
          <div><h2 className="pp font-black text-stone-800 text-xl mb-6">📝 Board Questions ({questions.length})</h2>
            <Card className="p-5 mb-5"><h3 className="font-black text-stone-800 mb-4">Add New Question</h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <select value={nq.subject} onChange={e=>setNq(p=>({...p,subject:e.target.value}))} className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 outline-none">{["Physics","Chemistry","Mathematics","Biology","Accountancy","Economics","History","Political Science"].map(s=><option key={s}>{s}</option>)}</select>
                <input value={nq.chapter} onChange={e=>setNq(p=>({...p,chapter:e.target.value}))} placeholder="Chapter name" className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 outline-none focus:border-orange-400"/>
              </div>
              <textarea value={nq.question} onChange={e=>setNq(p=>({...p,question:e.target.value}))} placeholder="Question text..." rows={2} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 outline-none text-sm bg-gray-50 resize-none mb-3"/>
              {nq.options.map((opt,oi)=><div key={oi} className="flex items-center gap-2 mb-2"><input type="radio" checked={nq.correct===oi} onChange={()=>setNq(p=>({...p,correct:oi}))} className="accent-orange-500"/><input value={opt} onChange={e=>{const o=[...nq.options];o[oi]=e.target.value;setNq(p=>({...p,options:o}));}} placeholder={`Option ${String.fromCharCode(65+oi)}`} className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm bg-gray-50 outline-none focus:border-orange-400"/></div>)}
              <textarea value={nq.explanation} onChange={e=>setNq(p=>({...p,explanation:e.target.value}))} placeholder="Explanation..." rows={2} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 outline-none text-sm bg-gray-50 resize-none mb-3 mt-2"/>
              <div className="flex gap-3">
                <select value={nq.cls} onChange={e=>setNq(p=>({...p,cls:e.target.value}))} className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-gray-50 outline-none">{["11","12","JEE"].map(c=><option key={c} value={c}>Class {c}</option>)}</select>
                <select value={nq.difficulty} onChange={e=>setNq(p=>({...p,difficulty:e.target.value}))} className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-gray-50 outline-none">{["Easy","Medium","Hard"].map(d=><option key={d}>{d}</option>)}</select>
                <button onClick={()=>{if(!nq.question||!nq.chapter||nq.options.some(o=>!o)) return; setQuestions(p=>[...p,{...nq,id:"q"+Date.now(),type:"MCQ"}]); setNq({subject:"Physics",chapter:"",cls:"12",question:"",options:["","","",""],correct:0,explanation:"",difficulty:"Medium",marks:1});}} className="bg-orange-500 text-white font-bold px-5 py-2 rounded-xl hover:bg-orange-600 transition-all text-sm">Add Question</button>
              </div>
            </Card>
            <Card className="overflow-hidden"><table className="w-full"><thead className="bg-gray-50 border-b border-gray-100"><tr>{["Subject","Chapter","Class","Diff","Question",""].map(h=><th key={h} className="text-left px-4 py-3 text-xs font-black text-gray-500">{h}</th>)}</tr></thead>
              <tbody>{questions.map(q=><tr key={q.id} className="border-b border-gray-50 hover:bg-orange-50"><td className="px-4 py-3 text-xs font-bold text-orange-700">{q.subject}</td><td className="px-4 py-3 text-xs text-gray-600">{q.chapter}</td><td className="px-4 py-3 text-xs text-gray-500">{q.cls}</td><td className="px-4 py-3 text-xs"><span className={`font-bold ${q.difficulty==="Easy"?"text-green-600":q.difficulty==="Medium"?"text-yellow-600":"text-red-600"}`}>{q.difficulty}</span></td><td className="px-4 py-3 text-xs text-gray-700 max-w-xs truncate">{q.question}</td><td className="px-4 py-3"><button onClick={()=>setQuestions(p=>p.filter(x=>x.id!==q.id))} className="text-red-400 hover:text-red-600">🗑</button></td></tr>)}</tbody>
            </table></Card>
          </div>
        )}
        {sec==="links"&&(
          <div><h2 className="pp font-black text-stone-800 text-xl mb-6">📌 Official Links</h2>
            <Card className="p-5 mb-5"><h3 className="font-black text-stone-800 mb-4">Add New Link</h3>
              <div className="grid grid-cols-2 gap-3">
                <input value={nl.title} onChange={e=>setNl(p=>({...p,title:e.target.value}))} placeholder="Link title" className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 outline-none focus:border-orange-400"/>
                <select value={nl.type} onChange={e=>setNl(p=>({...p,type:e.target.value}))} className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 outline-none">{["whatsapp","telegram","google","drive"].map(t=><option key={t}>{t}</option>)}</select>
                <input value={nl.url} onChange={e=>setNl(p=>({...p,url:e.target.value}))} placeholder="https://..." className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 outline-none focus:border-orange-400 col-span-2"/>
                <input value={nl.desc} onChange={e=>setNl(p=>({...p,desc:e.target.value}))} placeholder="Description" className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 outline-none focus:border-orange-400"/>
                <button onClick={()=>{if(!nl.title||!nl.url) return; setLinks(p=>[...p,{...nl,id:"l"+Date.now()}]); setNl({title:"",url:"",desc:"",type:"whatsapp"});}} className="bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all text-sm">Add Link</button>
              </div>
            </Card>
            <div className="space-y-3">{links.map(link=><div key={link.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4"><div className="text-2xl">{link.type==="whatsapp"?"💬":link.type==="telegram"?"✈️":link.type==="google"?"🎓":"📁"}</div><div className="flex-1 min-w-0"><p className="font-bold text-stone-800 text-sm">{link.title}</p><p className="text-xs text-gray-400 truncate">{link.url}</p></div><button onClick={()=>setLinks(p=>p.filter(x=>x.id!==link.id))} className="text-red-400 hover:text-red-600 text-lg">🗑</button></div>)}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── ROOT ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [users, setUsers]       = useState(INIT_USERS);
  const [me, setMe]             = useState(null);
  const [page, setPage]         = useState("dashboard");
  const [posts, setPosts]       = useState(INIT_POSTS);
  const [notices, setNotices]   = useState(INIT_NOTICES);
  const [questions, setQs]      = useState(INIT_QUESTIONS);
  const [links, setLinks]       = useState(INIT_LINKS);

  const titles = { dashboard:"Dashboard", study:"Study Material", questions:"Board Questions", mocktest:"Mock Tests", flashcards:"Flashcards", formulas:"Formula Sheet", notes:"My Notes", planner:"Study Planner", ai:"AI Assistant", community:"Community", leaderboard:"Leaderboard", profile:"My Profile", links:"Official Links", admin:"Admin Panel" };

  if(!me) return <Auth users={users} setUsers={setUsers} onLogin={u=>{setMe(u);setPage(u.role==="admin"?"admin":"dashboard");}}/>;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <style>{G}</style>
      <Sidebar page={page} setPage={setPage} user={me} onLogout={()=>{setMe(null);setPage("dashboard");}}/>
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title={titles[page]||"Board Exam Preparation"} user={me} notices={notices} setPage={setPage}/>
        <main className="flex-1 overflow-hidden">
          {page==="dashboard"  && <Dashboard user={me} notices={notices} posts={posts} pdfs={INIT_PDFS} users={users} questions={questions} setPage={setPage}/>}
          {page==="study"      && <StudyMaterial pdfs={INIT_PDFS}/>}
          {page==="questions"  && <BoardQuestions questions={questions}/>}
          {page==="mocktest"   && <MockTest questions={questions} me={me}/>}
          {page==="flashcards" && <Flashcards/>}
          {page==="formulas"   && <FormulaSheet/>}
          {page==="notes"      && <MyNotes user={me}/>}
          {page==="planner"    && <StudyPlanner user={me}/>}
          {page==="ai"         && <AIAssistant me={me}/>}
          {page==="community"  && <Community posts={posts} setPosts={setPosts} users={users} me={me}/>}
          {page==="leaderboard"&& <Leaderboard users={users} me={me}/>}
          {page==="profile"    && <Profile user={me} users={users} setUsers={u=>{setUsers(u);setMe(u.find(x=>x.id===me.id)||me);}}/>}
          {page==="links"      && <OfficialLinks links={links}/>}
          {page==="admin"      && <AdminPanel users={users} posts={posts} pdfs={INIT_PDFS} notices={notices} setNotices={setNotices} questions={questions} setQuestions={setQs} links={links} setLinks={setLinks} setUsers={setUsers}/>}
        </main>
      </div>
    </div>
  );
}
