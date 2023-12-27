import React, { ChangeEventHandler, FC, memo, useCallback, useRef } from "react";
import { Heading, HStack, IconButton, Input } from "@chakra-ui/react";
import { BsPlusCircleFill } from "react-icons/bs";
import { Maybe } from "@/utils/models/common";

interface Props {
  content: string | React.ReactNode;
  changeHandler: (files: Maybe<FileList>) => void;
  accept: string;
}

const UploadFile: FC<Props> = ({ content, changeHandler, accept }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadFileClick = useCallback(() => fileInputRef.current?.click(), []);

  const onChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    e => changeHandler(e.target.files),
    [changeHandler],
  );

  return (
    <>
      <HStack spacing={5} paddingY={5}>
        {typeof content === "string" ? (
          <Heading as="h4" size="lg" color="blue.500">
            {content}
          </Heading>
        ) : (
          content
        )}
        <IconButton
          isRound
          aria-label="Upload file"
          icon={<BsPlusCircleFill />}
          colorScheme="blue"
          fontSize="20px"
          onClick={uploadFileClick}
        />
        <Input
          ref={fileInputRef}
          multiple={false}
          type="file"
          name="file"
          title=""
          accept={accept}
          position="absolute"
          display="none"
          top={0}
          bottom={0}
          left={0}
          onChange={onChange}
        />
      </HStack>
    </>
  );
};

export default memo(UploadFile);
