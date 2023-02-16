import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface IProps {
  title: string;
  description: string;
  imgUrl: string;
  backgroundColor: string;
}

function HeroComponent(props: IProps) {
  const { title, description, imgUrl, backgroundColor } = props;
  return (
    <>
      <Box
        sx={{
          width: "90%",
          marginLeft: "20%",
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid
          container
          spacing={0}
          style={{
            height: "100%",
          }}
        >
          <Grid
            style={{
              height: "100%",
              marginLeft: "30%",
              alignItems: "right",
              justifyContent: "right",
            }}
            item
            xs={4}
          >
            <img src={imgUrl} />
          </Grid>
        </Grid>
        <Grid
          container
          spacing={0}
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginRight: "30%",
          }}
        >
          <Grid
            item
            xs={12}
            columnSpacing={0}
            rowSpacing={0}
            direction="column"
          >
            <Typography component="div" variant="h5">
              {title}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {description}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default HeroComponent;
