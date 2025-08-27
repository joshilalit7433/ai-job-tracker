import skillReference from "../data/skills_reference.json";

export const extractSkills = (resumeText: string) => {
  const lowerText = resumeText.toLowerCase();
  return skillReference.skills.filter(skillObj =>
    skillObj.aliases.some(alias => lowerText.includes(alias.toLowerCase()))
  );
};
