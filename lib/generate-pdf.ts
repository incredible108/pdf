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

  // Create an iframe to isolate from page styles (prevents lab() color inheritance from Tailwind v4)
  const iframe = document.createElement("iframe")
  iframe.style.position = "absolute"
  iframe.style.left = "-9999px"
  iframe.style.top = "0"
  iframe.style.width = "8.5in"
  iframe.style.height = "11in"
  iframe.style.border = "none"
  document.body.appendChild(iframe)

  // Write the HTML content to the iframe
  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
  if (!iframeDoc) {
    document.body.removeChild(iframe)
    throw new Error("Could not access iframe document")
  }

  iframeDoc.open()
  iframeDoc.write(htmlContent)
  iframeDoc.close()

  // Wait for fonts to load
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Get the actual content div (the resume container inside body > div)
  const element = iframeDoc.body.querySelector("div") as HTMLElement

  if (!element) {
    document.body.removeChild(iframe)
    throw new Error("Could not find resume element")
  }

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
    // Clean up - remove the iframe
    document.body.removeChild(iframe)
  }
}
