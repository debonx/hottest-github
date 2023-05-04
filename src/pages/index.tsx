import Head from 'next/head'
import { BottomNavigation, Box, Container, Paper, Typography } from '@mui/material'
import RepositoryTabs from '@/components/repository-tabs/repository-tabs'
import { QueryClient, dehydrate } from '@tanstack/react-query'
import { fetchRepositories } from '@/utils/dataHandler'
import Link from 'next/dist/client/link'

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
          <RepositoryTabs />
        </Box>
      </Container>
      <Box component={'div'} sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '40px', padding: '10px', backgroundColor: 'black', color: 'white', textAlign: 'center' }} 
      >
          <Box component={'span'}>{`Made with ❤️ by `}<Link href="https://github.com/debonx" target="_blank">{'debonx'}</Link></Box>
      </Box>
    </>
  )
}

export const getStaticProps = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['repositories'], 
    queryFn: () => fetchRepositories()
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    }
  }
}

