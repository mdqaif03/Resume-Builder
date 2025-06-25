# 🧠 AI Resume Builder

An intelligent resume builder powered by **Gemini AI** and **Genkit**, built using **Next.js**, **TypeScript**, and **LaTeX** for professional PDF output. This platform helps users generate polished resumes with real-time AI suggestions and high-quality LaTeX-based formatting.

---

## 🚀 Features

- 🤖 **AI-Powered Resume Content** — Uses Gemini API to generate and enhance content like experience, summary, and job descriptions.
- 📄 **LaTeX Resume Templates** — Professional formatting powered by LaTeX ensures top-quality PDF resumes.
- 📥 **PDF Export** — Automatically compiles LaTeX to generate downloadable PDF files.
- 🔁 **Live Editing** — Instantly view AI-enhanced content before final generation.
- 🛠️ **Genkit Integration** — Orchestrates LLM workflows, prompting, and data handling with ease.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **AI Integration**: Google Gemini API + Genkit
- **Resume Generation**: LaTeX templates + PDF compilation (e.g., `pdflatex`, `tectonic`, or API)
- **PDF Handling**: File system or Cloud Storage (optional)
- **State Management**: React Context / Zustand

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/mdqaif03/AI-Resume-Builder.git
cd AI-Resume-Builder

# Install dependencies
npm install

#Build the project
npm run build

#Run the Developement server
npm run dev
