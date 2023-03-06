import { Fragment } from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import { publicRoutes } from 'routes';
import {useMemo} from 'react'
import { useSelector } from 'react-redux';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from "@mui/material/styles";
import { themeSettings } from 'theme';

function App() {
  const mode = useSelector(state => state.mode)
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])
  const isAuth = Boolean(useSelector(state => state.user))
  return (
    <div className='app'>
      <Router>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            {
              publicRoutes.map((route, idx) =>{
                let Layout = route.layout
                const Page = route.component
                if(!Layout) Layout = Fragment
                if (route.path === '/login') return <Route key={idx} path={route.path} element={<Layout><Page /></Layout>}/>
                return <Route key={idx} path={route.path} element={isAuth ? <Layout><Page /></Layout> : <Navigate to='login'/>} />
              })
            }
          </Routes>
        </ThemeProvider>
      </Router>
    </div>
  );
}

export default App;
