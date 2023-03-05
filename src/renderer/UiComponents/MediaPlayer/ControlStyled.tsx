import styled from "styled-components";
import { Typography } from "@mui/material";

interface IMediaVideoControlContainer{
  opacity?: string,
}

export const FlexContainerCenter = styled("div")`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  padding: 2px 10px;
`;

export const InlineContainer = styled("div")`
  display: inline;
`;

//Configuration for bottom centering
export const MediaVideoControlContainer = styled("div")<IMediaVideoControlContainer>`
  display: 'inline';
  background-color: rgba(255, 255, 255, 0.55);
  border-radius: 5px;
  padding: 1rem 5px;
  -webkit-backdrop-filter: blur(10px);
  position: absolute;
  opacity: ${p => p.opacity || 1};
  left: 25%;
  bottom: 20px;
  width: 50%;
  height: 35%;
  max-height: 100px;
  z-index: 50;
  margin: 0 auto
`;

//Configuration for centering
// export const MediaVideoControlContainer = styled("div")<IMediaVideoControlContainer>`
//   display: 'inline';
//   background-color: rgba(255, 255, 255, 0.55);
//   border-radius: 5px;
//   padding: 1rem 5px;
//   -webkit-backdrop-filter: blur(10px);
//   position: absolute;
//   opacity: ${p => p.opacity || 1};
//   left: 0;
//   right: 0;
//   top: 0;
//   bottom: 0;
//   width: 50%;
//   height: 25%;
//   max-height: 100px;
//   z-index: 50;
//   margin: auto
// `;


export const TinyText = styled(Typography)({
  fontSize: '0.75rem',
  opacity: 0.38,
  fontWeight: 500,
  letterSpacing: 0.2,
});

export const AlignFarLeft = styled('div')`
  text-align: left
`

export const AlignFarRight = styled('div')`
  align-item: flex-end;
  position: absolute;
`