import { FC, memo } from 'react';
import { Box, Collapse, Icon, Stack, Text, useDisclosure } from '@chakra-ui/react';
import { SubLabels } from '@/models/header';

interface MobileNavItemProp {
  label: string;
  children?: SubLabels[];
}

const MobileNavItem: FC<MobileNavItemProp> = ({ label, children }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={!!children ? onToggle : () => {}} maxWidth={1200} margin="0 auto">
      <Box
        py={2}
        justifyContent="space-between"
        alignItems="center"
        _hover={{
          textDecoration: 'none',
        }}>
        <Text fontWeight={600}>{label}</Text>
        {children && (
          <Icon
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Box>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack mt={2} pl={4} borderLeft={1} borderStyle={'solid'} align={'start'}>
          {(children || []).map((child: SubLabels, i) => (
            <Box key={i}>{child.label}</Box>
          ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

export default memo(MobileNavItem);
