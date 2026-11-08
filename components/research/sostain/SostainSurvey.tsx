"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { businessCategories, challenges, channels, researchSteps, surveyVersion } from "@/lib/research/sostain/questions";
import { researchSurveySchema, type ResearchSurveyInput } from "@/lib/research/sostain/schema";

const options = {
  role: ["Business owner / Founder","Business manager","Sales / Customer service","Finance / Accounts","Operations / Administration","Other"],
  teamSize: ["1","2–5","6–10","11–20","21–50","More than 50"],
  businessAge: ["Less than 6 months","6–12 months","1–3 years","4–7 years","More than 7 years"],
  enquiries: ["0–10","11–30","31–100","101–300","More than 300","Not sure"],
  tracking: ["WhatsApp chat history","Notebook / Paper","Excel / Google Sheets","Dedicated CRM or business software","Staff memory / Verbal communication","Other"],
  missedFollowups: ["Never","Once","2–5 times","6–10 times","More than 10 times","Not sure"],
  recordkeeping: ["Notebook / Paper","Excel / Google Sheets","Accounting software","POS / Banking app","No consistent method","Other"],
  invoices: ["Yes, frequently","Yes, occasionally","No"],
  latePayments: ["Never","Rarely","Sometimes","Frequently","Not applicable"],
  debtTracking: ["Notebook / Paper","Spreadsheet","Accounting / Invoicing software","WhatsApp conversations","No consistent tracking","Not applicable","Other"],
  adminHours: ["Less than 2","2–5","6–10","11–20","More than 20","Not sure"],
  price: ["Less than ₦5,000","₦5,000–₦9,999","₦10,000–₦19,999","₦20,000–₦34,999","₦35,000 or more","Would not pay","Need to see product"],
  followup: ["Yes","Maybe","No"],
  automationInterest: ["Drafting customer replies","Preparing quotations","Recording approved transactions","Summarising sales and expenses","Identifying unpaid invoices","Preparing payment reminders","Business performance summaries","None"],
  concerns: ["Data privacy / Security","Incorrect financial records","AI sending incorrect information","Subscription cost","Complex setup","Losing access to records","Internet connectivity","No major concerns"],
};

type ChoiceKey = keyof typeof options;
const initial: ResearchSurveyInput = {
  surveyVersion, submissionId: "", role: "", category: businessCategories[0], teamSize: "",
  businessAge: "", location: "", enquiries: "", channels: [], tracking: "", missedFollowups: "",
  recordkeeping: "", profitConfidence: 3, invoices: "", latePayments: "", debtTracking: "",
  challenges: [], adminHours: "", paidTools: "", automationInterest: [], concerns: [],
  price: "", followup: "No", contactName: "", contactDetail: "", contactPermission: false,
  privacyAcknowledged: false, website: "", turnstileToken: "",
};

const control = "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100";
const btn = "rounded-xl px-6 py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-40";
const stepsFields: (keyof ResearchSurveyInput)[][] = [
  ["role","category","teamSize","businessAge","location"],
  ["enquiries","channels","tracking","missedFollowups"],
  ["recordkeeping","profitConfidence","invoices","latePayments","debtTracking"],
  ["challenges","adminHours","paidTools"],
  ["automationInterest","concerns","price","followup","contactName","contactDetail","contactPermission","privacyAcknowledged"],
];

export default function SostainSurvey() {
  const router = useRouter();
  const [answers,setAnswers] = useState<ResearchSurveyInput>(initial);
  const [step,setStep] = useState(0);
  const [error,setError] = useState("");
  const [busy,setBusy] = useState(false);

  function set<K extends keyof ResearchSurveyInput>(key: K, value: ResearchSurveyInput[K]) {
    setAnswers(a=>({...a,[key]:value}));
    setError("");
  }
  function toggle(key: "channels"|"challenges"|"automationInterest"|"concerns",value:string) {
    const old = answers[key] as string[];
    const selected = old.includes(value) ? old.filter(v=>v!==value) : [...old,value];
    if (key==="challenges" && selected.length>3) return;
    set(key, selected as ResearchSurveyInput[typeof key]);
  }
  const errors = useMemo(()=>researchSurveySchema.safeParse({...answers,submissionId:"00000000-0000-4000-8000-000000000000"}),[answers]);
  function validateStep() {
    const issues = errors.success ? [] : errors.error.issues.filter(issue=>stepsFields[step].includes(issue.path[0] as keyof ResearchSurveyInput));
    if (issues.length) {
      setError(issues[0].message);
      document.getElementById("survey-errors")?.focus();
      return false;
    }
    return true;
  }
  function next() { if (validateStep()) { setError(""); setStep(s=>Math.min(s+1,4)); window.scrollTo({top:0,behavior:"smooth"}); } }
  function select(name:ChoiceKey,label:string) {
    return (
      <label className="block text-sm font-medium text-slate-800" key={name}>{label}
        <select className={control} value={String(answers[name])} onChange={e=>name==="followup" && e.target.value==="No" ? setAnswers(a=>({...a,followup:"No",contactName:"",contactDetail:"",contactPermission:false})) : set(name,e.target.value as never)} required>
          <option value="">Select an answer</option>
          {options[name].map(x=><option key={x} value={x}>{x}</option>)}
        </select>
      </label>
    );
  }
  function multi(name:"channels"|"challenges"|"automationInterest"|"concerns",label:string, values:readonly string[]) {
    return (
      <fieldset className="space-y-2">
        <legend className="mb-2 text-sm font-semibold text-slate-900">{label}</legend>
        {values.map(value=><label key={value} className="flex items-start gap-3 rounded-lg border border-slate-200 px-3 py-3 text-sm">
          <input type="checkbox" className="mt-1 accent-blue-600" checked={(answers[name] as string[]).includes(value)} onChange={()=>toggle(name,value)}/><span>{value}</span>
        </label>)}
      </fieldset>
    );
  }
  async function submit() {
    if (!validateStep()) return;
    setBusy(true);setError("");
    try {
      const payload={...answers,submissionId: crypto.randomUUID()};
      const response=await fetch("/api/research/sostain/submit",{
        method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)
      });
      const result=await response.json();
      if(!response.ok) throw new Error(result.message || "Unable to submit survey.");
      router.push("/research/sostain/thank-you");
    }catch(e){setError(e instanceof Error ? e.message : "Unable to submit. Please try again.");}
    finally{setBusy(false);}
  }

  return <div className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
    <div className="mb-10">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700">Sostain • Founder-led research</p>
      <h1 className="heading mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Help shape better tools for Nigerian businesses.</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Tell us how you manage customers, sales, finances and payments. This voluntary survey is intended to inform future business technology. No Sostain software product has launched yet.</p>
      <p className="mt-3 text-sm text-slate-500">Approximately 7–10 minutes • No account required • Contact details optional</p>
    </div>
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-9" aria-labelledby="step-title">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-600">Step {step+1} of {researchSteps.length}</p>
        <span className="text-sm text-slate-500">{Math.round((step+1)/researchSteps.length*100)}%</span>
      </div>
      <div className="mb-8 h-2 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
        <div className="h-full rounded-full bg-blue-600 transition-all" style={{width:`${(step+1)*20}%`}}/>
      </div>
      <h2 id="step-title" className="heading mb-6 text-2xl font-semibold">{researchSteps[step].title}</h2>
      <div className="space-y-6">
        {step===0 && <>
          {select("role","Your role in the business")}
          <label className="block text-sm font-medium">Main business category
            <select className={control} value={answers.category} onChange={e=>set("category",e.target.value as ResearchSurveyInput["category"])}>
              {businessCategories.map(c=><option key={c}>{c}</option>)}
            </select>
          </label>
          {select("teamSize","Number of people working in the business")}
          {select("businessAge","How long has it been operating?")}
          <label className="block text-sm font-medium">Primary state or city <input className={control} maxLength={100} value={answers.location} onChange={e=>set("location",e.target.value)} placeholder="e.g. Lagos" required/></label>
        </>}
        {step===1 && <>
          {select("enquiries","Monthly customer enquiries")}
          {multi("channels","Where do customers contact you?",channels)}
          {select("tracking","How do you currently track customer enquiries and orders?")}
          {select("missedFollowups","Missed or delayed follow-ups in the past 30 days")}
        </>}
        {step===2 && <>
          {select("recordkeeping","How are sales and expenses recorded?")}
          <label className="block text-sm font-medium">Confidence in monthly profit accuracy: {answers.profitConfidence}/5
            <input className="mt-4 w-full accent-blue-600" type="range" min={1} max={5} value={answers.profitConfidence} onChange={e=>set("profitConfidence",Number(e.target.value))}/>
          </label>
          {select("invoices","Does your business issue invoices or payment requests?")}
          {select("latePayments","How often do customers pay later than agreed?")}
          {select("debtTracking","How do you track outstanding customer payments?")}
        </>}
        {step===3 && <>
          {multi("challenges","Select your three biggest challenges (maximum 3)",challenges)}
          {select("adminHours","Hours per week spent on repetitive administration")}
          <label className="block text-sm font-medium">Which software do you pay for? (optional)<textarea className={control} rows={3} maxLength={500} value={answers.paidTools} onChange={e=>set("paidTools",e.target.value)}/></label>
        </>}
        {step===4 && <>
          {multi("automationInterest","Which tasks would you consider automating?",options.automationInterest)}
          {multi("concerns","What would concern you about a new business platform?",options.concerns)}
          {select("price","Monthly budget for a tool that reliably solves your biggest problem")}
          {select("followup","Would you consider a follow-up interview?")}
          {answers.followup!=="No" && <>
            <label className="block text-sm font-medium">Your name (optional)<input className={control} value={answers.contactName} maxLength={100} onChange={e=>set("contactName",e.target.value)}/></label>
            <label className="block text-sm font-medium">WhatsApp number or email (optional)<input className={control} maxLength={150} value={answers.contactDetail} onChange={e=>set("contactDetail",e.target.value)}/></label>
            <label className="flex gap-3 text-sm"><input type="checkbox" className="mt-1" checked={answers.contactPermission} onChange={e=>set("contactPermission",e.target.checked)}/><span>I agree to be contacted about a research interview using the details I voluntarily provide. This is not marketing consent.</span></label>
          </>}
          <label className="flex gap-3 text-sm"><input type="checkbox" checked={answers.privacyAcknowledged} onChange={e=>set("privacyAcknowledged",e.target.checked)}/><span>I have read the research information and understand the purpose of this voluntary study. I will not provide confidential third-party information.</span></label>
          <p className="text-sm text-slate-500">Research responses may be analysed in aggregated form. Contact details, if provided, will be kept separately and used only for the agreed follow-up.</p>
        </>}
      </div>
      <input className="hidden" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={answers.website} onChange={e=>set("website",e.target.value)}/>
      <p id="survey-errors" tabIndex={-1} role="alert" className="mt-6 text-sm font-medium text-red-700">{error}</p>
      <div className="mt-7 flex items-center justify-between gap-4">
        <button className={`${btn} border border-slate-300 text-slate-800`} type="button" disabled={step===0 || busy} onClick={()=>{setStep(s=>s-1);setError("");}}>Previous</button>
        {step<4 ?
          <button className={`${btn} bg-blue-600 text-white`} type="button" onClick={next}>Continue</button> :
          <button className={`${btn} bg-blue-600 text-white`} disabled={busy} type="button" onClick={submit}>{busy?"Submitting…":"Submit survey"}</button>
        }
      </div>
    </section>
    <p className="mt-5 text-center text-sm text-slate-500">Research submissions are not yet open. The form will only accept responses after security and data-storage setup has been completed.</p>
  </div>;
}
