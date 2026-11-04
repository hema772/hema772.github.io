import type { CSSProperties } from "react";
import { motion } from "motion/react";
import { Trophy, Award, Medal, Flame, Star, CheckCircle2 } from "lucide-react";
import type { Achievement } from "@/types";
import {
   MEDAL_GOLD,
   MEDAL_SILVER,
   MEDAL_BRONZE,
   AMBER,
   SKY,
   GREEN,
   BLUE_LIGHT,
   TEXT_PRIMARY,
   TEXT_SECONDARY,
   TEXT_MUTED,
   MONO_FONT,
} from "@/constants/theme";
import useMotionPreference from "@hooks/useMotionPreference";

interface RailCompetitionCardProps {
   item: Achievement;
   width: number;
   decorative?: boolean;
}

type IconType = "trophy" | "medal" | "award" | "star" | "check" | "flame";

const renderCompetitionIcon = (iconKey: IconType, color: string) => {
   switch (iconKey) {
      case "trophy":
         return <Trophy size={13} style={{ color, flexShrink: 0 }} />;
      case "medal":
         return <Medal size={13} style={{ color, flexShrink: 0 }} />;
      case "award":
         return <Award size={13} style={{ color, flexShrink: 0 }} />;
      case "star":
         return <Star size={13} style={{ color, flexShrink: 0 }} />;
      case "check":
         return <CheckCircle2 size={13} style={{ color, flexShrink: 0 }} />;
      case "flame":
         return <Flame size={13} style={{ color, flexShrink: 0 }} />;
      default:
         return <Award size={13} style={{ color, flexShrink: 0 }} />;
   }
};

const parseCompetition = (title: string) => {
   let badge = "Award";
   let event = title;
   let color = SKY;
   let iconKey: IconType = "award";

   if (title.includes(" - ")) {
      const parts = title.split(" - ");
      if (
         parts[0].includes("1st") ||
         parts[0].includes("2nd") ||
         parts[0].includes("3rd") ||
         parts[0].includes("4th") ||
         parts[0].includes("Prize") ||
         parts[0].includes("Place") ||
         parts[0].includes("Round 2") ||
         parts[0].includes("Participant")
      ) {
         badge = parts[0];
         event = parts.slice(1).join(" - ");
      } else if (
         parts[1].includes("1st") ||
         parts[1].includes("2nd") ||
         parts[1].includes("3rd") ||
         parts[1].includes("4th") ||
         parts[1].includes("Prize")
      ) {
         badge = parts[1];
         event = parts[0];
      }
   } else if (title.includes(" — ")) {
      const parts = title.split(" — ");
      event = parts[0];
      badge = parts[1];
   } else if (title.includes("Top 10")) {
      badge = "Top 10 Finalist";
      event = title.replace("Top 10 Finalist - ", "");
   } else if (title.includes("Startup Singam")) {
      badge = "Finalist";
      event = title;
   } else if (title.includes("Job Simulation")) {
      badge = "Job Simulation";
      event = "AWS Solutions Architecture";
   }

   // Colors and icons
   if (badge.includes("1st") || title.includes("1st")) {
      color = MEDAL_GOLD;
      iconKey = "trophy";
   } else if (badge.includes("2nd") || title.includes("2nd")) {
      color = MEDAL_SILVER;
      iconKey = "medal";
   } else if (badge.includes("3rd") || title.includes("3rd")) {
      color = MEDAL_BRONZE;
      iconKey = "medal";
   } else if (badge.includes("4th") || title.includes("4th")) {
      color = AMBER;
      iconKey = "award";
   } else if (
      badge.includes("Top 10") ||
      badge.includes("Shortlisted") ||
      badge.includes("Finalist")
   ) {
      color = SKY;
      iconKey = "star";
   } else if (badge.includes("Round 2") || badge.includes("Simulation")) {
      color = GREEN;
      iconKey = "check";
   } else if (badge.includes("Individual") || badge.includes("Lead")) {
      color = BLUE_LIGHT;
      iconKey = "flame";
   }

   return { badge, event, color, iconKey };
};

const RailCompetitionCard = ({
   item,
   width,
   decorative = false,
}: RailCompetitionCardProps) => {
   const { badge, event, color, iconKey } = parseCompetition(item.title);
   const { reducedMotion } = useMotionPreference();

   return (
      <motion.div
         tabIndex={decorative ? -1 : 0}
         aria-hidden={decorative || undefined}
         whileHover={
            reducedMotion
               ? undefined
               : {
                    y: -4,
                    borderColor: `${color}88`,
                    backgroundColor: "rgb(var(--ch-white) / 0.05)",
                 }
         }
         style={
            {
               width,
               minHeight: 124,
               padding: "16px 18px",
               borderRadius: 12,
               background: "rgb(var(--ch-white) / 0.025)",
               border: "1px solid rgb(var(--ch-white) / 0.08)",
               backdropFilter: "blur(12px)",
               WebkitBackdropFilter: "blur(12px)",
               display: "flex",
               flexDirection: "column",
               justifyContent: "space-between",
               gap: 10,
               flexShrink: 0,
               position: "relative",
               overflow: "hidden",
               cursor: "default",
               transition:
                  "border-color 0.25s ease, background-color 0.25s ease",
               "--accent-color": color,
            } as CSSProperties
         }
      >
         {/* Top accent line */}
         <div
            style={{
               position: "absolute",
               top: 0,
               left: 0,
               right: 0,
               height: 2,
               background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
               opacity: 0.6,
            }}
         />

         {/* Header Row: Placement Pill + Type Tag */}
         <div
            style={{
               display: "flex",
               alignItems: "center",
               justifyContent: "space-between",
               gap: 8,
            }}
         >
            <span
               style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "3px 8px",
                  borderRadius: 6,
                  background: `${color}18`,
                  border: `1px solid ${color}33`,
                  color,
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: MONO_FONT,
                  letterSpacing: "0.02em",
                  whiteSpace: "nowrap",
               }}
            >
               {renderCompetitionIcon(iconKey, color)}
               {badge}
            </span>

            {item.type && (
               <span
                  style={{
                     fontFamily: MONO_FONT,
                     fontSize: 10,
                     fontWeight: 600,
                     letterSpacing: "0.06em",
                     textTransform: "uppercase",
                     color: TEXT_MUTED,
                     whiteSpace: "nowrap",
                  }}
               >
                  {item.type}
               </span>
            )}
         </div>

         {/* Title / Event */}
         <h5
            style={{
               margin: 0,
               fontSize: 13.5,
               fontWeight: 600,
               color: TEXT_PRIMARY,
               lineHeight: 1.35,
               display: "-webkit-box",
               WebkitLineClamp: 2,
               WebkitBoxOrient: "vertical",
               overflow: "hidden",
               textOverflow: "ellipsis",
            }}
            title={event}
         >
            {event}
         </h5>

         {/* Footer Row: Organizer & Date */}
         <div
            style={{
               display: "flex",
               alignItems: "center",
               justifyContent: "space-between",
               gap: 8,
               borderTop: "1px solid rgb(var(--ch-white) / 0.05)",
               paddingTop: 8,
               fontSize: 11,
            }}
         >
            <span
               style={{
                  color: TEXT_SECONDARY,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "68%",
               }}
               title={item.organizer}
            >
               {item.organizer}
            </span>
            <span
               style={{
                  color: TEXT_MUTED,
                  fontFamily: MONO_FONT,
                  fontSize: 10.5,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
               }}
            >
               {item.date}
            </span>
         </div>
      </motion.div>
   );
};

export default RailCompetitionCard;
