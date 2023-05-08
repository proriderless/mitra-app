import React from 'react'
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { makeStyles } from "@material-ui/core/styles";
import { CardActions } from "@mui/material";
import Button from "@mui/material/Button";

interface IProps {
    mangaObj: {
        [key: string]: any;
    };
    setOpenDialog: any;
    setSelectedID: any;
}

function MangaCard(props: IProps){
    const {mangaObj, setSelectedID, setOpenDialog} = props;
    
    <Card>
        
    </Card>

}