import Head from 'next/head'
import { Inter } from 'next/font/google'
import { AppBar, Box, Container, Tab, Tabs, Toolbar, Typography } from '@mui/material'
import NavigationTabs from '@/components/navigation-tabs/navigation-tabs'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Latest Hot GitHub Repositories</title>
        <meta name="description" content="Explore the letest and hottest GitHub repositories." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxWidth='md'>
        <Box component='header' role='banner' sx={{ paddingTop: '20px', paddingBottom: '20px' }}>
          <Typography component="h1" sx={{ fontSize: '2rem', flexGrow: 1, justifyContent: 'center' }}>
            {'Latest Hot GitHub Repositories'}
          </Typography>
        </Box>
        <Box component='main' role='main'>
          <NavigationTabs />
        </Box>
        <Box component='footer'>
          <p>Made with love by <a href="" target='_blank'>debonx</a></p>
        </Box>
      </Container>
    </>
  )
}

