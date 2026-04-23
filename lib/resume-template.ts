import type { ResumeData } from "@/lib/parse-resume"

export function generateResumeHTML(data: ResumeData): string {
  const { personalInfo, education, summary, technicalSkills, professionalExperience } = data

  const skillsHTML = technicalSkills
    .map(
      (skill) => `
        <span style="
          font-size: 12px;
          background-color: #f3f4f6;
          padding: 4px 8px;
          border-radius: 4px;
          display: inline-block;
        ">${escapeHTML(skill)}</span>
      `
    )
    .join("")

  const experienceHTML = professionalExperience
    .map(
      (exp) => `
        <div style="margin-bottom: 16px;">
          <div style="font-weight: bold; font-size: 14px;">${escapeHTML(exp.role)}</div>
          ${
            exp.company || exp.duration
              ? `
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 4px;">
              <span style="font-size: 12px; color: #4b5563; font-style: italic;">${escapeHTML(exp.company)}</span>
              <span style="font-size: 12px; color: #4b5563;">${escapeHTML(exp.duration)}</span>
            </div>
          `
              : ""
          }
          ${
            exp.bullets.length > 0
              ? `
            <ul style="list-style-type: disc; list-style-position: outside; margin-left: 20px; margin-top: 8px;">
              ${exp.bullets
                .map(
                  (bullet) => `
                <li style="font-size: 12px; color: #1f2937; margin-bottom: 4px;">${escapeHTML(bullet)}</li>
              `
                )
                .join("")}
            </ul>
          `
              : ""
          }
        </div>
      `
    )
    .join("")

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Merriweather', Georgia, 'Times New Roman', serif;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      </style>
    </head>
    <body>
      <div style="
        background-color: white;
        color: black;
        padding: 32px;
        max-width: 8.5in;
        margin: 0 auto;
        font-family: 'Merriweather', Georgia, 'Times New Roman', serif;
        min-height: 11in;
      ">
        <!-- Header -->
        <header style="
          text-align: center;
          border-bottom: 2px solid black;
          padding-bottom: 16px;
          margin-bottom: 24px;
        ">
          <h1 style="
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 4px;
          ">${escapeHTML(personalInfo.fullName)}</h1>
          <p style="
            font-size: 16px;
            color: #374151;
            margin-bottom: 8px;
          ">${escapeHTML(personalInfo.jobTitle)}</p>
          <div style="
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 16px;
            font-size: 12px;
            color: #4b5563;
            flex-wrap: wrap;
          ">
            <span>${escapeHTML(personalInfo.phone)}</span>
            <span>|</span>
            <span>${escapeHTML(personalInfo.email)}</span>
            <span>|</span>
            <span>${escapeHTML(personalInfo.location)}</span>
          </div>
        </header>

        <!-- Summary -->
        ${
          summary
            ? `
          <section style="margin-bottom: 24px;">
            <h2 style="
              font-size: 16px;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 1px;
              border-bottom: 1px solid #d1d5db;
              padding-bottom: 4px;
              margin-bottom: 12px;
            ">Professional Summary</h2>
            <p style="
              font-size: 12px;
              line-height: 1.6;
              color: #1f2937;
            ">${escapeHTML(summary)}</p>
          </section>
        `
            : ""
        }

        <!-- Technical Skills -->
        ${
          technicalSkills.length > 0
            ? `
          <section style="margin-bottom: 24px;">
            <h2 style="
              font-size: 16px;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 1px;
              border-bottom: 1px solid #d1d5db;
              padding-bottom: 4px;
              margin-bottom: 12px;
            ">Technical Skills</h2>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${skillsHTML}
            </div>
          </section>
        `
            : ""
        }

        <!-- Professional Experience -->
        ${
          professionalExperience.length > 0
            ? `
          <section style="margin-bottom: 24px;">
            <h2 style="
              font-size: 16px;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 1px;
              border-bottom: 1px solid #d1d5db;
              padding-bottom: 4px;
              margin-bottom: 12px;
            ">Professional Experience</h2>
            ${experienceHTML}
          </section>
        `
            : ""
        }

        <!-- Education -->
        <section>
          <h2 style="
            font-size: 16px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-bottom: 1px solid #d1d5db;
            padding-bottom: 4px;
            margin-bottom: 12px;
          ">Education</h2>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 4px;">
            <div>
              <h3 style="font-weight: bold; font-size: 14px;">${escapeHTML(education.degree)}</h3>
              <p style="font-size: 12px; color: #4b5563; font-style: italic;">${escapeHTML(education.school)}</p>
            </div>
            <span style="font-size: 12px; color: #4b5563;">${escapeHTML(education.year)}</span>
          </div>
        </section>
      </div>
    </body>
    </html>
  `
}

function escapeHTML(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}
