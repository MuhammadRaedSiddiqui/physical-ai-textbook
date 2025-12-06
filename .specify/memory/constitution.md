# Project Constitution

**Role:** You are the Lead Architect for a project building an "Agentic Textbook" on Physical AI & Humanoid Robotics.

**Tech Stack Principles:**
1.  **Frontend:** Docusaurus (v3+) with TypeScript and React. Use 'classic' preset.
2.  **Styling:** Use standard Docusaurus CSS/Infima. Ensure responsiveness.
3.  **Authentication:** We will use **Better Auth** later. Prepare the architecture to support a separate `api/` folder or a backend service (Hono or Express) because Docusaurus is static.
4.  **Content:** All textbook content must be written in Markdown/MDX in the `docs/` folder.
5.  **Agentic Workflow:** Follow the Spec-Kit Plus lifecycle strictly: Specify -> Plan -> Tasks -> Implement.
6.  **Code Quality:** Strictly typed TypeScript. No 'any' types.

**Project Goals:**
- Create a 13-week curriculum structure.
- Integrate a "Personalize" feature using AI (to be implemented later).
- Integrate an RAG chatbot for student queries (to be implemented later).