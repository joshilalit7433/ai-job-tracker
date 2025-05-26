import skillReference from "../data/skills_reference.json" assert { type: "json" };

export const extractSkills = (resumeText) => {
  const lowerText = resumeText.toLowerCase();
  return skillReference.skills.filter(skill =>
    lowerText.includes(skill.toLowerCase())
  );
};
