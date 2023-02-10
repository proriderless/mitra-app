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
  const swatch = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [isOpen, toggle] = useState(false);

  const close = useCallback(() => toggle(false), []);
  useClickOutside(popover, close);

  React.useEffect(() => {
    const swatchRef = swatch.current;
    const colorSwatch = popover.current;

    window.addEventListener('scroll', () => {
      colorSwatch.style.top = swatchRef.offsetTop - window.scrollY + 'px';
    });

    return () => {
      window.removeEventListener('scroll', () => {
        colorSwatch.style.top = swatchRef.offsetTop - window.scrollY + 'px';
      });
    };

  }, []);


  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
      >
        <div className="picker" ref={swatch} style={{position: 'relative'}}>
          <div
            className="swatch"
            style={{
              backgroundColor: color,
              position: 'relative',
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
            <div className="popover" ref={popover} style={{position:'fixed', zIndex:'5'}}>
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
