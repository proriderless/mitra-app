import React, { useCallback, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { TextField } from "@mui/material";
import Stack from "@mui/material/Stack";
import useClickOutside from "./useClickOutside";

type PopPicker = {
  color: string;
  onChange: any;
};

function PopoverColorPicker({ color, onChange }: PopPicker) {
  const popover = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [isOpen, toggle] = useState(false);

  const close = useCallback(() => toggle(false), []);
  useClickOutside(popover, close);

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
      >
        <div className="picker">
          <div
            className="swatch"
            style={{
              backgroundColor: color,
              width: "20px",
              height: "20px",
              border: '3px',
              borderStyle: 'solid',
              borderRadius: '4px',
              borderColor: '#7a7a7a',
              alignContent: "center",
            }}
            onClick={() => toggle(true)}
          ></div>
          {isOpen && (
            <div className="popover" ref={popover} style={{position:'static', zIndex:'5'}}>
              <HexColorPicker color={color} onChange={onChange} />
            </div>
          )}
        </div>
        <TextField
          id="outlined-basic"
          label="Background Color"
          value={color}
          onChange={(e) => onChange(e.currentTarget.value)}
          variant="outlined"
        />
      </Stack>
    </>
  );
}

export default PopoverColorPicker;
