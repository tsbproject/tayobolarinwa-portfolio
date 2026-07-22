"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import toast from "react-hot-toast";

import {
  consultationSchema,
  type ConsultationInput,
} from "@/app/_lib/validation/consultation";
import { Link } from "lucide-react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<ConsultationInput>({
    resolver: zodResolver(consultationSchema),
  });

  async function onSubmit(
    data: ConsultationInput
  ) {
    try {
      const response = await fetch(
        "/api/consultation",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ??
            "Unable to submit consultation."
        );
      }

      reset();

      setSubmitted(true);

    } catch (error) {
      console.error(error);

     toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    }
  }

  if (submitted) {
    return (
      <Section>
        <Container>

          <div className="mx-auto max-w-3xl rounded-3xl border border-green-200 bg-green-50 p-12 text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-600 text-4xl text-white">
              ✓
            </div>

            <h2 className="mt-8 text-4xl font-bold text-slate-900">
              Consultation Request Received
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Thank you for reaching out.
              I&apos;ve successfully received
              your consultation request
              and will personally review
              your project.
            </p>

            <p className="mt-6 text-slate-700">
              Expected response time:
              <strong>
                {" "}
                Within 24 Hours
              </strong>
            </p>

            <Link
              href="/"
              className="mt-10 inline-flex rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
            >
              Return Home
            </Link>

          </div>

        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container>

        <SectionHeading
          eyebrow="Project Consultation"
          title="Tell Me About Your Project"
          description="Complete the form below and I'll personally review your project and recommend the most suitable technical solution."
        />

        <div className="mt-12 rounded-3xl border border-blue-200 bg-blue-50 p-8">

          <h3 className="text-xl font-semibold text-blue-700">
            Before You Submit
          </h3>

          <p className="mt-4 leading-8 text-slate-600">
            Every project is different.
            The more context you provide,
            the more valuable our first
            conversation will be.
          </p>

          <p className="mt-4 font-medium text-slate-700">
            Typical response time:
            <strong>
              {" "}
              Within 24 Hours
            </strong>
          </p>

        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-16 space-y-10"
        >

          <input
            type="text"
            {...register("website")}
            autoComplete="off"
            tabIndex={-1}
            className="hidden"
          />

          <div className="grid gap-8 md:grid-cols-2">

            <div>

              <label className="mb-2 block font-medium">
                Full Name
              </label>

              <input
                {...register("fullName")}
                className="w-full rounded-xl border border-slate-300 px-5 py-4 outline-none transition focus:border-blue-600"
              />

              {errors.fullName && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.fullName.message}
                </p>
              )}

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Email Address
              </label>

              <input
                type="email"
                {...register("email")}
                className="w-full rounded-xl border border-slate-300 px-5 py-4 outline-none transition focus:border-blue-600"
              />

              {errors.email && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}

            </div>

          </div>

          <div className="grid gap-8 md:grid-cols-2">

            <div>

              <label className="mb-2 block font-medium">
                Company
              </label>

              <input
                {...register("company")}
                className="w-full rounded-xl border border-slate-300 px-5 py-4"
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Phone Number
              </label>

              <input
                {...register("phone")}
                className="w-full rounded-xl border border-slate-300 px-5 py-4"
              />

            </div>

          </div>

                    <div className="grid gap-8 md:grid-cols-2">

            <div>

              <label className="mb-2 block font-medium">
                Project Type
              </label>

              <select
                {...register("projectType")}
                className="w-full rounded-xl border border-slate-300 px-5 py-4"
              >
                <option value="">Select Project Type</option>
                <option value="Business Website">
                  Business Website
                </option>
                <option value="Business Platform">
                  Business Platform
                </option>
                <option value="Marketplace">
                  Marketplace
                </option>
                <option value="Web Application">
                  Web Application
                </option>
                <option value="Dashboard">
                  Dashboard
                </option>
                <option value="API Development">
                  API Development
                </option>
                <option value="Technical Consultation">
                  Technical Consultation
                </option>
                <option value="Other">
                  Other
                </option>
              </select>

              {errors.projectType && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.projectType.message}
                </p>
              )}

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Budget Range
              </label>

              <select
                {...register("budget")}
                className="w-full rounded-xl border border-slate-300 px-5 py-4"
              >
                <option value="">Select Budget</option>
                <option value="Under ₦500,000">
                  Under ₦500,000
                </option>
                <option value="₦500,000 - ₦2,000,000">
                  ₦500,000 - ₦2,000,000
                </option>
                <option value="₦2,000,000 - ₦5,000,000">
                  ₦2,000,000 - ₦5,000,000
                </option>
                <option value="Above ₦5,000,000">
                  Above ₦5,000,000
                </option>
                <option value="Let's Discuss">
                  Let&apos;s Discuss
                </option>
              </select>

              {errors.budget && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.budget.message}
                </p>
              )}

            </div>

          </div>

          <div className="grid gap-8 md:grid-cols-2">

            <div>

              <label className="mb-2 block font-medium">
                Project Stage
              </label>

              <select
                {...register("projectStage")}
                className="w-full rounded-xl border border-slate-300 px-5 py-4"
              >
                <option value="">Select Stage</option>
                <option value="Idea / Planning">
                  Idea / Planning
                </option>
                <option value="Design Complete">
                  Design Complete
                </option>
                <option value="Development in Progress">
                  Development in Progress
                </option>
                <option value="Existing Platform">
                  Existing Platform
                </option>
                <option value="Scaling Existing Product">
                  Scaling Existing Product
                </option>
              </select>

              {errors.projectStage && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.projectStage.message}
                </p>
              )}

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Estimated Start Date
              </label>

              <select
                {...register("startDate")}
                className="w-full rounded-xl border border-slate-300 px-5 py-4"
              >
                <option value="">Select Start Date</option>
                <option value="Immediately">
                  Immediately
                </option>
                <option value="Within 2 Weeks">
                  Within 2 Weeks
                </option>
                <option value="Within 1 Month">
                  Within 1 Month
                </option>
                <option value="Within 3 Months">
                  Within 3 Months
                </option>
                <option value="Flexible">
                  Flexible
                </option>
              </select>

              {errors.startDate && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.startDate.message}
                </p>
              )}

            </div>

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Preferred Contact Method
            </label>

            <select
              {...register("preferredContact")}
              className="w-full rounded-xl border border-slate-300 px-5 py-4"
            >
              <option value="">Select Contact Method</option>
              <option value="Email">
                Email
              </option>
              <option value="WhatsApp">
                WhatsApp
              </option>
              <option value="Phone Call">
                Phone Call
              </option>
              <option value="Google Meet">
                Google Meet
              </option>
            </select>

            {errors.preferredContact && (
              <p className="mt-2 text-sm text-red-600">
                {errors.preferredContact.message}
              </p>
            )}

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Project Details
            </label>

            <textarea
              rows={8}
              {...register("message")}
              placeholder="Tell me about your project, your goals, your target audience and any technical requirements..."
              className="w-full rounded-xl border border-slate-300 px-5 py-4 outline-none transition focus:border-blue-600"
            />

            {errors.message && (
              <p className="mt-2 text-sm text-red-600">
                {errors.message.message}
              </p>
            )}

          </div>

          {/* Turnstile goes here */}

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? "Submitting..."
              : "Book Consultation"}
          </button>

          <p className="text-center text-sm leading-7 text-slate-500">

            ✓ Your information remains confidential.

            <br />

            ✓ No spam or unsolicited emails.

            <br />

            ✓ Every consultation request is personally reviewed.

          </p>

        </form>

      </Container>
    </Section>
  );
}