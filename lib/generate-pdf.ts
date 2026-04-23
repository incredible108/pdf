import type { ResumeData } from "@/lib/parse-resume"
import { generateResumeHTML } from "@/lib/resume-template"

export async function generateResumePDF(
  data: ResumeData,
  filename: string
): Promise<void> {
  // Dynamically import html2pdf.js (client-side only)
  const html2pdf = (await import("html2pdf.js")).default

  // Generate HTML from resume data
  const htmlContent = generateResumeHTML(data)

  // Create a temporary container to hold the HTML
  const container = document.createElement("div")
  container.innerHTML = htmlContent
  container.style.position = "absolute"
  container.style.left = "-9999px"
  container.style.top = "0"
  document.body.appendChild(container)

  // Get the actual content div (the resume container)
  const element = container.querySelector("div") as HTMLElement

  // Configure pdf options to match Letter size (8.5in x 11in)
  const options = {
    margin: 0,
    filename: filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      logging: false,
    },
    jsPDF: {
      unit: "in",
      format: "letter",
      orientation: "portrait",
    },
    pagebreak: { mode: ["avoid-all", "css", "legacy"] },
  }

  try {
    await html2pdf().set(options).from(element).save()
  } finally {
    // Clean up - remove the temporary container
    document.body.removeChild(container)
  }
}
