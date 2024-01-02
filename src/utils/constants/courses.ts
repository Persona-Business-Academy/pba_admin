import { Topic } from "@prisma/client";
import { CurrencyType, LanguageType, SkillLevelType, TopicType } from "../models/common";

const SKILL_LEVELS: Array<{ name: SkillLevelType; value: SkillLevelType }> = [
  { name: "ADVANCED", value: "ADVANCED" },
  { name: "BEGINNER", value: "BEGINNER" },
  { name: "INTERMEDIATE", value: "INTERMEDIATE" },
  { name: "MASTER", value: "MASTER" },
];

const TOPICS: Array<{ name: string; value: TopicType }> = [
  { name: "Front End", value: Topic.FRONT_END },
  { name: "Back End", value: Topic.BACK_END },
  { name: "SMM", value: Topic.SMM },
  { name: "Digital Marketing", value: Topic.DIGITAL_MARKETING },
  { name: "Graphic Design", value: Topic.GRAPHIC_DESIGN },
  { name: "UI UX Design", value: Topic.UI_UX_DESIGN },
  { name: "Business Law", value: Topic.BUSINESS_LAW },
  { name: "Business English", value: Topic.BUSINESS_ENGLISH },
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
