"use client"

import { forwardRef } from "react"
import type { ResumeData } from "@/lib/parse-resume"

interface ResumePreviewProps {
  data: ResumeData
}

export const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  function ResumePreview({ data }, ref) {
    const { personalInfo, education, summary, technicalSkills, professionalExperience } = data

    return (
      <div
        ref={ref}
        className="bg-white text-black p-8 max-w-[8.5in] mx-auto font-serif"
        style={{ minHeight: "11in" }}
      >
        {/* Header */}
        <header className="text-center border-b-2 border-black pb-4 mb-6">
          <h1 className="text-3xl font-bold tracking-wide uppercase mb-1">
            {personalInfo.fullName}
          </h1>
          <p className="text-lg text-gray-700 mb-2">{personalInfo.jobTitle}</p>
          <div className="flex justify-center items-center gap-4 text-sm text-gray-600 flex-wrap">
            <span>{personalInfo.phone}</span>
            <span className="hidden sm:inline">|</span>
            <span>{personalInfo.email}</span>
            <span className="hidden sm:inline">|</span>
            <span>{personalInfo.location}</span>
          </div>
        </header>

        {/* Summary */}
        {summary && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">
              Professional Summary
            </h2>
            <p className="text-sm leading-relaxed text-gray-800">{summary}</p>
          </section>
        )}

        {/* Technical Skills */}
        {technicalSkills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">
              Technical Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {technicalSkills.map((skill, index) => (
                <span
                  key={index}
                  className="text-sm bg-gray-100 px-2 py-1 rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Professional Experience */}
        {professionalExperience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">
              Professional Experience
            </h2>
            <div className="space-y-4">
              {professionalExperience.map((exp, index) => (
                <div key={index}>
                  {/* 1st line: Role */}
                  <div className="font-bold text-base">{exp.role}</div>
                  {/* 2nd line: Company (left) and Duration (right) */}
                  {(exp.company || exp.duration) && (
                    <div className="flex justify-between items-center flex-wrap gap-1">
                      <span className="text-sm text-gray-600 italic">{exp.company}</span>
                      <span className="text-sm text-gray-600 ml-auto">{exp.duration}</span>
                    </div>
                  )}
                  {/* Bullets */}
                  {exp.bullets.length > 0 && (
                    <ul className="list-disc list-outside ml-5 mt-2 space-y-1">
                      {exp.bullets.map((bullet, bulletIndex) => (
                        <li key={bulletIndex} className="text-sm text-gray-800">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        <section>
          <h2 className="text-lg font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">
            Education
          </h2>
          <div className="flex justify-between items-start flex-wrap gap-1">
            <div>
              <h3 className="font-bold text-base">{education.degree}</h3>
              <p className="text-sm text-gray-600 italic">{education.school}</p>
            </div>
            <span className="text-sm text-gray-600">{education.year}</span>
          </div>
        </section>
      </div>
    )
  }
)
