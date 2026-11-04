import { describe, expect, it } from "vitest";
import { GLOSSARY, segmentGloss } from "@utils/glossary";
import personalData from "../../data/personal.json";
import projectsData from "../../data/projects.json";
import experienceData from "../../data/experience.json";

const marked = (text: string) =>
   segmentGloss(text)
      .filter((segment) => segment.term)
      .map(({ at, text: part, term }) => ({ at, text: part, term }));

// En and em dash, built from code points so this file stays plain ASCII.
const DASHES = [0x2013, 0x2014].map((code) => String.fromCodePoint(code));

describe("segmentGloss", () => {
   it("returns no segments for an empty string and one plain run without terms", () => {
      expect(segmentGloss("")).toEqual([]);
      expect(segmentGloss("Plain words only.")).toEqual([
         { at: 0, text: "Plain words only." },
      ]);
   });

   it("covers the whole string with offsets that line up", () => {
      const text = "AWS, EC2 and S3 on VPC, then AWS.";
      const parts = segmentGloss(text);
      expect(parts.map((segment) => segment.text).join("")).toBe(text);
      for (const { at, text: part } of parts)
         expect(text.slice(at, at + part.length)).toBe(part);
   });

   it("marks only the first occurrence of each term", () => {
      expect(segmentGloss("AWS cloud, more AWS")).toEqual([
         { at: 0, text: "AWS", term: "AWS" },
         { at: 3, text: " cloud, more AWS" },
      ]);
      expect(marked("Amazon EC2 here, EC2 there")).toEqual([
         { at: 0, text: "Amazon EC2", term: "EC2" },
      ]);
   });

   it("matches whole words only", () => {
      expect(marked("YOUR AWS, OUR VPC")).toEqual([
         { at: 5, text: "AWS", term: "AWS" },
         { at: 14, text: "VPC", term: "VPC" },
      ]);
      expect(marked("FAWS EC2s")).toEqual([]);
      expect(marked("AWS/EC2 (VPC)")).toEqual([
         { at: 0, text: "AWS", term: "AWS" },
         { at: 4, text: "EC2", term: "EC2" },
         { at: 9, text: "VPC", term: "VPC" },
      ]);
   });

   it("prefers the longest surface form", () => {
      expect(marked("Amazon Web Services, then AWS")).toEqual([
         { at: 0, text: "Amazon Web Services", term: "AWS" },
      ]);
      expect(marked("on Amazon EC2")).toEqual([
         { at: 3, text: "Amazon EC2", term: "EC2" },
      ]);
   });

   it("is case-sensitive so acronyms do not match ordinary words", () => {
      expect(marked("aws and ec2")).toEqual([]);
   });
});

describe("glossary entries", () => {
   it("only defines terms that occur in the site copy", () => {
      const copy = JSON.stringify([personalData, projectsData, experienceData]);
      const found = new Set(marked(copy).map((segment) => segment.term));
      for (const { term } of GLOSSARY) expect(found.has(term), term).toBe(true);
   });

   it("keeps each definition to one short plain sentence", () => {
      for (const { term, definition } of GLOSSARY) {
         expect(definition.split(/\s+/).length, term).toBeLessThanOrEqual(22);
         expect(
            DASHES.some((dash) => definition.includes(dash)),
            term,
         ).toBe(false);
         expect(definition.endsWith("."), term).toBe(true);
      }
   });

   it("never maps one surface form to two terms", () => {
      const forms = GLOSSARY.flatMap(({ match }) => match);
      expect(new Set(forms).size).toBe(forms.length);
   });
});
