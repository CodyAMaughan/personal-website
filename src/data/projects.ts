import { Ghost, Activity, Clapperboard, BadgeCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import sayPlayLogo from '../assets/images/say-play-logo.png';
import procodeLogo from '../assets/images/procode-logo.png';
import ghostWriterLogo from '../assets/images/ghost-writer-logo.png';
import autographLogo from '../assets/images/autograph-logo.png';

export interface Project {
    title: string;
    hook: string;
    description: string; // Long description for the projects page
    link?: string;
    tags: string[];
    primaryColor: string;
    secondaryColor: string;
    logo?: string;
    logoIsExternal?: boolean;
    icon: LucideIcon;
    isWaitlist?: boolean;
    featured: boolean; // Controls visibility on BentoGrid (Landing Page)
}

export const PROJECTS: Project[] = [
    {
        title: "Say Play",
        hook: "Orchestrates autonomous video production agents to compile raw text into dynamic Remotion code, bridging high-level intent with pixel-perfect execution via LangGraph and Python.",
        description: "Say Play represents a paradigm shift in video creation. By leveraging agentic workflows, it doesn't just 'generate' video; it understands intent, writes code, and directs the scene. Built on top of Remotion, it ensures that every frame is programmatically perfect while being creatively directed by AI agents.",
        tags: ["Remotion", "Video AI", "Tool"],
        isWaitlist: true,
        featured: true,
        primaryColor: "#60a5fa", // Process Blue
        secondaryColor: "#4ade80", // Terminal Green
        logo: sayPlayLogo.src,
        icon: Clapperboard,
    },
    {
        title: "ProCode",
        hook: "Orchestrates an AI-powered pipeline to ingest clinical notes and generate high-precision ICD-10/CPT code predictions. Leverages a FastAPI backend with a custom pgvector-based RAG architecture.",
        description: "In the complex world of healthcare billing, accuracy is everything. ProCode utilizes advanced RAG architectures to ingest vast amounts of clinical data and cross-reference it with the latest coding standards. It's not just a checker; it's an intelligent auditor that helps healthcare providers secure their revenue cycle.",
        link: "https://procode.health",
        tags: ["Healthcare", "RAG", "SaaS"],
        featured: true,
        primaryColor: "#D62566", // Brand Pink
        secondaryColor: "#2563EB", // Medical Blue
        logo: procodeLogo.src,
        icon: Activity,
    },
    {
        title: "Ghost Writer",
        hook: "Engineers a serverless P2P social deduction arena where players deploy AI agents to deceive human opponents. Leverages PeerJS for zero-backend WebRTC synchronization and orchestrates client-side LLMs.",
        description: "Ghost Writer pushes the boundaries of what's possible in the browser. By using PeerJS for zero-latency peer-to-peer communication and orchestrating local LLMs, it creates a social deduction game where you can never be quite sure if you're talking to a human or a machine.",
        link: "https://playghostwriter.online",
        tags: ["Game Dev", "Agents", "Realtime"],
        featured: true,
        primaryColor: "#4ade80", // Terminal Green
        secondaryColor: "#06b6d4", // Cyan-500
        logo: ghostWriterLogo.src,
        icon: Ghost,
    },
    {
        title: "Autograph",
        hook: "The 'Blue Check' for human creativity. A blockchain-based provenance protocol that allows artists to cryptographically sign their work, distinguishing human effort from AI-generated noise.",
        description: "As AI content floods the internet, provenance becomes the new currency of trust. Autograph provides a decentralized, immutable ledger for human creativity. It's a protocol for truth in a world of synthetic media.",
        link: "https://autograph.art",
        tags: ["Blockchain", "Web3", "Provenance"],
        featured: true,
        primaryColor: "#ffffff", // Pure White
        secondaryColor: "#f59e0b", // Amber/Gold
        logo: autographLogo.src,
        icon: BadgeCheck,
    }
];
