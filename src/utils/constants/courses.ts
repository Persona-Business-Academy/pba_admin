import { Topic } from "@prisma/client";
import { CurrencyType, LanguageType, SkillLevelType } from "../models/common";

const SKILL_LEVELS: Array<{ name: SkillLevelType; value: SkillLevelType; order: number }> = [
  { name: "ADVANCED", value: "ADVANCED", order: 3 },
  { name: "BEGINNER", value: "BEGINNER", order: 1 },
  { name: "INTERMEDIATE", value: "INTERMEDIATE", order: 2 },
  { name: "MASTER", value: "MASTER", order: 4 },
];

const TOPICS: Array<{ name: string; value: Topic }> = [
  { name: "Development", value: Topic.DEVELOPMENT },
  { name: "Marketing", value: Topic.DIGITAL_MARKETING },
  { name: "Management", value: Topic.MANAGEMENT },
  { name: "Design", value: Topic.DESIGN },
  { name: "Other", value: Topic.OTHER },
];

const LANGUAGES: Array<{ name: string; value: LanguageType }> = [
  { name: "Armenian", value: "ARM" },
  { name: "English", value: "EN" },
];

const CURRENCIES: Array<{ name: CurrencyType; value: CurrencyType }> = [
  { name: "AMD", value: "AMD" },
  { name: "USD", value: "USD" },
];

export { SKILL_LEVELS, TOPICS, LANGUAGES, CURRENCIES };
