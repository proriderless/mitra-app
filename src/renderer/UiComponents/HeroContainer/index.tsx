import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface IProps {
  title: string;
  title_eng: string;
  title_jap: string;
  description: string;
  imgUrl: string;
  backgroundColor: string;
}

function HeroComponent(props: IProps) {
  const { title, title_eng, title_jap, description, imgUrl, backgroundColor } =
    props;
  return (
    <>
      {/* <div
        style={{
          //backdropFilter:"blur(5px)",
          //filter: "blur(5px)",
          // background:
          //         "linear-gradient(90deg, rgba(51,235,190,0.47942927170868344) 0%, rgba(67,244,186,1) 100%);",
          //background: "rgb(51,235,190)",
          background: "linear-gradient(90deg, rgba(51,235,190,0.47942927170868344) 0%, rgba(67,244,186,1) 100%)",
          backgroundSize: '100% auto',
          backgroundPosition: 'center',
          width:"100%",
          height:"100%",
          position:"absolute",
        }}
      >
      </div> */}
      <Box
        sx={{
          backdropFilter:"blur(5px)",
          width: "100%",
          //marginLeft: "10%",
          //flexGrow: 1,
          display: "flex",
          height:"100%",
          WebkitBackdropFilter:"blur(5px)",
          background:
                  "linear-gradient(90deg, rgba(51,235,190,0.47942927170868344) 0%, rgba(67,244,186,1) 100%);",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
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
              marginLeft: "50%",
              alignItems: "center",
              justifyContent: "right",
            }}
            item
            xs={12}
            lg={4}
          >
            <img src={imgUrl} />
          </Grid>
        </Grid>
        <Grid
          container
          spacing={0}
          style={{
            alignItems: "center",
            justifyContent: "left",
            //marginRight: "30%",
          }}
        >
          <Grid
            item
            xs={12}
            lg={8}
            columnSpacing={0}
            rowSpacing={0}
            direction="column"
          >
            <Typography component="div" variant="h5">
              {title}
            </Typography>

            <Typography component="div" variant="body1">
              {title_jap}
            </Typography>
            <Typography component="div" variant="body1">
              {title_eng}
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
