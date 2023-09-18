import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import VideoCameraBackOutlinedIcon from '@mui/icons-material/VideoCameraBackOutlined';
import AudioFileOutlinedIcon from '@mui/icons-material/AudioFileOutlined';
import TextFieldsOutlinedIcon from '@mui/icons-material/TextFieldsOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import {OverridableStringUnion} from "@mui/types";
import {SvgIconPropsSizeOverrides} from "@mui/material/SvgIcon/SvgIcon";

export type FileType = 'application' | 'image' | 'video' | 'audio' | 'text' | 'message' | 'multipart' | null | undefined;

export const getFileIcon = (fileType: FileType, size: OverridableStringUnion<'inherit' | 'large' | 'medium' | 'small', SvgIconPropsSizeOverrides> = "medium") => {
  switch (fileType) {
    case 'application':
      return <DescriptionOutlinedIcon color="primary" fontSize={size}/>;
    case 'image':
      return <ImageOutlinedIcon color="primary" fontSize={size}/>;
    case 'video':
      return <VideoCameraBackOutlinedIcon color="primary" fontSize={size}/>;
    case 'audio':
      return <AudioFileOutlinedIcon color="primary" fontSize={size}/>;
    case 'text':
      return <TextFieldsOutlinedIcon color="primary" fontSize={size}/>;
    case 'message':
      return <MessageOutlinedIcon color="primary" fontSize={size}/>;
    case 'multipart':
      return <FolderOpenOutlinedIcon color="primary" fontSize={size}/>;
    default:
      return <DescriptionOutlinedIcon color="primary" fontSize={size}/>;
  }
}