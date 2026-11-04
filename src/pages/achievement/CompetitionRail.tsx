import { useRef, useState, type CSSProperties } from "react";
import { motion } from "motion/react";
import type { Achievement } from "@/types";
import usePauseOffscreen from "@hooks/usePauseOffscreen";
import { fadeInUp, VIEWPORT_MARGIN } from "@utils/animations";
import { DURATION, EASING } from "@/constants/theme";
import RailCompetitionCard from "./RailCompetitionCard";
import "./badge-rail.css";

interface CompetitionRailProps {
   achievements: Achievement[];
   cardWidth: number;
   gap: number;
   loopSeconds: number;
}

const FOCUS_PAD_RATIO = 0.12;
const FOCUS_PAD_MIN = 48;
const SHIFT_TRANSITION = { duration: DURATION.quick, ease: EASING.brisk };

const CompetitionRail = ({
   achievements,
   cardWidth,
   gap,
   loopSeconds,
}: CompetitionRailProps) => {
   const railRef = useRef<HTMLDivElement>(null);
   const [shift, setShift] = useState(0);
   usePauseOffscreen(railRef);

   const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
      const rail = railRef.current;
      if (!rail) return;
      const bounds = rail.getBoundingClientRect();
      const target = e.target.getBoundingClientRect();
      const pad = Math.max(FOCUS_PAD_MIN, bounds.width * FOCUS_PAD_RATIO);
      let delta = 0;
      if (target.left < bounds.left + pad) {
         delta = bounds.left + pad - target.left;
      } else if (target.right > bounds.right - pad) {
         delta = bounds.right - pad - target.right;
      }
      if (delta !== 0) setShift((current) => current + delta);
   };

   const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
      if (!e.currentTarget.contains(e.relatedTarget)) setShift(0);
   };

   const railStyle = {
      "--rail-duration": `${loopSeconds}s`,
      "--rail-gap": `${gap}px`,
   } as CSSProperties;

   const renderGroup = (decorative: boolean) => (
      <ul
         className="badge-rail__group"
         aria-hidden={decorative || undefined}
         style={{ paddingBottom: 8 }}
      >
         {achievements.map((item) => (
            <li
               key={`${decorative ? "dec-" : ""}${item.id}`}
               style={{ listStyle: "none" }}
            >
               <RailCompetitionCard
                  item={item}
                  width={cardWidth}
                  decorative={decorative}
               />
            </li>
         ))}
      </ul>
   );

   return (
      <motion.div
         ref={railRef}
         className="badge-rail"
         style={railStyle}
         variants={fadeInUp}
         initial="hidden"
         whileInView="visible"
         viewport={{ once: true, margin: VIEWPORT_MARGIN }}
         onFocus={handleFocus}
         onBlur={handleBlur}
      >
         <motion.div animate={{ x: shift }} transition={SHIFT_TRANSITION}>
            <div className="badge-rail__track">
               {renderGroup(false)}
               {renderGroup(true)}
            </div>
         </motion.div>
      </motion.div>
   );
};

export default CompetitionRail;
