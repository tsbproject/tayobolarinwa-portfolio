"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  businessCategories, challenges, channels, researchSteps, surveyVersion, trackingMethods,
} from "@/lib/research/sostain/questions";
import { researchSurveySchema, type ResearchSurveyInput } from "@/lib/research/sostain/schema";

type Answers = Omit<ResearchSurveyInput, "privacyAcknowledged"> & { privacyAcknowledged: boolean };
const initial: Answers = {
  surveyVersion, submissionId: "", category: businessCategories[0], teamSize: "Just me",
  mainChannel: "WhatsApp", tracking: "WhatsApp chats", challenges: [],
  challengeFrequency: "Weekly", price: "Not sure / Need to see it",
  followup: "No", contactName: "", contactDetail: "", contactPermission: false,
  privacyAcknowledged: false, website: "", turnstileToken: "",
};
const fieldClass = "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100";
const buttonClass = "rounded-xl px-6 py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-40";
const requiredByStep: (keyof Answers)[][] = [
  ["category", "teamSize", "mainChannel", "tracking"],
  ["challenges", "challengeFrequency", "price", "followup", "contactPermission", "contactDetail", "privacyAcknowledged"],
];

export default function SostainSurvey() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answers>(initial);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  function set<K extends keyof Answers>(key: K, value: Answers[K]) {
    setAnswers(previous => ({ ...previous, [key]: value }));
    setError("");
  }
  function select<K extends "category"|"teamSize"|"mainChannel"|"tracking"|"challengeFrequency"|"price">(key:K, label:string, choices:readonly string[]) {
    return <label className="block text-sm font-medium text-slate-800">{label}
      <select className={fieldClass} value={answers[key]} onChange={event => set(key,event.target.value as Answers[K])}>
        {choices.map(choice=><option key={choice} value={choice}>{choice}</option>)}
      </select>
    </label>;
  }
  function validateStep() {
    const parsed = researchSurveySchema.safeParse({...answers,submissionId:"00000000-0000-4000-8000-000000000000"});
    if (!parsed.success) {
      const issue = parsed.error.issues.find(item => requiredByStep[step].includes(item.path[0] as keyof Answers));
      if (issue) {
        setError(issue.message);
        return false;
      }
    }
    return true;
  }
  function next() {
    if (validateStep()) { setStep(1); setError(""); window.scrollTo({top:0,behavior:"smooth"}); }
  }
  async function submit() {
    if (!validateStep()) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/research/sostain/submit",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({...answers, submissionId:crypto.randomUUID()}),
      });
      const result: { message?: string } = await response.json();
      if (!response.ok) throw new Error(result.message || "Could not submit your answers.");
      router.push("/research/sostain/thank-you");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Submission failed. Please try again.");
    } finally { setBusy(false); }
  }
  return <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
    <header className="mb-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Sostain • Business research</p>
      <h1 className="heading mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">What is your biggest business headache?</h1>
      <p className="mt-4 text-base leading-7 text-slate-600">We’re learning what Nigerian businesses struggle with so we can build useful tools. Share your experience in a few quick taps—no account needed.</p>
      <p className="mt-3 text-sm font-medium text-blue-700">About 2–3 minutes • 7 quick questions • Optional interview contact</p>
    </header>
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8" aria-labelledby="survey-step-title">
      <div className="mb-4 flex justify-between text-sm text-slate-600">
        <span>Step {step+1} of {researchSteps.length}</span><span>{step===0 ? "50%" : "100%"}</span>
      </div>
      <div className="mb-7 h-2 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
        <div className="h-full rounded-full bg-blue-600" style={{width:step===0?"50%":"100%"}}/>
      </div>
      <h2 id="survey-step-title" className="heading mb-6 text-xl font-semibold">{researchSteps[step].title}</h2>
      <div className="space-y-6">
        {step===0 && <>
          {select("category","1. What kind of business do you run?", businessCategories)}
          {select("teamSize","2. How many people work in your business?",["Just me","2–5","6–20","More than 20"])}
          {select("mainChannel","3. Where do most customer enquiries come from?",channels)}
          {select("tracking","4. How do you mostly track sales or customer records?",trackingMethods)}
        </>}
        {step===1 && <>
          <fieldset className="space-y-2">
            <legend className="mb-2 text-sm font-semibold">5. What are your two biggest business headaches? <span className="font-normal text-slate-500">(choose up to 2)</span></legend>
            {challenges.map(choice=><label className="flex items-start gap-3 rounded-lg border border-slate-200 px-3 py-3 text-sm" key={choice}>
              <input type="checkbox" className="mt-1 accent-blue-600" checked={answers.challenges.includes(choice)}
                onChange={()=>set("challenges",answers.challenges.includes(choice) ? answers.challenges.filter(x=>x!==choice) : answers.challenges.length<2 ? [...answers.challenges,choice] : answers.challenges)}/>
              <span>{choice}</span>
            </label>)}
          </fieldset>
          {select("challengeFrequency","6. How often do these problems affect your business?",["Daily","Weekly","Occasionally","Rarely"])}
          {select("price","7. If a tool reliably solved your biggest problem, what monthly price might you consider?",["Under ₦5,000","₦5,000–₦14,999","₦15,000 or more","Not sure / Need to see it","Would not pay"])}
          <fieldset className="space-y-2">
            <legend className="text-sm font-semibold">Would you be open to a short follow-up interview? <span className="font-normal text-slate-500">(optional)</span></legend>
            <label className="flex items-center gap-2 text-sm"><input type="radio" name="followup" checked={answers.followup==="No"} onChange={()=>setAnswers(a=>({...a,followup:"No",contactName:"",contactDetail:"",contactPermission:false}))}/> No, thanks</label>
            <label className="flex items-center gap-2 text-sm"><input type="radio" name="followup" checked={answers.followup==="Yes"} onChange={()=>set("followup","Yes")}/> Yes, maybe</label>
          </fieldset>
          {answers.followup==="Yes" && <div className="space-y-4 rounded-xl bg-slate-50 p-4">
            <label className="block text-sm font-medium">Name (optional)
              <input className={fieldClass} value={answers.contactName} maxLength={100} onChange={e=>set("contactName",e.target.value)}/>
            </label>
            <label className="block text-sm font-medium">WhatsApp number or email (optional)
              <input className={fieldClass} value={answers.contactDetail} maxLength={150} onChange={e=>set("contactDetail",e.target.value)}/>
            </label>
            <label className="flex items-start gap-2 text-sm"><input className="mt-1" type="checkbox" checked={answers.contactPermission} onChange={e=>set("contactPermission",e.target.checked)}/>
              I agree to be contacted for an interview if I provide contact details. This is not marketing consent.
            </label>
          </div>}
          <label className="flex items-start gap-2 text-sm">
            <input className="mt-1" type="checkbox" checked={answers.privacyAcknowledged} onChange={e=>set("privacyAcknowledged",e.target.checked)}/>
            I understand this is voluntary research. My answers will be analysed for research, and I should not enter confidential customer details.
          </label>
        </>}
      </div>
      <input className="hidden" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={answers.website} onChange={e=>set("website",e.target.value)}/>
      {error && <p role="alert" className="mt-5 text-sm font-medium text-red-700">{error}</p>}
      <div className="mt-7 flex items-center justify-between gap-3">
        <button type="button" disabled={step===0||busy} onClick={()=>{setStep(0);setError("");}} className={`${buttonClass} border border-slate-300 text-slate-800`}>Back</button>
        {step===0
          ? <button type="button" className={`${buttonClass} bg-blue-600 text-white`} onClick={next}>Continue</button>
          : <button type="button" className={`${buttonClass} bg-blue-600 text-white`} disabled={busy} onClick={submit}>{busy?"Submitting…":"Submit answers"}</button>}
      </div>
    </section>
    <p className="mt-5 text-center text-xs text-slate-500">The research form is in preview mode until secure data storage and abuse protection are enabled. Submissions are not yet accepted.</p>
  </div>;
}
