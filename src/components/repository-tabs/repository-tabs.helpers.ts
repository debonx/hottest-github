export function a11yProps(index: number) {
    return {
      id: `navigation-tab-${index}`,
      'aria-controls': `navigation-tabpanel-${index}`,
    };
  }