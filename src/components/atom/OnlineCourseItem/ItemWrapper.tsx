import { FC, memo } from "react";
import { Box } from "@chakra-ui/react";

type ItemWrapperProps = {
  children: React.ReactNode;
};

const ItemWrapper: FC<ItemWrapperProps> = ({ children }) => <Box paddingLeft={10}>{children}</Box>;

export default memo(ItemWrapper);
