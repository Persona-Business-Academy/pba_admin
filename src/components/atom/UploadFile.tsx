import { ChangeEventHandler, FC, memo, useCallback, useRef } from "react";
import { IconButton, Input } from "@chakra-ui/react";
import { BsPlusCircleFill } from "react-icons/bs";
import { Maybe } from "@/models/common";

interface Props {
  changeHandler: (files: Maybe<FileList>) => void;
}

const UploadFile: FC<Props> = ({ changeHandler }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadFileClick = useCallback(() => fileInputRef.current?.click(), []);

  const onChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    e => changeHandler(e.target.files),
    [changeHandler],
  );

  return (
    <>
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
        accept="*"
        position="absolute"
        display="none"
        top={0}
        bottom={0}
        left={0}
        onChange={onChange}
      />
    </>
  );
};

export default memo(UploadFile);
