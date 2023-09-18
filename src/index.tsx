import React, {Suspense} from 'react';
import './index.css';
import Fallback from "./Components/SuspenseFallback/SuspenseFallback";
import Theme from "./Components/Providers/Theme/Theme";
import Routes from "./Routes/Routes";
import {createRoot} from 'react-dom/client';
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const container = document.getElementById('root');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(
  <React.StrictMode>
    {/*<I18nextProvider i18n={i18n}>*/}
      <Theme>
        <Suspense fallback={<Fallback/>}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Routes/>
          </LocalizationProvider>
        </Suspense>
      </Theme>
    {/*</I18nextProvider>*/}
</React.StrictMode>
);


serviceWorkerRegistration.register();
