import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
   Star,
   Bot,
   Palette,
   Cpu,
   Terminal,
   ChevronDown,
   FolderGit2,
} from "lucide-react";
import { getSectionCopy } from "@data/sections";
import {
   MONO_FONT,
   DURATION,
   EASING,
   TEXT_MUTED,
   TEXT_PRIMARY,
} from "@/constants/theme";
import { staggerContainer, staggerItem } from "@utils/animations";
import type { OpenSourceContribution } from "@/types";
import { OPEN_SOURCE_CONTRIBUTIONS } from "./projectConstants";
import ContribCard from "./ContribCard";
import "./projects.css";

const COPY = getSectionCopy("projects");

interface CategoryConfig {
   id: string;
   name: string;
   icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
   color: string;
   description: string;
   repos: string[];
}

const CATEGORY_CONFIGS: CategoryConfig[] = [
   {
      id: "ai_agents",
      name: "AI Agents & LLM Skills",
      icon: Bot,
      color: "#a855f7",
      description:
         "Autonomous agents, Claude Code skills, agent memory & unrestricted models",
      repos: [
         "ComposioHQ/awesome-claude-skills",
         "daytonaio/daytona",
         "vectorize-io/hindsight",
         "Imbad0202/academic-research-skills",
         "sickn33/agentic-awesome-skills",
         "elder-plinius/G0DM0D3",
         "emotixco/claude-skills-founder",
         "proficientlyjobs/proficiently-claude-skills",
         "Ishan7390/10skills-video",
         "z00z/G0DM0D3",
         "hema772/AI-Chatbot-using-LLaMA2",
      ],
   },
   {
      id: "frontend_ui",
      name: "Frontend & UI Portfolios",
      icon: Palette,
      color: "#38bdf8",
      description:
         "Creative developer portfolios, Three.js shaders & motion components",
      repos: [
         "zarazhangrui/frontend-slides",
         "emmabostian/developer-portfolios",
         "zarazhangrui/beautiful-html-templates",
         "MengTo/kage",
         "jaredrhod/barehands",
         "mohitvirli/mohitvirli.github.io",
         "gireeshkumarreddy/cinematic-portofilo",
         "Deepsicaa/HandConnect",
         "divyashrma18/GOT",
         "dailymycode/handscanner",
         "Mubeen-jawed/TechFolio",
      ],
   },
   {
      id: "system_architecture",
      name: "System Design & Architecture",
      icon: Cpu,
      color: "#22c55e",
      description:
         "Deep engineering, scalable system design & distributed payment switches",
      repos: [
         "codecrafters-io/build-your-own-x",
         "juspay/hyperswitch",
         "ashishps1/awesome-system-design-resources",
      ],
   },
   {
      id: "linux_themes",
      name: "Linux & Dark Themes",
      icon: Terminal,
      color: "#f59e0b",
      description:
         "Minimalist desktop themes, GRUB customizers & dark Hexo engines",
      repos: [
         "Jacksaur/Gorgeous-GRUB",
         "D-Sketon/hexo-theme-reimu",
         "v1ewp0rt/evilware-theme",
         "howardliu-cn/hexo-theme-clean-dark",
         "B143KC47/VSC4T",
      ],
   },
];

const formatTotalStars = (stars: number): string => {
   if (stars >= 1000000) return `${(stars / 1000000).toFixed(1)}M`;
   if (stars >= 1000) return `${Math.round(stars / 1000)}k`;
   return String(stars);
};

const OpenSourceBanner = () => {
   const [selectedCategory, setSelectedCategory] = useState<string>("all");
   const [sortBy, setSortBy] = useState<"stars" | "name" | "default">("stars");
   // Default first category open to keep the initial view short and clean
   const [openCategories, setOpenCategories] = useState<
      Record<string, boolean>
   >({
      ai_agents: true,
   });

   // Map all open source repositories
   const allRepos = useMemo(
      () => OPEN_SOURCE_CONTRIBUTIONS.filter((c) => c.status === "open"),
      [],
   );

   // Quick lookup map for repo data
   const repoMap = useMemo(() => {
      const map = new Map<string, OpenSourceContribution>();
      for (const repo of allRepos) {
         map.set(repo.repo, repo);
      }
      return map;
   }, [allRepos]);

   // Build categorized items
   const categorizedGroups = useMemo(() => {
      const claimed = new Set<string>();
      const groups = CATEGORY_CONFIGS.map((cat) => {
         const items: OpenSourceContribution[] = [];
         for (const repoName of cat.repos) {
            const found = repoMap.get(repoName);
            if (found) {
               items.push(found);
               claimed.add(repoName);
            }
         }
         return {
            ...cat,
            items,
            totalStars: items.reduce((sum, item) => sum + (item.stars || 0), 0),
         };
      });

      // Catch any unclaimed repo into an "Other Tools" category
      const others = allRepos.filter((r) => !claimed.has(r.repo));
      if (others.length > 0) {
         groups.push({
            id: "other",
            name: "Other Tools & Libraries",
            icon: FolderGit2,
            color: "#94a3b8",
            description: "Additional learning repositories and utilities",
            repos: others.map((o) => o.repo),
            items: others,
            totalStars: others.reduce(
               (sum, item) => sum + (item.stars || 0),
               0,
            ),
         });
      }

      return groups;
   }, [allRepos, repoMap]);

   // Handle category selection from dropdown
   const handleCategorySelect = (categoryId: string) => {
      setSelectedCategory(categoryId);
      if (categoryId !== "all") {
         setOpenCategories((prev) => ({
            ...prev,
            [categoryId]: true,
         }));
      }
   };

   // Toggle individual category accordion
   const toggleCategory = (categoryId: string) => {
      setOpenCategories((prev) => ({
         ...prev,
         [categoryId]: !prev[categoryId],
      }));
   };

   // Expand or collapse all
   const allExpanded = useMemo(() => {
      const activeGroups =
         selectedCategory === "all"
            ? categorizedGroups
            : categorizedGroups.filter((g) => g.id === selectedCategory);
      return activeGroups.every((g) => openCategories[g.id]);
   }, [categorizedGroups, openCategories, selectedCategory]);

   const toggleAll = () => {
      const nextState = !allExpanded;
      const updated: Record<string, boolean> = {};
      for (const group of categorizedGroups) {
         updated[group.id] = nextState;
      }
      setOpenCategories(updated);
   };

   // Filter visible groups based on dropdown
   const visibleGroups = useMemo(() => {
      if (selectedCategory === "all") return categorizedGroups;
      return categorizedGroups.filter((g) => g.id === selectedCategory);
   }, [categorizedGroups, selectedCategory]);

   // Sort items inside each group
   const sortedGroups = useMemo(() => {
      return visibleGroups.map((group) => {
         const sortedItems = [...group.items];
         if (sortBy === "stars") {
            sortedItems.sort((a, b) => (b.stars || 0) - (a.stars || 0));
         } else if (sortBy === "name") {
            sortedItems.sort((a, b) => a.repo.localeCompare(b.repo));
         }
         return {
            ...group,
            items: sortedItems,
         };
      });
   }, [visibleGroups, sortBy]);

   return (
      <motion.div
         style={{ marginTop: 48 }}
         initial={{ opacity: 0, y: 30 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true, margin: "0px 0px -100px 0px" }}
         transition={{ duration: DURATION.slow, ease: EASING.standard }}
      >
         {/* Subsection Heading */}
         <div className="subsection-heading">
            <Star size={22} style={{ color: "#f59e0b" }} aria-hidden="true" />
            <h3>{COPY.subsections.open_source}</h3>
            <span className="subsection-count">{allRepos.length}</span>
         </div>

         <div
            className="glass-card"
            style={{
               padding: 20,
               border: "1px solid rgb(var(--ch-green) / 0.2)",
               position: "relative",
               overflow: "hidden",
            }}
         >
            {/* Top decorative gradient rim */}
            <div
               style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "inherit",
                  padding: 1,
                  background:
                     "linear-gradient(135deg, rgb(var(--ch-sky) / 0.3), rgb(var(--ch-green) / 0.3), rgb(var(--ch-blue-light) / 0.3))",
                  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  maskComposite: "exclude",
                  WebkitMask:
                     "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  pointerEvents: "none",
               }}
            />

            {/* Categorized Dropdown & Filter Controls */}
            <div className="starred-controls">
               <div className="starred-filters-group">
                  {/* Category Dropdown */}
                  <div className="starred-select-control">
                     <span className="starred-select-label">Category:</span>
                     <div className="starred-select-container">
                        <select
                           value={selectedCategory}
                           onChange={(e) =>
                              handleCategorySelect(e.target.value)
                           }
                           className="starred-select"
                           aria-label="Filter by Category"
                        >
                           <option value="all">
                              All Categories ({allRepos.length})
                           </option>
                           {categorizedGroups.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                 {cat.name} ({cat.items.length})
                              </option>
                           ))}
                        </select>
                        <ChevronDown
                           size={14}
                           className="starred-select-chevron"
                        />
                     </div>
                  </div>

                  {/* Sort Dropdown */}
                  <div className="starred-select-control">
                     <span className="starred-select-label">Sort:</span>
                     <div className="starred-select-container">
                        <select
                           value={sortBy}
                           onChange={(e) =>
                              setSortBy(
                                 e.target.value as "stars" | "name" | "default",
                              )
                           }
                           className="starred-select"
                           aria-label="Sort repositories"
                        >
                           <option value="stars">Most Stars (★)</option>
                           <option value="name">Name (A–Z)</option>
                           <option value="default">Default Order</option>
                        </select>
                        <ChevronDown
                           size={14}
                           className="starred-select-chevron"
                        />
                     </div>
                  </div>
               </div>

               {/* Expand / Collapse All Toggle */}
               <button
                  type="button"
                  onClick={toggleAll}
                  className="starred-toggle-btn"
               >
                  {allExpanded ? "Collapse All" : "Expand All"}
               </button>
            </div>

            {/* Categorized Dropdown Accordion List */}
            <div>
               {sortedGroups.map((group) => {
                  const isOpen = !!openCategories[group.id];
                  const Icon = group.icon;

                  return (
                     <div className="starred-accordion-item" key={group.id}>
                        {/* Accordion Dropdown Trigger */}
                        <button
                           type="button"
                           onClick={() => toggleCategory(group.id)}
                           className="starred-accordion-header"
                           aria-expanded={isOpen}
                        >
                           <div
                              style={{
                                 display: "flex",
                                 alignItems: "center",
                                 gap: 12,
                                 minWidth: 0,
                              }}
                           >
                              <div
                                 style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 8,
                                    background: `${group.color}15`,
                                    border: `1px solid ${group.color}33`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                 }}
                              >
                                 <Icon
                                    size={16}
                                    style={{ color: group.color }}
                                 />
                              </div>

                              <div style={{ minWidth: 0 }}>
                                 <div
                                    style={{
                                       display: "flex",
                                       alignItems: "center",
                                       gap: 8,
                                       flexWrap: "wrap",
                                    }}
                                 >
                                    <span
                                       style={{
                                          fontWeight: 600,
                                          fontSize: 14,
                                          color: TEXT_PRIMARY,
                                       }}
                                    >
                                       {group.name}
                                    </span>
                                 </div>
                                 <p
                                    style={{
                                       margin: 0,
                                       fontSize: 11.5,
                                       color: TEXT_MUTED,
                                       overflow: "hidden",
                                       textOverflow: "ellipsis",
                                       whiteSpace: "nowrap",
                                    }}
                                 >
                                    {group.description}
                                 </p>
                              </div>
                           </div>

                           <div
                              style={{
                                 display: "flex",
                                 alignItems: "center",
                                 gap: 10,
                                 flexShrink: 0,
                              }}
                           >
                              <span
                                 style={{
                                    fontFamily: MONO_FONT,
                                    fontSize: 11,
                                    fontWeight: 700,
                                    color: group.color,
                                    background: `${group.color}12`,
                                    border: `1px solid ${group.color}25`,
                                    padding: "2px 8px",
                                    borderRadius: 6,
                                    whiteSpace: "nowrap",
                                 }}
                              >
                                 {group.items.length} repos
                              </span>

                              <span
                                 style={{
                                    fontFamily: MONO_FONT,
                                    fontSize: 11,
                                    fontWeight: 600,
                                    color: "#f59e0b",
                                    display: "none",
                                    padding: "2px 6px",
                                 }}
                                 className="sm:inline-block"
                              >
                                 ★ {formatTotalStars(group.totalStars)}
                              </span>

                              <motion.div
                                 animate={{ rotate: isOpen ? 180 : 0 }}
                                 transition={{ duration: 0.2 }}
                                 style={{
                                    display: "flex",
                                    alignItems: "center",
                                 }}
                              >
                                 <ChevronDown
                                    size={16}
                                    style={{ color: TEXT_MUTED }}
                                 />
                              </motion.div>
                           </div>
                        </button>

                        {/* Accordion Dropdown Content */}
                        <AnimatePresence initial={false}>
                           {isOpen && (
                              <motion.div
                                 initial={{ height: 0, opacity: 0 }}
                                 animate={{ height: "auto", opacity: 1 }}
                                 exit={{ height: 0, opacity: 0 }}
                                 transition={{
                                    duration: 0.25,
                                    ease: EASING.standard,
                                 }}
                                 style={{ overflow: "hidden" }}
                              >
                                 <div className="starred-accordion-body">
                                    <div
                                       style={{
                                          height: 1,
                                          background:
                                             "linear-gradient(to right, transparent, rgb(var(--ch-white) / 0.08), transparent)",
                                          marginBottom: 14,
                                       }}
                                    />
                                    <motion.div
                                       className="contribution-grid"
                                       variants={staggerContainer}
                                       initial="hidden"
                                       whileInView="visible"
                                       viewport={{
                                          once: true,
                                          margin: "0px 0px -40px 0px",
                                       }}
                                    >
                                       {group.items.map((contrib) => (
                                          <motion.div
                                             key={contrib.url}
                                             variants={staggerItem}
                                          >
                                             <ContribCard contrib={contrib} />
                                          </motion.div>
                                       ))}
                                    </motion.div>
                                 </div>
                              </motion.div>
                           )}
                        </AnimatePresence>
                     </div>
                  );
               })}
            </div>
         </div>
      </motion.div>
   );
};

export default OpenSourceBanner;
