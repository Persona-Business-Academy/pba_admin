import { ChangeEventHandler, FC, memo, useCallback, useRef } from "react";
import { Center, IconButton, Input, Text, VStack } from "@chakra-ui/react";
import { FiUpload } from "react-icons/fi";
import { colors } from "@/constants/chakra";
import { Maybe } from "@/models/common";

interface Props {
  changeHandler: (files: Maybe<FileList>) => void;
}

const UploadFile: FC<Props> = ({ changeHandler }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadFileClick = useCallback(() => fileInputRef.current?.click(), []);

  const onChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => changeHandler(e.target.files),
    [changeHandler]
  );

  return (
    <Center
      w={400}
      h={150}
      maxW={400}
      border={`2px dashed ${colors.blue[500]}`}
      borderRadius={12}
    >
      <VStack>
        <IconButton
          colorScheme="blue"
          aria-label="Upload file"
          icon={<FiUpload />}
          onClick={uploadFileClick}
        />
        <Text color="blue.500">Upload File</Text>
      </VStack>
      <Input
        ref={fileInputRef}
        multiple={false}
        type="file"
        name="file"
        title=""
        accept="*"
        position="absolute"
        display="none"
        top={0}
        bottom={0}
        left={0}
        onChange={onChange}
      />
    </Center>
  );
};

export default memo(UploadFile);
