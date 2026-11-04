import type { ComponentType } from "react";
import { lazy } from "react";

interface SceneCoverProps {
   tint: string;
   variant?: string;
}

type SceneComponent = ComponentType<SceneCoverProps>;

// Animated SVG scenes -- lazy so the Projects chunk stays lean; they only
// load when the section renders.
const InfraScene = lazy(() => import("./InfraScene"));
const MlScene = lazy(() => import("./MlScene"));
const GraphScene = lazy(() => import("./GraphScene"));
const AutomationScene = lazy(() => import("./AutomationScene"));
const GateScene = lazy(() => import("./GateScene"));
const GovernanceScene = lazy(() => import("./GovernanceScene"));
const DiagramScene = lazy(() => import("./DiagramScene"));
const ForgeScene = lazy(() => import("./ForgeScene"));
const BrainScene = lazy(() => import("./BrainScene"));
const LedgerScene = lazy(() => import("./LedgerScene"));
const PortfolioScene = lazy(() => import("./PortfolioScene"));

type ProjectCover = {
   kind: "scene";
   Scene: SceneComponent;
   variant?: string;
};

/**
 * Cover per project id (ids from data/projects.json).
 * Every project gets an animated scene of its real mechanism.
 */
const COVER_BY_ID: Record<number, ProjectCover> = {
   1: { kind: "scene", Scene: AutomationScene }, // Smart SaltCare
   2: { kind: "scene", Scene: InfraScene }, // Private Cloud File Storage System
   3: { kind: "scene", Scene: GovernanceScene }, // CRM Application – Fleet Management System
   4: { kind: "scene", Scene: MlScene }, // On-Premises NOC Copilot (NetOracle)
   5: { kind: "scene", Scene: LedgerScene }, // Beacon – Hackathon Prototype
};

export const getProjectCover = (id: number): ProjectCover | undefined =>
   COVER_BY_ID[id];
