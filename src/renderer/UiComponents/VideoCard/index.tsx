import React from 'react'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';

type IProps = {
    videoSrc: string,
    summonMediaPlayer: any
}

function VideoCard(props:IProps) {

    const {videoSrc, summonMediaPlayer} = props

    function stripMitra(videoSrc:string) {
        let newVideo = videoSrc.replace('mitra:///', '')
        return newVideo
    }
    

    return(
    <Card sx={{ display: 'flex', width: '30%', margin: '5px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="body1">
            {videoSrc}
          </Typography>
        </CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
            <IconButton onClick={() => {summonMediaPlayer(stripMitra(videoSrc)); window.scrollTo(0, 0)}}>
                <PlayArrowIcon/>
            </IconButton>
        </Box>
      </Box>
      <OndemandVideoIcon/>
    </Card>
    )
}


export default VideoCard