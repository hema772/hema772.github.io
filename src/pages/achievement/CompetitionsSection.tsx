import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, ChevronDown, ChevronUp } from "lucide-react";
import type { Achievement } from "@/types";
import { getSectionCopy } from "@data/sections";
import { fadeInUp, VIEWPORT_MARGIN } from "@utils/animations";
import { AMBER, MONO_FONT, TEXT_MUTED } from "@/constants/theme";
import useBreakpoint from "@hooks/useBreakpoint";
import useMotionPreference from "@hooks/useMotionPreference";
import CompetitionResult from "./CompetitionResult";
import CompetitionRail from "./CompetitionRail";
import RailCompetitionCard from "./RailCompetitionCard";
import "./achievements.css";

interface CompetitionsSectionProps {
   achievements: Achievement[];
}

const CARD_WIDTH = 300;
const CARD_WIDTH_MOBILE = 260;
const RAIL_GAP = 20;
const RAIL_GAP_MOBILE = 14;
const LOOP_S = 75;
const LOOP_S_MOBILE = 90;

const CompetitionsSection = ({ achievements }: CompetitionsSectionProps) => {
   const { isMobile } = useBreakpoint();
   const { reducedMotion } = useMotionPreference();
   const [showBreakdown, setShowBreakdown] = useState(false);

   if (achievements.length === 0) return null;

   const podiumFinishes = achievements.filter((item) =>
      /^(?:1st|2nd|3rd) Place - /.test(item.title),
   );
   const podiumIds = new Set(podiumFinishes.map((item) => item.id));
   const otherResults = achievements.filter((item) => !podiumIds.has(item.id));
   const copy = getSectionCopy("achievements");
   const groups = [
      { title: copy.competitions.podium, items: podiumFinishes },
      { title: copy.competitions.other, items: otherResults },
   ].filter((group) => group.items.length > 0);

   const cardWidth = isMobile ? CARD_WIDTH_MOBILE : CARD_WIDTH;
   const gap = isMobile ? RAIL_GAP_MOBILE : RAIL_GAP;
   const showRail = !reducedMotion && achievements.length >= 6;

   return (
      <div className="competition-record">
         <motion.div
            className="subsection-heading"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: VIEWPORT_MARGIN }}
            variants={fadeInUp}
         >
            <Trophy size={22} style={{ color: AMBER }} aria-hidden="true" />
            <h3>{copy.subsections.competitions}</h3>
            <span className="subsection-count">{achievements.length}</span>
         </motion.div>

         {showRail ? (
            <CompetitionRail
               achievements={achievements}
               cardWidth={cardWidth}
               gap={gap}
               loopSeconds={isMobile ? LOOP_S_MOBILE : LOOP_S}
            />
         ) : (
            <motion.div
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true, margin: VIEWPORT_MARGIN }}
               variants={fadeInUp}
               style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap,
                  paddingBottom: 12,
               }}
            >
               {achievements.map((item) => (
                  <RailCompetitionCard
                     key={item.id}
                     item={item}
                     width={cardWidth}
                  />
               ))}
            </motion.div>
         )}

         {/* Breakdown toggle to see podium finishes & other results breakdown */}
         <div style={{ marginTop: 24, textAlign: "center" }}>
            <button
               type="button"
               onClick={() => setShowBreakdown((prev) => !prev)}
               style={{
                  background: "transparent",
                  border: "1px solid rgb(var(--ch-white) / 0.1)",
                  borderRadius: 8,
                  padding: "8px 16px",
                  color: TEXT_MUTED,
                  fontSize: 12,
                  fontFamily: MONO_FONT,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
               }}
               onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#f4f6f7";
                  e.currentTarget.style.borderColor =
                     "rgb(var(--ch-white) / 0.25)";
               }}
               onMouseLeave={(e) => {
                  e.currentTarget.style.color = TEXT_MUTED;
                  e.currentTarget.style.borderColor =
                     "rgb(var(--ch-white) / 0.1)";
               }}
            >
               <span>
                  {showBreakdown
                     ? "Hide categorized table"
                     : `View categorized breakdown (${podiumFinishes.length} podium · ${otherResults.length} other)`}
               </span>
               {showBreakdown ? (
                  <ChevronUp size={14} />
               ) : (
                  <ChevronDown size={14} />
               )}
            </button>
         </div>

         <AnimatePresence>
            {showBreakdown && (
               <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: "hidden", marginTop: 20 }}
               >
                  <div
                     className={`competition-groups${groups.length === 1 ? " competition-groups--single" : ""}`}
                  >
                     {groups.map((group) => (
                        <div className="competition-group" key={group.title}>
                           <h4 className="competition-group-title">
                              {group.title}
                              <span>{group.items.length}</span>
                           </h4>
                           <ul
                              className="competition-results"
                              aria-label={group.title}
                           >
                              {group.items.map((item, index) => (
                                 <CompetitionResult
                                    key={item.id}
                                    item={item}
                                    index={index}
                                 />
                              ))}
                           </ul>
                        </div>
                     ))}
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   );
};

export default CompetitionsSection;
