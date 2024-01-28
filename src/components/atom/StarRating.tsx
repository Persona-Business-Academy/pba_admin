import { FC, memo, useState } from "react";
import { StarIcon } from "@chakra-ui/icons";
import { Box, Flex, FormControl, FormLabel, Icon } from "@chakra-ui/react";
import { Maybe } from "@/utils/models/common";

type Props = {
  name: string;
  formLabelName: string;
  rating: number;
  onChange: (value: number) => void;
};

const ratings = [1, 2, 3, 4, 5];

const StarRating: FC<Props> = ({ name, formLabelName, rating, onChange }) => {
  const [hover, setHover] = useState<Maybe<number>>(null);

  return (
    <FormControl id={name}>
      <FormLabel fontWeight={600} marginBottom={4} lineHeight="20px" fontSize={14} color="#222">
        {formLabelName}
      </FormLabel>
      <Flex>
        {ratings.map(value => (
          <Box
            key={value}
            cursor="pointer"
            onClick={() => onChange(value)}
            onMouseEnter={() => setHover(value)}
            onMouseLeave={() => setHover(null)}>
            <Icon
              as={StarIcon}
              color={value <= (hover || rating) ? "yellow.400" : "gray.200"}
              boxSize={6}
            />
          </Box>
        ))}
      </Flex>
    </FormControl>
  );
};

export default memo(StarRating);
