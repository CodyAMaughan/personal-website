import { Ghost, Activity, Clapperboard, BadgeCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import libreMotionLogo from '../assets/images/libre-motion-logo.png';
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
        title: "LibreMotion",
        hook: "Creates social ads and short-form videos through an agentic Remotion pipeline that turns ideas into production-ready renders with consistent visual quality.",
        description: "LibreMotion is my agentic video engine for repeatable, code-first storytelling. It combines planning, script generation, and Remotion composition so ad creatives and social clips can be produced quickly, iterated safely, and deployed in a structured workflow.",
        tags: ["Remotion", "Video AI", "Tool"],
        link: "/libremotion",
        featured: true,
        primaryColor: "#06b6d4", // LibreMotion Cyan
        secondaryColor: "#a855f7", // LibreMotion Purple
        logo: libreMotionLogo.src,
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
