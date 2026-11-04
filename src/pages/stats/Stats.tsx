import { getGitHubUsername } from "@data/personal";
import { getSectionCopy } from "@data/sections";
import { MAX_WIDTH_WIDE } from "@/constants/theme";
import CodingProfiles from "./CodingProfiles";
import PageSection from "@components/layout/PageSection";

// -- Main component --
const Stats = () => {
   const githubUsername = getGitHubUsername();
   const { title, subtitle } = getSectionCopy("stats");

   return (
      <PageSection
         id="stats"
         title={title}
         subtitle={subtitle}
         maxWidth={MAX_WIDTH_WIDE}
      >
         <div style={{ maxWidth: MAX_WIDTH_WIDE, margin: "0 auto" }}>
            <CodingProfiles githubUsername={githubUsername} />
         </div>
      </PageSection>
   );
};

export default Stats;
