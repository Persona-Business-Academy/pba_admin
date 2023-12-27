export const generateAWSUrl = (key: string) => `${process.env.NEXT_PUBLIC_CLOUD_FRONT_URL}/${key}`;

export const validateAgeLimit = (ageLimit: string) => {
  const ageLimitArr = ageLimit.split("-");
  const from = +ageLimitArr[0];
  const to = +ageLimitArr[1];

  return isNaN(+from) || isNaN(+to) || +to >= +from;
};
