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
          backdropFilter: "blur(5px)",
          width: "80%",
          marginLeft: "10%",
          marginRight: "10%",
          //marginLeft: "10%",
          //flexGrow: 1,
          display: "flex",
          //height: "100%",
          WebkitBackdropFilter: "blur(5px)",
          background:
            "linear-gradient(90deg, rgba(41,171,135,0.47942927170868344) 0%, rgba(67,244,186,1) 100%);",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Grid
          container
          spacing={0}
          alignItems="center"
          style={{
            height: "100%",
          }}
        >
          <Grid
            style={{
              height: "100%",
              //marginLeft: "30%",
              // alignItems: "center",
              // justifyContent: "center",
            }}
            item
            sm={5}
            md={5}
          >
            <img src={imgUrl} />
          </Grid>

          <Grid
            item
            sm={5}
            md={5}
            columnSpacing={0}
            rowSpacing={0}
            alignContent="center"
            style={
              {
                // alignItems: "center",
                // justifyContent: "center",
                //marginRight: "20%",
              }
            }
          >
            <Typography component="div" variant="h3">
              {title}
            </Typography>
            <Typography component="div" variant="body1">
              {title_jap}
            </Typography>
            <Typography component="div" variant="body1">
              {title_eng}
            </Typography>
            {description}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default HeroComponent;
