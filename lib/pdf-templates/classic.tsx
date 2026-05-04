import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"
import type { ResumeData } from "../parse-resume"

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Times-Roman",
    fontSize: 10,
    color: "#1a1a1a",
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingBottom: 12,
  },
  name: {
    fontSize: 24,
    fontFamily: "Times-Bold",
    color: "#00194b",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 14,
    color: "#2d3542",
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  contactItem: {
    fontSize: 10,
    color: "#4b5563",
  },
  contactSeparator: {
    fontSize: 10,
    color: "#9ca3af",
    marginHorizontal: 4,
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Times-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
    paddingBottom: 4,
    marginBottom: 8,
    color: "#002060",
  },
  summaryText: {
    fontSize: 10,
    lineHeight: 1.5,
    color: "#2d3542",
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  skillBadge: {
    backgroundColor: "#f3f4f6",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    fontSize: 9,
    color: "#2d3542",
  },
  experienceItem: {
    marginTop: 8,
  },
  experienceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  experienceRole: {
    fontSize: 11,
    fontFamily: "Times-Bold",
    color: "#002060",
  },
  experienceDuration: {
    fontSize: 9,
    color: "#2d3542",
  },
  experienceCompany: {
    fontSize: 10,
    color: "#2d3542",
    fontStyle: "italic",
    marginBottom: 4,
  },
  bulletList: {
    marginLeft: 8,
  },
  bulletItem: {
    flexDirection: "row",
    marginBottom: 3,
  },
  bullet: {
    width: 10,
    fontSize: 10,
    color: "#2d3542",
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 1.4,
    color: "#2d3542",
  },
  educationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  educationDegree: {
    fontSize: 10,
    fontFamily: "Times-Bold",
    color: "#1a1a1a",
  },
  educationSchool: {
    fontSize: 10,
    color: "#4b5563",
    fontStyle: "italic",
  },
  educationYear: {
    fontSize: 10,
    color: "#6b7280",
  },
})

export const ClassicTemplate = ({ data }: { data: ResumeData }) => {
  const { personalInfo, education, summary, skills, workexperience } = data
  const contactItems = [personalInfo.phone, personalInfo.email, personalInfo.location].filter(Boolean)

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.fullName}</Text>
          <Text style={styles.jobTitle}>{personalInfo.title}</Text>
          <View style={styles.contactRow}>
            {contactItems.map((item, index) => (
              <View key={index} style={{ flexDirection: "row" }}>
                <Text style={styles.contactItem}>{item}</Text>
                {index < contactItems.length - 1 && <Text style={styles.contactSeparator}>•</Text>}
              </View>
            ))}
          </View>
        </View>

        {summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        )}

        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technical Skills</Text>
            <View style={styles.skillsContainer}>
              {skills.map((skill, index) => (
                <Text key={index} style={styles.skillBadge}>{skill}</Text>
              ))}
            </View>
          </View>
        )}

        {workexperience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            {workexperience.map((exp, index) => (
              <View key={index} style={index === 0 ? undefined : styles.experienceItem} wrap={true}>
                <View wrap={false}>
                  <View style={styles.experienceHeader}>
                    {exp.companyname && <Text style={styles.experienceRole}>{exp.companyname}</Text>}
                    {exp.duration && <Text style={styles.experienceDuration}>{exp.duration}</Text>}
                  </View>
                  <Text style={styles.experienceCompany}>{exp.role}</Text>
                </View>
                <View style={styles.bulletList}>
                  {exp.experience.map((bullet, bulletIndex) => (
                    <View key={bulletIndex} style={styles.bulletItem} wrap={false}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.bulletText}>{bullet}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Education</Text>
          {education.map((edu, index) => (
            <View key={index} style={[styles.educationHeader, index > 0 && { marginTop: 8 }]}>
              <View>
                <Text style={styles.educationDegree}>{edu.degree}</Text>
                <Text style={styles.educationSchool}>{edu.school}</Text>
              </View>
              <Text style={styles.educationYear}>{edu.year}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  )
}
