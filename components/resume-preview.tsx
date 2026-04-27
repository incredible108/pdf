"use client"

import { useState } from "react"
import type { ResumeData } from "@/lib/parse-resume"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, GripVertical } from "lucide-react"

interface ResumePreviewProps {
  data: ResumeData
  editable?: boolean
  onDataChange?: (data: ResumeData) => void
}

export function ResumePreview({ data, editable = false, onDataChange }: ResumePreviewProps) {
  const { personalInfo, education, summary, technicalSkills, professionalExperience } = data

  const updateData = (updates: Partial<ResumeData>) => {
    if (onDataChange) {
      onDataChange({ ...data, ...updates })
    }
  }

  const updatePersonalInfo = (field: keyof typeof personalInfo, value: string) => {
    updateData({
      personalInfo: { ...personalInfo, [field]: value }
    })
  }

  const updateSummary = (value: string) => {
    updateData({ summary: value })
  }

  const updateSkill = (index: number, value: string) => {
    const newSkills = [...technicalSkills]
    newSkills[index] = value
    updateData({ technicalSkills: newSkills })
  }

  const addSkill = () => {
    updateData({ technicalSkills: [...technicalSkills, "New Skill"] })
  }

  const removeSkill = (index: number) => {
    updateData({ technicalSkills: technicalSkills.filter((_, i) => i !== index) })
  }

  const updateExperience = (
    expIndex: number,
    field: keyof (typeof professionalExperience)[0],
    value: string | string[]
  ) => {
    const newExperiences = [...professionalExperience]
    newExperiences[expIndex] = { ...newExperiences[expIndex], [field]: value }
    updateData({ professionalExperience: newExperiences })
  }

  const updateBullet = (expIndex: number, bulletIndex: number, value: string) => {
    const newExperiences = [...professionalExperience]
    const newBullets = [...newExperiences[expIndex].bullets]
    newBullets[bulletIndex] = value
    newExperiences[expIndex] = { ...newExperiences[expIndex], bullets: newBullets }
    updateData({ professionalExperience: newExperiences })
  }

  const addBullet = (expIndex: number) => {
    const newExperiences = [...professionalExperience]
    newExperiences[expIndex] = {
      ...newExperiences[expIndex],
      bullets: [...newExperiences[expIndex].bullets, "New bullet point"]
    }
    updateData({ professionalExperience: newExperiences })
  }

  const removeBullet = (expIndex: number, bulletIndex: number) => {
    const newExperiences = [...professionalExperience]
    newExperiences[expIndex] = {
      ...newExperiences[expIndex],
      bullets: newExperiences[expIndex].bullets.filter((_, i) => i !== bulletIndex)
    }
    updateData({ professionalExperience: newExperiences })
  }

  const addExperience = () => {
    updateData({
      professionalExperience: [
        ...professionalExperience,
        { role: "New Role", company: "Company Name", duration: "Start - End", bullets: ["Bullet point"] }
      ]
    })
  }

  const removeExperience = (index: number) => {
    updateData({
      professionalExperience: professionalExperience.filter((_, i) => i !== index)
    })
  }

  const updateEducation = (eduIndex: number, field: keyof (typeof education)[0], value: string) => {
    const newEducation = [...education]
    newEducation[eduIndex] = { ...newEducation[eduIndex], [field]: value }
    updateData({ education: newEducation })
  }

  const addEducation = () => {
    if (education.length < 2) {
      updateData({
        education: [...education, { degree: "Degree", school: "School Name", year: "Year" }]
      })
    }
  }

  const removeEducation = (index: number) => {
    if (education.length > 1) {
      updateData({ education: education.filter((_, i) => i !== index) })
    }
  }

  // Editable text input wrapper
  const EditableText = ({
    value,
    onChange,
    className = "",
    as = "input",
    placeholder = ""
  }: {
    value: string
    onChange: (value: string) => void
    className?: string
    as?: "input" | "textarea"
    placeholder?: string
  }) => {
    if (!editable) {
      return <span className={className}>{value}</span>
    }

    if (as === "textarea") {
      return (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`min-h-[60px] resize-none bg-white/50 border-dashed ${className}`}
          placeholder={placeholder}
        />
      )
    }

    return (
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-auto py-0.5 px-1 bg-white/50 border-dashed ${className}`}
        placeholder={placeholder}
      />
    )
  }

  return (
    <div
      className="bg-white text-black p-8 max-w-[8.5in] mx-auto font-serif"
      style={{ minHeight: "11in" }}
    >
      {/* Header */}
      <header className="text-center border-b-2 border-black pb-4 mb-6">
        {editable ? (
          <>
            <Input
              value={personalInfo.fullName}
              onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
              className="text-3xl font-bold tracking-wide uppercase mb-1 text-center bg-white/50 border-dashed h-auto py-1"
              placeholder="Full Name"
            />
            <Input
              value={personalInfo.jobTitle}
              onChange={(e) => updatePersonalInfo("jobTitle", e.target.value)}
              className="text-lg text-gray-700 mb-2 text-center bg-white/50 border-dashed h-auto py-1"
              placeholder="Job Title"
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-gray-600">
              <Input
                value={personalInfo.phone}
                onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                className="text-center bg-white/50 border-dashed h-auto py-0.5 text-sm"
                placeholder="Phone"
              />
              <Input
                value={personalInfo.email}
                onChange={(e) => updatePersonalInfo("email", e.target.value)}
                className="text-center bg-white/50 border-dashed h-auto py-0.5 text-sm"
                placeholder="Email"
              />
              <Input
                value={personalInfo.location}
                onChange={(e) => updatePersonalInfo("location", e.target.value)}
                className="text-center bg-white/50 border-dashed h-auto py-0.5 text-sm"
                placeholder="Location"
              />
              <Input
                value={personalInfo.linkedin}
                onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                className="text-center bg-white/50 border-dashed h-auto py-0.5 text-sm"
                placeholder="LinkedIn"
              />
            </div>
          </>
        ) : (
          <>
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
              {personalInfo.linkedin && (
                <>
                  <span className="hidden sm:inline">|</span>
                  <span>{personalInfo.linkedin}</span>
                </>
              )}
            </div>
          </>
        )}
      </header>

      {/* Summary */}
      {(summary || editable) && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">
            Professional Summary
          </h2>
          {editable ? (
            <Textarea
              value={summary}
              onChange={(e) => updateSummary(e.target.value)}
              className="text-sm leading-relaxed text-gray-800 bg-white/50 border-dashed min-h-[80px] resize-none"
              placeholder="Enter professional summary..."
            />
          ) : (
            <p className="text-sm leading-relaxed text-gray-800">{summary}</p>
          )}
        </section>
      )}

      {/* Technical Skills */}
      {(technicalSkills.length > 0 || editable) && (
        <section className="mb-6">
          <div className="flex items-center justify-between border-b border-gray-300 pb-1 mb-3">
            <h2 className="text-lg font-bold uppercase tracking-wider">
              Technical Skills
            </h2>
            {editable && (
              <Button
                variant="ghost"
                size="sm"
                onClick={addSkill}
                className="h-6 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Skill
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {technicalSkills.map((skill, index) => (
              <div key={index} className="relative group">
                {editable ? (
                  <div className="flex items-center gap-1">
                    <Input
                      value={skill}
                      onChange={(e) => updateSkill(index, e.target.value)}
                      className="text-sm bg-gray-100 px-2 py-1 rounded h-auto w-auto min-w-[80px] border-dashed"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSkill(index)}
                      className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {skill}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Professional Experience */}
      {(professionalExperience.length > 0 || editable) && (
        <section className="mb-6">
          <div className="flex items-center justify-between border-b border-gray-300 pb-1 mb-3">
            <h2 className="text-lg font-bold uppercase tracking-wider">
              Professional Experience
            </h2>
            {editable && (
              <Button
                variant="ghost"
                size="sm"
                onClick={addExperience}
                className="h-6 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Experience
              </Button>
            )}
          </div>
          <div className="space-y-4">
            {professionalExperience.map((exp, index) => (
              <div key={index} className={`relative ${editable ? "group pl-2 border-l-2 border-transparent hover:border-blue-300" : ""}`}>
                {editable && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeExperience(index)}
                    className="absolute -right-2 -top-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                
                {/* Role */}
                {editable ? (
                  <Input
                    value={exp.role}
                    onChange={(e) => updateExperience(index, "role", e.target.value)}
                    className="font-bold text-base bg-white/50 border-dashed h-auto py-0.5 mb-1"
                    placeholder="Role / Job Title"
                  />
                ) : (
                  <div className="font-bold text-base">{exp.role}</div>
                )}

                {/* Company and Duration */}
                {editable ? (
                  <div className="flex justify-between items-center gap-2 mb-2">
                    <Input
                      value={exp.company}
                      onChange={(e) => updateExperience(index, "company", e.target.value)}
                      className="text-sm text-gray-600 italic bg-white/50 border-dashed h-auto py-0.5 flex-1"
                      placeholder="Company Name"
                    />
                    <Input
                      value={exp.duration}
                      onChange={(e) => updateExperience(index, "duration", e.target.value)}
                      className="text-sm text-gray-600 bg-white/50 border-dashed h-auto py-0.5 w-40 text-right"
                      placeholder="Duration"
                    />
                  </div>
                ) : (
                  (exp.company || exp.duration) && (
                    <div className="flex justify-between items-center flex-wrap gap-1">
                      <span className="text-sm text-gray-600 italic">{exp.company}</span>
                      <span className="text-sm text-gray-600 ml-auto">{exp.duration}</span>
                    </div>
                  )
                )}

                {/* Bullets */}
                {(exp.bullets.length > 0 || editable) && (
                  <ul className={`${editable ? "" : "list-disc list-outside ml-5"} mt-2 space-y-1`}>
                    {exp.bullets.map((bullet, bulletIndex) => (
                      <li key={bulletIndex} className={`text-sm text-gray-800 ${editable ? "flex items-start gap-2 group/bullet" : ""}`}>
                        {editable ? (
                          <>
                            <span className="mt-2 text-gray-400">•</span>
                            <Textarea
                              value={bullet}
                              onChange={(e) => updateBullet(index, bulletIndex, e.target.value)}
                              className="flex-1 bg-white/50 border-dashed min-h-[32px] h-auto py-1 px-2 text-sm resize-none"
                              placeholder="Bullet point..."
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeBullet(index, bulletIndex)}
                              className="h-6 w-6 mt-1 opacity-0 group-hover/bullet:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </>
                        ) : (
                          bullet
                        )}
                      </li>
                    ))}
                    {editable && (
                      <li>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addBullet(index)}
                          className="h-6 text-xs ml-4"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Bullet
                        </Button>
                      </li>
                    )}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      <section>
        <div className="flex items-center justify-between border-b border-gray-300 pb-1 mb-3">
          <h2 className="text-lg font-bold uppercase tracking-wider">
            Education
          </h2>
          {editable && education.length < 2 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={addEducation}
              className="h-6 text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Education
            </Button>
          )}
        </div>
        <div className="space-y-3">
          {education.map((edu, index) => (
            <div key={index} className={`relative ${editable ? "group" : ""}`}>
              {editable && education.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeEducation(index)}
                  className="absolute -right-2 -top-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              {editable ? (
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <Input
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, "degree", e.target.value)}
                      className="font-bold text-base bg-white/50 border-dashed h-auto py-0.5 mb-1"
                      placeholder="Degree"
                    />
                    <Input
                      value={edu.school}
                      onChange={(e) => updateEducation(index, "school", e.target.value)}
                      className="text-sm text-gray-600 italic bg-white/50 border-dashed h-auto py-0.5"
                      placeholder="School"
                    />
                  </div>
                  <Input
                    value={edu.year}
                    onChange={(e) => updateEducation(index, "year", e.target.value)}
                    className="text-sm text-gray-600 bg-white/50 border-dashed h-auto py-0.5 w-24 text-right"
                    placeholder="Year"
                  />
                </div>
              ) : (
                <div className="flex justify-between items-start flex-wrap gap-1">
                  <div>
                    <h3 className="font-bold text-base">{edu.degree}</h3>
                    <p className="text-sm text-gray-600 italic">{edu.school}</p>
                  </div>
                  <span className="text-sm text-gray-600">{edu.year}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
