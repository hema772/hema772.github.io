import type { CSSProperties } from "react";
import {
   ArrowUpRight,
   GitMerge,
   GitPullRequestClosed,
   Star,
} from "lucide-react";
import type { OpenSourceContribution } from "@/types";
import { getSectionCopy } from "@data/sections";
import { SKY, ORANGE } from "@/constants/theme";

interface ContribCardProps {
   contrib: OpenSourceContribution;
}

const LABELS = getSectionCopy("projects").contribution_status;

const STATUS_CONFIG = {
   merged: { color: SKY, Icon: GitMerge, label: LABELS.merged },
   open: { color: "#f59e0b", Icon: Star, label: LABELS.open },
   closed: { color: ORANGE, Icon: GitPullRequestClosed, label: LABELS.closed },
} as const;

const formatStars = (stars: number): string => {
   if (stars >= 1000000) return `${(stars / 1000000).toFixed(1)}M`;
   if (stars >= 1000)
      return `${(stars / 1000).toFixed(stars >= 10000 ? 0 : 1)}k`;
   return String(stars);
};

const ContribCard = ({ contrib }: ContribCardProps) => {
   const config =
      STATUS_CONFIG[contrib.status as keyof typeof STATUS_CONFIG] ??
      STATUS_CONFIG.open;
   const { color: statusColor, Icon: StatusIcon, label: statusLabel } = config;

   return (
      <a
         href={contrib.url}
         target="_blank"
         rel="noopener noreferrer"
         title={`${contrib.repo}: ${contrib.title}`}
         className="contribution-link"
         style={{ "--contribution-accent": statusColor } as CSSProperties}
      >
         <StatusIcon
            size={14}
            className="contribution-icon"
            aria-hidden="true"
         />
         <div style={{ minWidth: 0, flex: 1 }}>
            <div className="contribution-meta">
               <span className="contribution-repo">{contrib.repo}</span>
               <div
                  style={{
                     display: "flex",
                     alignItems: "center",
                     gap: 6,
                     flexShrink: 0,
                  }}
               >
                  {typeof contrib.stars === "number" && contrib.stars > 0 && (
                     <span
                        style={{
                           color: "#f59e0b",
                           fontWeight: 700,
                           fontSize: 10.5,
                           display: "inline-flex",
                           alignItems: "center",
                           gap: 2,
                        }}
                     >
                        ★ {formatStars(contrib.stars)}
                     </span>
                  )}
                  <span className="contribution-status">{statusLabel}</span>
               </div>
            </div>
            <p className="contribution-title">{contrib.title}</p>
         </div>
         <ArrowUpRight
            size={14}
            className="contribution-icon action-arrow action-arrow--external"
            aria-hidden="true"
         />
      </a>
   );
};

export default ContribCard;
